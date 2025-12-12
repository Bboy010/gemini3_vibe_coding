import React from 'react';
import { InventoryItem, ItemCategory } from '../types';
import { Package, Calendar, Tag, Layers } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
}

const getCategoryColor = (category: string) => {
  const normalized = category.toLowerCase();
  if (normalized.includes('canned')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (normalized.includes('grain') || normalized.includes('pasta')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (normalized.includes('produce') || normalized.includes('fresh')) return 'bg-green-100 text-green-800 border-green-200';
  if (normalized.includes('snack')) return 'bg-orange-100 text-orange-800 border-orange-200';
  if (normalized.includes('beverage')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
  return 'bg-slate-100 text-slate-800 border-slate-200';
};

const InventoryTable: React.FC<InventoryTableProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
      <div className="p-4 border-b border-slate-100 bg-emerald-50/50 flex items-center justify-between">
        <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          Identified Items ({items.length})
        </h3>
        <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="px-6 py-3">Item Name</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Brand</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Best Before</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-400" />
                    {item.name}
                  </div>
                </td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {item.brand}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {item.bestBefore ? (
                      <>
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{item.bestBefore}</span>
                      </>
                    ) : (
                      <span className="text-slate-400 italic">--</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;