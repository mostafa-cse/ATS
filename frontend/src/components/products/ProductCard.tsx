'use client';

import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    category: string;
    basePrice: number;
    discountPrice?: number;
    // Mocked specs for the UI since backend doesn't have them yet
    specs?: { label: string; value: string }[]; 
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  // Generate some mock specs if none provided
  const specs = product.specs || [
    { label: 'Display Size (Inch)', value: '23.8' },
    { label: 'Display Resolution', value: '1920x1080' },
    { label: 'Panel Type', value: 'IPS' },
    { label: 'Refresh Rate (Hz)', value: '100Hz' },
    { label: 'Rotatable', value: 'No' },
    { label: 'HDMI Port', value: '1' },
    { label: 'Color', value: 'Black' },
  ];

  return (
    <div className="group relative bg-card border border-border flex flex-col hover:shadow-lg transition-shadow">
      {/* Product Image Area */}
      <div className="aspect-[4/3] bg-white p-4 flex items-center justify-center border-b border-border relative overflow-hidden">
        {/* Placeholder for the image */}
        <div className="w-4/5 h-4/5 bg-secondary/30 rounded flex items-center justify-center text-muted-foreground/50 text-4xl font-bold font-mono group-hover:scale-105 transition-transform">
          IMG
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-bold text-sm text-primary mb-1 hover:underline cursor-pointer line-clamp-2">
          <Link href={`/products/${product.id}`}>
            {product.name}
          </Link>
        </h3>
        
        {/* Subtitle / SKU placeholder */}
        <div className="text-xs text-muted-foreground mb-4">
          08.01.020.183
        </div>

        {/* Specs List */}
        <ul className="text-xs text-muted-foreground space-y-1 mb-6 flex-1 list-disc pl-4">
          {specs.map((spec, idx) => (
            <li key={idx}>
              {spec.label} - {spec.value}
            </li>
          ))}
        </ul>

        {/* Price and Cart */}
        <div className="mt-auto flex flex-col items-center pt-4 border-t border-border">
          {product.discountPrice ? (
            <div className="text-center mb-4">
              <div className="font-bold text-lg text-foreground mb-1">Tk {product.discountPrice.toLocaleString()}</div>
              <div className="text-xs text-blue-600 font-medium">
                Save Tk {(product.basePrice - product.discountPrice).toLocaleString()} on online order
              </div>
            </div>
          ) : (
            <div className="font-bold text-lg text-foreground mb-4">Tk {product.basePrice.toLocaleString()}</div>
          )}
          
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 text-sm transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
