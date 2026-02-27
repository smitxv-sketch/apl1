import express from "express";
import { createServer as createViteServer } from "vite";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Простой in-memory кеш
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
        id: node.unique_id || crypto.randomUUID(),
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
        ownersNumber: node.owners_number || '',
        // Внутренние поля (если есть в фиде)
        buyPrice: Number(node.buy_price) || 0,
        daysInStock: Number(node.days_in_stock) || 0,
      };
    });

    carsCache = parsedCars;
    cacheExpiresAt = Date.now() + CACHE_TTL;
    console.log(`Parsed and cached ${parsedCars.length} cars`);
    
    return parsedCars;
  }

  // Публичный API (без VIN и внутренних цен)
  app.get("/api/cars", async (req, res) => {
    try {
      const cars = await fetchAndParseCars();
      // SOC: Убираем приватные поля
      const publicCars = cars.map(({ vin, buyPrice, daysInStock, ...rest }) => rest);
      res.json(publicCars);
    } catch (error) {
      console.error("Ошибка при загрузке XML на сервере:", error);
      res.status(500).json({ error: "Failed to fetch XML feed" });
    }
  });

  // Внутренний API (с полными данными)
  // TODO: В Шаге 6 добавим сюда проверку токена (requireAuth)
  app.get("/api/internal/cars", async (req, res) => {
    try {
      const cars = await fetchAndParseCars();
      res.json(cars);
    } catch (error) {
      console.error("Ошибка при загрузке XML на сервере:", error);
      res.status(500).json({ error: "Failed to fetch XML feed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Раздача статики в production
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
