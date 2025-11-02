// server/services/shopping-list/normalizer.ts
const CANONICALS: Array<{ match: RegExp; name: string }> = [
  { match: /chicken\s*breast/i, name: 'Chicken breast' },
  { match: /ground\s*beef/i, name: 'Ground beef' },
  { match: /ground\s*turkey/i, name: 'Ground turkey' },
  { match: /greek\s*yogurt/i, name: 'Greek yogurt' },
  { match: /brown\s*rice/i, name: 'Brown rice' },
  { match: /white\s*rice/i, name: 'White rice' },
  { match: /broccoli/i, name: 'Broccoli' },
  { match: /olive\s*oil/i, name: 'Olive oil' },
  { match: /salt/i, name: 'Salt' },
  { match: /black\s*pepper|pepper\b/i, name: 'Black pepper' },
  // add more as needed over time
];

export function canonicalName(raw: string): string {
  const s = raw.trim();
  for (const c of CANONICALS) {
    if (c.match.test(s)) return c.name;
  }
  // Title-case fallback
  return s.charAt(0).toUpperCase() + s.slice(1);
}
