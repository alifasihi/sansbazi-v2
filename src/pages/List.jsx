import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import data from '../data/arenas.json';
import ArenaCard from '../components/ArenaCard';
import { MapPinIcon, FunnelIcon, CalendarDaysIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function List() {
  const [searchParams, setSearchParams] = useSearchParams();

  const city = searchParams.get('city') || '';
  const sport = searchParams.get('sport') || '';
  const date = searchParams.get('date') || '';

  // فیلتر کردن داده‌ها
  const filteredArenas = data.filter((arena) => {
    return (
      (!city || arena.city.toLowerCase().includes(city.toLowerCase())) &&
      (!sport || (arena.sportTypeFa || arena.sportType).toLowerCase().includes(sport.toLowerCase()))
    );
    // نکته: فیلتر تاریخ (date) رو بعداً وقتی سانس‌ها بر اساس تاریخ فیلتر شدن، اضافه می‌کنیم
  });

  // حذف یک فیلتر
  const removeFilter = (key) => {
    searchParams.delete(key);
    setSearchParams(searchParams);
  };

  // حذف همه فیلترها
  const clearAllFilters = () => {
    setSearchParams({});
  };

  const hasFilters = city || sport || date;

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* بخش نتایج و فیلترها */}
        <div className="bg-glass/90 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-glass">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-modernBlue to-neonBlue bg-clip-text text-transparent">
                نتایج جستجو
              </h2>
              <p className="text-slate-600 mt-2">
                {filteredArenas.length > 0
                  ? `${filteredArenas.length} سالن ورزشی یافت شد`
                  : 'هیچ سالنی با این شرایط یافت نشد'}
              </p>
            </div>

            {hasFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-slate-600 hover:text-neonPurple font-medium flex items-center gap-2 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
                حذف همه فیلترها
              </button>
            )}
          </div>

          {/* نمایش فیلترهای فعال */}
          {hasFilters && (
            <div className="flex flex-wrap gap-3">
              {city && (
                <div className="flex items-center gap-2 bg-glassDark/80 rounded-2xl px-4 py-2.5 border border-glass">
                  <MapPinIcon className="w-5 h-5 text-neonBlue" />
                  <span className="text-sm font-medium">شهر: {city}</span>
                  <button
                    onClick={() => removeFilter('city')}
                    className="ml-2 text-slate-500 hover:text-red-500 transition-colors"
                    aria-label="حذف فیلتر شهر"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              {sport && (
                <div className="flex items-center gap-2 bg-glassDark/80 rounded-2xl px-4 py-2.5 border border-glass">
                  <FunnelIcon className="w-5 h-5 text-sportGreen" />
                  <span className="text-sm font-medium">ورزش: {sport}</span>
                  <button
                    onClick={() => removeFilter('sport')}
                    className="ml-2 text-slate-500 hover:text-red-500 transition-colors"
                    aria-label="حذف فیلتر ورزش"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              {date && (
                <div className="flex items-center gap-2 bg-glassDark/80 rounded-2xl px-4 py-2.5 border border-glass">
                  <CalendarDaysIcon className="w-5 h-5 text-neonPurple" />
                  <span className="text-sm font-medium">تاریخ: {date}</span>
                  <button
                    onClick={() => removeFilter('date')}
                    className="ml-2 text-slate-500 hover:text-red-500 transition-colors"
                    aria-label="حذف فیلتر تاریخ"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* لیست سالن‌ها یا پیام خالی */}
        {filteredArenas.length === 0 ? (
          <div className="text-center py-20 bg-glass/50 backdrop-blur-sm rounded-3xl border border-glass">
            <div className="text-8xl mb-6 opacity-30">🔍</div>
            <h3 className="text-3xl font-bold text-slate-700 mb-4">هیچ سالنی یافت نشد</h3>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              فیلترهای جستجو را تغییر دهید یا همه را حذف کنید تا همه سالن‌ها نمایش داده شوند.
            </p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-modernGreen to-neonGreen text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-glow"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredArenas.map((arena, index) => (
              <div
                key={arena.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
              >
                <ArenaCard arena={arena} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
