'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const filterSections = [
  { id: 'brand', name: 'Brand', options: ['Acer', 'Apple', 'ASUS', 'Dell', 'HP', 'Lenovo'] },
  { id: 'series', name: 'Series', options: ['Gaming', 'Business', 'Creator'] },
  { id: 'shape', name: 'Shape', options: ['Flat', 'Curved'] },
  { id: 'panel', name: 'Panel Surface', options: ['Matte', 'Glossy'] },
  { id: 'size', name: 'Display Size Range (Inch)', options: ['21.5', '24', '27', '32'] },
  { id: 'resolution', name: 'Display Resolution Range', options: ['1920x1080', '2560x1440', '3840x2160'] },
  { id: 'panelType', name: 'Panel Type', options: ['IPS', 'VA', 'TN', 'OLED'] },
];

export default function FilterSidebar() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    brand: true,
    size: false,
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full bg-card border border-border shadow-sm flex flex-col h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-emerald-600 text-white">
        <span className="font-bold">Filter By</span>
        <button className="text-sm font-medium hover:underline text-emerald-50">Reset</button>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {/* Price Range */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold">Price</span>
            <input type="checkbox" className="rounded accent-emerald-600" defaultChecked />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <input 
              type="number" 
              placeholder="0" 
              className="w-full px-2 py-1 text-sm border border-border rounded"
            />
            <span className="text-muted-foreground">-</span>
            <input 
              type="number" 
              placeholder="1135000" 
              className="w-full px-2 py-1 text-sm border border-border rounded"
            />
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
              Submit
            </button>
          </div>
          <input type="range" className="w-full accent-emerald-600" min="0" max="1135000" />
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="stock" className="rounded accent-emerald-600 h-4 w-4" defaultChecked />
          <label htmlFor="stock" className="text-sm font-medium">Exclude Out of Stock Items</label>
        </div>
      </div>

      <div className="border-t border-border">
        {/* Accordions */}
        {filterSections.map((section) => (
          <div key={section.id} className="border-b border-border last:border-0">
            <button 
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full p-3 text-sm font-semibold hover:bg-secondary/50 transition-colors"
            >
              {section.name}
              {openSections[section.id] ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {openSections[section.id] && (
              <div className="p-3 pt-0 flex flex-col gap-2">
                {section.options.map((opt) => (
                  <div key={opt} className="flex items-center gap-2">
                    <input type="checkbox" id={`${section.id}-${opt}`} className="rounded accent-emerald-600" />
                    <label htmlFor={`${section.id}-${opt}`} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                      {opt}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
