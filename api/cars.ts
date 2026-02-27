import { XMLParser } from "fast-xml-parser";
import { randomUUID } from "crypto";

// Простой in-memory кеш (работает пока жив контейнер функции)
let carsCache: any[] | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

const feedUrl = process.env.XML_FEED_URL || 'https://media.cm.expert/stock/export/cmexpert/dealer.site/all/all/f1be278e279b7dea06e6aee198c21696.xml';

async function fetchAndParseCars() {
  if (carsCache && Date.now() < cacheExpiresAt) {
    return carsCache;
  }

  console.log('Fetching XML from CM.Expert...');
  const response = await fetch(feedUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const xmlText = await response.text();
  
  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (tagName) => ['car', 'image'].includes(tagName),
  });
  
  const xmlDoc = parser.parse(xmlText);
  const carNodes = xmlDoc?.data?.cars?.car || [];

  const parsedCars = carNodes.map((node: any) => {
    // Обработка изображений
    let images: string[] = [];
    if (node.images && node.images.image) {
      images = node.images.image
        .map((img: any) => typeof img === 'string' ? img : img['#text'])
        .filter(Boolean);
    }

    return {
      id: node.unique_id || randomUUID(),
      mark: node.mark_id || 'Неизвестно',
      model: node.folder_id || 'Неизвестно',
      year: Number(node.year) || null,
      run: Number(node.run) || 0,
      price: Number(node.price) || 0,
      vin: node.vin || '',
      images: images,
      gearbox: node.gearbox || '',
      bodyType: node.body_type || '',
      drive: node.drive || '',
      description: node.description || '',
      engineVolume: node.engine_volume || null,
      enginePower: node.engine_power ? String(node.engine_power) : null,
      color: node.color || '',
      // Внутренние поля (если есть в фиде)
      buyPrice: Number(node.buy_price) || 0,
      daysInStock: Number(node.days_in_stock) || 0,
    };
  });

  carsCache = parsedCars;
  cacheExpiresAt = Date.now() + CACHE_TTL;
  
  return parsedCars;
}

export default async function handler(req, res) {
  try {
    const cars = await fetchAndParseCars();
    // SOC: Убираем приватные поля для публичного API
    const publicCars = cars.map(({ vin, buyPrice, daysInStock, ...rest }) => rest);
    
    // Разрешаем CORS (на всякий случай, если фронт на другом домене, хотя на Vercel это один домен)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    res.status(200).json(publicCars);
  } catch (error) {
    console.error("Ошибка при загрузке XML:", error);
    res.status(500).json({ error: "Failed to fetch XML feed" });
  }
}
