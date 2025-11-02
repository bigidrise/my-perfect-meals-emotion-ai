// server/services/shopping-list/unit-converter.ts
export type Qty = { amount: number; unit?: string }; // unit optional

const OZ_PER_LB = 16;
const TSP_PER_TBSP = 3;
const G_PER_KG = 1000;
const ML_PER_L = 1000;

export function normalizeUnit(amount: number, unit?: string): Qty {
  if (!unit) return { amount, unit };
  const u = unit.toLowerCase();

  // weight
  if (u === 'oz' || u === 'ounce' || u === 'ounces') return { amount, unit: 'oz' };
  if (u === 'lb' || u === 'lbs' || u === 'pound' || u === 'pounds') return { amount, unit: 'lb' };
  if (u === 'g' || u === 'gram' || u === 'grams') return { amount, unit: 'g' };
  if (u === 'kg' || u === 'kilogram' || u === 'kilograms') return { amount, unit: 'kg' };

  // volume (small)
  if (u === 'tsp' || u === 'teaspoon' || u === 'teaspoons') return { amount, unit: 'tsp' };
  if (u === 'tbsp' || u === 'tablespoon' || u === 'tablespoons') return { amount, unit: 'tbsp' };

  // volume (metric)
  if (u === 'ml' || u === 'milliliter' || u === 'milliliters') return { amount, unit: 'ml' };
  if (u === 'l' || u === 'liter' || u === 'liters') return { amount, unit: 'l' };

  // cups/sticks/etc. left as-is to avoid risky math
  return { amount, unit: u };
}

export function convertToPreferred(q: Qty): Qty {
  // Convert oz → lb if >= 16
  if (q.unit === 'oz' && q.amount >= OZ_PER_LB) {
    return { amount: q.amount / OZ_PER_LB, unit: 'lb' };
  }
  // Convert tsp → tbsp if >= 3
  if (q.unit === 'tsp' && q.amount >= TSP_PER_TBSP) {
    return { amount: q.amount / TSP_PER_TBSP, unit: 'tbsp' };
  }
  // Convert g → kg if >= 1000
  if (q.unit === 'g' && q.amount >= G_PER_KG) {
    return { amount: q.amount / G_PER_KG, unit: 'kg' };
  }
  // Convert ml → l if >= 1000
  if (q.unit === 'ml' && q.amount >= ML_PER_L) {
    return { amount: q.amount / ML_PER_L, unit: 'l' };
  }
  return q;
}

export function tryAggregateSameUnit(a: Qty, b: Qty): Qty | null {
  if ((a.unit || '') !== (b.unit || '')) return null;
  return { amount: a.amount + b.amount, unit: a.unit };
}
