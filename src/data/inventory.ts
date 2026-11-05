import { AlertTriangle, Sprout, AlertOctagon, Droplets, PackageCheck } from 'lucide-react';

export const inventoryAlerts = [
  { 
    id: 1, 
    name: 'FMD Vaccine (Batch 882)', 
    type: 'medicine',
    quantity: 40, 
    unit: 'doses',
    daysToExpire: 5, 
    status: 'critical_expiration',
    icon: AlertTriangle,
    avgConsumption: '120 doses/month',
    lastPurchasePrice: '$4.50'
  },
  { 
    id: 2, 
    name: 'Hybrid Seed Corn (Trait X)', 
    type: 'seeds',
    quantity: 120, 
    unit: 'bags',
    daysToExpire: 15, 
    status: 'warning_expiration',
    icon: Sprout,
    avgConsumption: '50 bags/season',
    lastPurchasePrice: '$245.00'
  },
  { 
    id: 3, 
    name: 'Cattle Mineral Supplement 50lb', 
    type: 'supplement',
    quantity: 2, 
    unit: 'bags',
    daysToExpire: 180, 
    status: 'critical_stock',
    icon: AlertOctagon,
    avgConsumption: '15 bags/month',
    lastPurchasePrice: '$48.00'
  },
  { 
    id: 4, 
    name: 'NPK Starter Fertilizer 04-14-08', 
    type: 'fertilizer',
    quantity: 50, 
    unit: 'tons',
    daysToExpire: 365, 
    status: 'ok',
    icon: Droplets,
    avgConsumption: '20 tons/month',
    lastPurchasePrice: '$780.00'
  },
  { 
    id: 5, 
    name: 'Glyphosate Herbicide Concentrate', 
    type: 'chemical',
    quantity: 5, 
    unit: 'gallons',
    daysToExpire: 365, 
    status: 'critical_stock',
    icon: AlertOctagon,
    avgConsumption: '40 gal/month',
    lastPurchasePrice: '$38.50'
  },
  { 
    id: 6, 
    name: 'Rabies Livestock Vaccine', 
    type: 'medicine',
    quantity: 50, 
    unit: 'doses',
    daysToExpire: 2, 
    status: 'critical_expiration',
    icon: AlertTriangle,
    avgConsumption: '80 doses/year',
    lastPurchasePrice: '$3.80'
  },
  { 
    id: 7, 
    name: 'High-Tensile Smooth Fence Wire', 
    type: 'material',
    quantity: 10, 
    unit: 'spools',
    daysToExpire: 999, 
    status: 'ok',
    icon: PackageCheck,
    avgConsumption: '2 spools/month',
    lastPurchasePrice: '$135.00'
  }
];
