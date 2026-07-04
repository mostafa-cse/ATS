'use client';

const topBrands = [
  'Acer', 'AOC', 'Apple', 'Arzopa', 'ASUS', 'BenQ', 'Dahua', 'Dell', 
  'Gigabyte', 'Hikvision', 'HP', 'Lenovo', 'LG', 'MSI', 'PC Power', 
  'Philips', 'Samsung', 'Thermaltake', 'Value Top', 'ViewSonic', 'Xiaomi'
];

export default function TopTagFilters() {
  return (
    <div className="flex flex-col gap-3 mb-6 bg-card border border-border p-4 shadow-sm">
      {/* Brands row */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {topBrands.map(brand => (
          <button 
            key={brand}
            className="px-3 py-1 text-xs font-medium border border-border bg-background hover:bg-secondary transition-colors text-foreground"
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
}
