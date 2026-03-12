import { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

const REQUISITES = [
  { label: 'Полное наименование', value: 'Общество с ограниченной ответственностью «АМИКО»' },
  { label: 'Сокращенное наименование', value: 'ООО «АМИКО»' },
  { label: 'Адрес юридического лица', value: '454021, Челябинская область, г. Челябинск, ул. Молдавская, д. 21' },
  { label: 'Фактический адрес', value: '454021, Челябинская область, г. Челябинск, ул. Молдавская, д. 21' },
  { label: 'ИНН', value: '7448256833' },
  { label: 'КПП', value: '744801001' },
  { label: 'ОГРН', value: '1247400009911' },
  { label: 'Контактный номер', value: '+7 (351) 777-77-23, +7 (951) 772-48-61' },
  { label: 'Директор', value: 'Куванышев Аманбол Сандвекович' },
  { label: 'Главный бухгалтер', value: 'Куванышев Аманбол Сандвекович' },
  { label: 'Банковские реквизиты', value: 'Наименование банка: ФИЛИАЛ "ЕКАТЕРИНБУРГСКИЙ" АО "АЛЬФА-БАНК"\nР/С: 40702810338460001156\nК/С: 30101810100000000964\nБИК: 046577964', isMultiline: true },
  { label: 'Основной код ОКВЭД', value: '45.11 Торговля легковыми автомобилями и грузовыми автомобилями малой грузоподъемности' },
  { label: 'E-mail', value: 'ooo.amiko@bk.ru' },
];

export function CompanyDetails() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const text = REQUISITES.map(r => `${r.label}:\n${r.value}`).join('\n\n');
    navigator.clipboard.writeText(`КАРТОЧКА ПРЕДПРИЯТИЯ ООО «АМИКО»\n\n${text}`);
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-50 to-white px-8 py-10 border-b border-slate-100 text-center relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#c00000]"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#c00000] tracking-tight mb-2 uppercase">
            Карточка предприятия
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-[#c00000]">
            ООО «АМИКО»
          </h3>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-8 py-8">
          <div className="flex justify-end mb-6">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#c00000] transition-colors bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-lg"
            >
              {copiedIndex === -1 ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copiedIndex === -1 ? 'Скопировано!' : 'Скопировать все'}
            </button>
          </div>

          <dl className="divide-y divide-slate-100 border-t border-slate-100">
            {REQUISITES.map((item, idx) => (
              <div key={idx} className="py-5 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 hover:bg-slate-50/50 transition-colors px-4 -mx-4 rounded-lg group">
                <dt className="text-sm font-medium text-slate-500 md:col-span-1 flex items-start pt-1">
                  {item.label}
                </dt>
                <dd className="text-sm text-slate-900 md:col-span-2 flex justify-between items-start gap-4">
                  <div className={item.isMultiline ? "whitespace-pre-wrap leading-relaxed text-slate-700" : "font-medium text-slate-800"}>
                    {item.value}
                  </div>
                  <button
                    onClick={() => handleCopy(item.value, idx)}
                    className="text-slate-400 hover:text-[#c00000] opacity-0 group-hover:opacity-100 transition-all p-1 flex-shrink-0"
                    title="Скопировать"
                  >
                    {copiedIndex === idx ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
