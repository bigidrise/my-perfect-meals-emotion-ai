export type AlcoholDrink = {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: "Wine" | "Light Cocktail" | "Mixer";
  servingMl: number;         // default: 150 for wine, 355 for tall, etc.
  abv_pct?: number;          // for spirits/wine if useful
  macros: {
    calories: number;
    carbs_g: number;
    sugars_g: number;
    // alcohol grams can be derived but not necessary to display
  };
  instructions?: string[];
  notes?: string[];          // “Ask for diet tonic”, “Skip simple syrup”, etc.
};
