export interface InventoryItem {
  name: string;
  quantity: string;
  brand: string;
  category: string;
  bestBefore: string | null;
}

export enum ItemCategory {
  Canned = 'Canned Goods',
  Grains = 'Grains & Pasta',
  Produce = 'Fresh Produce',
  Beverages = 'Beverages',
  Snacks = 'Snacks',
  Dairy = 'Dairy',
  Other = 'Other'
}

export type ScanStatus = 'idle' | 'scanning' | 'complete' | 'error';
