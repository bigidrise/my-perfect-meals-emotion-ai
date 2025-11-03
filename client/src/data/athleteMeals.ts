export type AthleteMeal = {
  id: string;
  title: string;
  protein_source: string;
  protein_oz: number;
  carb_source?: string;
  carb_g: number;
  fibrous_source: string[];
  macros: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
  category: "poultry" | "redmeat" | "fish" | "eggs_shakes";
};

const athleteMeals: AthleteMeal[] = [
  // Poultry
  {
    id: "athlete-chicken-1",
    title: "Grilled Chicken & Sweet Potato",
    protein_source: "Chicken Breast",
    protein_oz: 6,
    carb_source: "Sweet Potato",
    carb_g: 200,
    fibrous_source: ["Broccoli", "Asparagus"],
    macros: { kcal: 425, protein: 45, carbs: 45, fat: 5 },
    tags: ["High Protein", "Clean"],
    category: "poultry",
  },
  {
    id: "athlete-turkey-1",
    title: "Turkey Breast & Brown Rice",
    protein_source: "Turkey Breast",
    protein_oz: 6,
    carb_source: "Brown Rice",
    carb_g: 180,
    fibrous_source: ["Green Beans", "Bell Peppers"],
    macros: { kcal: 410, protein: 42, carbs: 42, fat: 6 },
    tags: ["Lean", "Competition Prep"],
    category: "poultry",
  },
  {
    id: "athlete-chicken-2",
    title: "Chicken & Jasmine Rice",
    protein_source: "Chicken Breast",
    protein_oz: 7,
    carb_source: "Jasmine Rice",
    carb_g: 150,
    fibrous_source: ["Zucchini", "Spinach"],
    macros: { kcal: 450, protein: 48, carbs: 40, fat: 6 },
    tags: ["High Protein", "Pre-Workout"],
    category: "poultry",
  },

  // Red Meat
  {
    id: "athlete-beef-1",
    title: "Lean Sirloin & Quinoa",
    protein_source: "Sirloin Steak (93% lean)",
    protein_oz: 6,
    carb_source: "Quinoa",
    carb_g: 170,
    fibrous_source: ["Brussels Sprouts", "Carrots"],
    macros: { kcal: 465, protein: 46, carbs: 42, fat: 10 },
    tags: ["Iron Rich", "Post-Workout"],
    category: "redmeat",
  },
  {
    id: "athlete-bison-1",
    title: "Bison & Oats",
    protein_source: "Ground Bison (90% lean)",
    protein_oz: 6,
    carb_source: "Steel Cut Oats",
    carb_g: 160,
    fibrous_source: ["Kale", "Mushrooms"],
    macros: { kcal: 440, protein: 44, carbs: 40, fat: 8 },
    tags: ["Lean", "High Protein"],
    category: "redmeat",
  },
  {
    id: "athlete-beef-2",
    title: "Top Round & Basmati",
    protein_source: "Top Round Steak",
    protein_oz: 6,
    carb_source: "Basmati Rice",
    carb_g: 175,
    fibrous_source: ["Green Beans", "Tomatoes"],
    macros: { kcal: 455, protein: 45, carbs: 43, fat: 7 },
    tags: ["Competition Prep", "Lean"],
    category: "redmeat",
  },

  // Fish
  {
    id: "athlete-tilapia-1",
    title: "Tilapia & Wild Rice",
    protein_source: "Tilapia Fillet",
    protein_oz: 7,
    carb_source: "Wild Rice",
    carb_g: 165,
    fibrous_source: ["Asparagus", "Cauliflower"],
    macros: { kcal: 395, protein: 42, carbs: 40, fat: 4 },
    tags: ["Ultra Lean", "Clean"],
    category: "fish",
  },
  {
    id: "athlete-cod-1",
    title: "Cod & Couscous",
    protein_source: "Cod Fillet",
    protein_oz: 7,
    carb_source: "Whole Wheat Couscous",
    carb_g: 170,
    fibrous_source: ["Broccoli", "Peppers"],
    macros: { kcal: 405, protein: 43, carbs: 42, fat: 3 },
    tags: ["Ultra Lean", "Competition Prep"],
    category: "fish",
  },
  {
    id: "athlete-halibut-1",
    title: "Halibut & Sweet Potato",
    protein_source: "Halibut Fillet",
    protein_oz: 6,
    carb_source: "Sweet Potato",
    carb_g: 190,
    fibrous_source: ["Spinach", "Zucchini"],
    macros: { kcal: 420, protein: 44, carbs: 44, fat: 5 },
    tags: ["Omega-3", "Clean"],
    category: "fish",
  },

  // Eggs & Shakes
  {
    id: "athlete-eggs-1",
    title: "Egg Whites & Oatmeal",
    protein_source: "Egg Whites (8 large)",
    protein_oz: 8,
    carb_source: "Steel Cut Oats",
    carb_g: 150,
    fibrous_source: ["Berries", "Spinach"],
    macros: { kcal: 380, protein: 40, carbs: 42, fat: 2 },
    tags: ["Breakfast", "Ultra Lean"],
    category: "eggs_shakes",
  },
  {
    id: "athlete-shake-1",
    title: "Protein Shake & Banana",
    protein_source: "Whey Isolate (2 scoops)",
    protein_oz: 0,
    carb_source: "Banana",
    carb_g: 120,
    fibrous_source: [],
    macros: { kcal: 350, protein: 48, carbs: 35, fat: 2 },
    tags: ["Post-Workout", "Fast Digest"],
    category: "eggs_shakes",
  },
  {
    id: "athlete-eggs-2",
    title: "Whole Eggs & Rice Cakes",
    protein_source: "Whole Eggs (5 large)",
    protein_oz: 0,
    carb_source: "Rice Cakes",
    carb_g: 100,
    fibrous_source: ["Avocado", "Tomatoes"],
    macros: { kcal: 425, protein: 35, carbs: 28, fat: 18 },
    tags: ["Breakfast", "Healthy Fats"],
    category: "eggs_shakes",
  },

  // Additional Poultry Options
  {
    id: "athlete-chicken-3",
    title: "Chicken Thighs & Potato",
    protein_source: "Chicken Thighs (skinless)",
    protein_oz: 6,
    carb_source: "Red Potato",
    carb_g: 185,
    fibrous_source: ["Green Beans", "Carrots"],
    macros: { kcal: 470, protein: 42, carbs: 44, fat: 12 },
    tags: ["Moderate Fat", "Off-Season"],
    category: "poultry",
  },
  {
    id: "athlete-turkey-2",
    title: "Turkey & Pasta",
    protein_source: "Ground Turkey (93% lean)",
    protein_oz: 6,
    carb_source: "Whole Wheat Pasta",
    carb_g: 160,
    fibrous_source: ["Broccoli", "Tomatoes"],
    macros: { kcal: 445, protein: 44, carbs: 42, fat: 7 },
    tags: ["Lean", "Carb Loading"],
    category: "poultry",
  },

  // Additional Fish Options
  {
    id: "athlete-salmon-1",
    title: "Salmon & Quinoa",
    protein_source: "Wild Salmon",
    protein_oz: 6,
    carb_source: "Quinoa",
    carb_g: 155,
    fibrous_source: ["Asparagus", "Brussels Sprouts"],
    macros: { kcal: 485, protein: 42, carbs: 40, fat: 15 },
    tags: ["Omega-3", "Healthy Fats"],
    category: "fish",
  },
  {
    id: "athlete-tuna-1",
    title: "Seared Tuna & Rice",
    protein_source: "Yellowfin Tuna Steak",
    protein_oz: 7,
    carb_source: "Basmati Rice",
    carb_g: 170,
    fibrous_source: ["Bok Choy", "Bell Peppers"],
    macros: { kcal: 415, protein: 46, carbs: 42, fat: 4 },
    tags: ["Ultra Lean", "High Protein"],
    category: "fish",
  },
];

export function getAthleteMealsByCategory(
  category: AthleteMeal["category"]
): AthleteMeal[] {
  return athleteMeals.filter((meal) => meal.category === category);
}

export function getAllAthleteMeals(): AthleteMeal[] {
  return athleteMeals;
}
