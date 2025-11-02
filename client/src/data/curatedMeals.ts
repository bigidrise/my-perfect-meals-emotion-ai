export type MedicalBadge = "low-sugar" | "diabetes-friendly" | "gluten-free" | "heart-healthy" | "high-protein";

export type CuratedMeal = {
  id: string;
  name: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number; protein: number; carbs: number; fat: number;
  badges: MedicalBadge[];
  ingredients: { name: string; amount: string }[];
  instructions: string[];
};

export const CURATED_MEALS: CuratedMeal[] = [
  {
    id: "greek-yogurt-berries",
    name: "Greek Yogurt & Berries",
    mealType: "breakfast",
    calories: 320, protein: 28, carbs: 35, fat: 8,
    badges: ["high-protein", "diabetes-friendly"],
    ingredients: [
      { name: "Greek yogurt, plain 2%", amount: "7 oz" },
      { name: "Mixed berries", amount: "4 oz" },
      { name: "Honey (optional)", amount: "1 tsp" },
    ],
    instructions: [
      "Spoon yogurt into a bowl.",
      "Top with berries.",
      "Drizzle honey if desired."
    ],
  },
  {
    id: "chicken-salad-bowl",
    name: "Grilled Chicken Salad",
    mealType: "lunch",
    calories: 480, protein: 40, carbs: 28, fat: 20,
    badges: ["gluten-free", "high-protein", "heart-healthy"],
    ingredients: [
      { name: "Chicken breast, cooked", amount: "5 oz" },
      { name: "Mixed greens", amount: "2 cups" },
      { name: "Cherry tomatoes", amount: "3.5 oz" },
      { name: "Cucumber", amount: "3 oz" },
      { name: "Olive oil + lemon dressing", amount: "2 Tbsp" },
    ],
    instructions: [
      "Slice the cooked chicken.",
      "Toss greens with tomatoes and cucumber.",
      "Dress and top with chicken."
    ],
  },
  {
    id: "salmon-quinoa-broccoli",
    name: "Salmon, Quinoa & Broccoli",
    mealType: "dinner",
    calories: 620, protein: 42, carbs: 45, fat: 24,
    badges: ["heart-healthy", "gluten-free"],
    ingredients: [
      { name: "Salmon fillet", amount: "6 oz" },
      { name: "Quinoa, cooked", amount: "5 oz" },
      { name: "Broccoli, steamed", amount: "5 oz" },
      { name: "Olive oil", amount: "1 Tbsp" },
    ],
    instructions: [
      "Season salmon with salt/pepper.",
      "Pan-sear 3–4 min per side until just cooked.",
      "Serve with cooked quinoa and steamed broccoli; drizzle oil."
    ],
  },
  {
    id: "egg-veg-scramble",
    name: "Egg & Veg Scramble",
    mealType: "breakfast",
    calories: 350, protein: 24, carbs: 10, fat: 22,
    badges: ["low-sugar", "high-protein"],
    ingredients: [
      { name: "Eggs", amount: "3 large" },
      { name: "Spinach", amount: "1 cup" },
      { name: "Bell pepper", amount: "1/2 medium" },
      { name: "Olive oil", amount: "1 tsp" },
    ],
    instructions: [
      "Beat eggs with a pinch of salt.",
      "Sauté pepper and spinach 2–3 min.",
      "Add eggs and scramble until set."
    ],
  },
  {
    id: "beef-brown-rice-bowl",
    name: "Beef & Brown Rice Bowl",
    mealType: "lunch",
    calories: 610, protein: 38, carbs: 55, fat: 20,
    badges: ["high-protein"],
    ingredients: [
      { name: "Lean ground beef", amount: "5 oz" },
      { name: "Brown rice, cooked", amount: "6 oz" },
      { name: "Green beans", amount: "4 oz" },
    ],
    instructions: [
      "Brown beef; season with salt/pepper.",
      "Steam green beans until tender-crisp.",
      "Serve beef over rice with green beans."
    ],
  },
  {
    id: "shrimp-taco-bowl",
    name: "Shrimp Taco Bowl",
    mealType: "dinner",
    calories: 520, protein: 35, carbs: 50, fat: 16,
    badges: ["gluten-free"],
    ingredients: [
      { name: "Shrimp, peeled", amount: "5.5 oz" },
      { name: "Black beans", amount: "4 oz" },
      { name: "Corn", amount: "3 oz" },
      { name: "Lime-cilantro rice, cooked", amount: "5 oz" },
    ],
    instructions: [
      "Sauté shrimp with taco seasoning 3–4 min.",
      "Assemble with rice, beans, corn; finish with lime."
    ],
  },
];