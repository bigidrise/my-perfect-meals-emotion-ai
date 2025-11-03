
export type Ingredient = {
  item: string;
  quantity: number;
  unit?: string;
};

export type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type GLP1Meal = {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  category: "breakfast" | "lunch" | "dinner" | "snack";
  baseServings: number;
  fingerFood?: boolean;
  healthBadges?: string[];
  ingredients: Ingredient[];
  instructions?: string[];
  image?: string;
  nutrition: Nutrition;
};

export const glp1Meals: GLP1Meal[] = [
  // ==================== BREAKFAST (20) ====================
  {
    id: "greek-yogurt-parfait",
    name: "Greek Yogurt Parfait",
    description: "Creamy Greek yogurt layered with fresh berries and crunchy granola",
    cuisine: "Mediterranean",
    category: "breakfast",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Probiotic", "Low Sugar", "Gluten-Free Option", "Vegetarian"],
    ingredients: [
      { item: "Greek yogurt (plain)", quantity: 0.75, unit: "cup" },
      { item: "mixed berries", quantity: 0.25, unit: "cup" },
      { item: "granola", quantity: 2, unit: "tbsp" },
      { item: "honey", quantity: 1, unit: "tsp" },
      { item: "sliced almonds", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Place half the Greek yogurt in a small bowl or glass",
      "Add half the berries on top",
      "Layer remaining yogurt",
      "Top with remaining berries, granola, and almonds",
      "Drizzle with honey and serve immediately"
    ],
    nutrition: { calories: 285, protein: 20, carbs: 32, fat: 9 }
  },
  {
    id: "avocado-toast-with-egg",
    name: "Avocado Toast with Egg",
    description: "Whole grain toast topped with mashed avocado and a perfectly cooked egg",
    cuisine: "American",
    category: "breakfast",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Heart-Healthy", "Anti-Inflammatory", "High Protein", "Vegetarian", "Omega-3"],
    ingredients: [
      { item: "whole grain bread", quantity: 1, unit: "slice" },
      { item: "ripe avocado", quantity: 0.5, unit: "medium" },
      { item: "egg", quantity: 1, unit: "large" },
      { item: "lemon juice", quantity: 0.5, unit: "tsp" },
      { item: "red pepper flakes", quantity: 1, unit: "pinch" },
      { item: "sea salt", quantity: 1, unit: "pinch" }
    ],
    instructions: [
      "Toast bread until golden brown",
      "Mash avocado with lemon juice and salt",
      "Cook egg to your preference (poached, fried, or scrambled)",
      "Spread avocado on toast",
      "Top with egg and sprinkle with red pepper flakes",
      "Serve immediately while warm"
    ],
    nutrition: { calories: 295, protein: 12, carbs: 24, fat: 18 }
  },
  {
    id: "berry-protein-smoothie",
    name: "Berry Protein Smoothie",
    description: "Antioxidant-rich berry smoothie with protein powder for sustained energy",
    cuisine: "American",
    category: "breakfast",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Diabetic-Friendly", "Antioxidant-Rich", "Dairy-Free Option", "Low Sodium", "High Protein"],
    ingredients: [
      { item: "mixed berries (frozen)", quantity: 0.75, unit: "cup" },
      { item: "protein powder (vanilla)", quantity: 1, unit: "scoop" },
      { item: "almond milk (unsweetened)", quantity: 1, unit: "cup" },
      { item: "baby spinach", quantity: 0.5, unit: "cup" },
      { item: "chia seeds", quantity: 1, unit: "tsp" },
      { item: "ice cubes", quantity: 3, unit: "cubes" }
    ],
    instructions: [
      "Add almond milk to blender first",
      "Add frozen berries, spinach, and protein powder",
      "Add chia seeds and ice",
      "Blend on high for 30-45 seconds until smooth",
      "Pour into glass and serve immediately",
      "Optional: top with fresh berries"
    ],
    nutrition: { calories: 245, protein: 25, carbs: 28, fat: 5 }
  },
  {
    id: "scrambled-eggs-with-spinach",
    name: "Scrambled Eggs with Spinach",
    description: "Fluffy scrambled eggs with sautéed spinach and feta cheese",
    cuisine: "Mediterranean",
    category: "breakfast",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Low Carb", "Keto-Friendly", "Gluten-Free", "Vegetarian"],
    ingredients: [
      { item: "eggs", quantity: 2, unit: "large" },
      { item: "fresh spinach", quantity: 1, unit: "cup" },
      { item: "feta cheese", quantity: 2, unit: "tbsp" },
      { item: "olive oil", quantity: 1, unit: "tsp" },
      { item: "black pepper", quantity: 1, unit: "pinch" },
      { item: "cherry tomatoes", quantity: 3, unit: "small" }
    ],
    instructions: [
      "Heat olive oil in non-stick pan over medium heat",
      "Add spinach and sauté until wilted (1-2 minutes)",
      "Whisk eggs with black pepper",
      "Pour eggs into pan and scramble gently",
      "Add crumbled feta when eggs are nearly done",
      "Serve with halved cherry tomatoes on the side"
    ],
    nutrition: { calories: 265, protein: 18, carbs: 5, fat: 20 }
  },
  {
    id: "overnight-oats-with-almonds",
    name: "Overnight Oats with Almonds",
    description: "Creamy oats soaked overnight with almond milk, topped with nuts and fruit",
    cuisine: "American",
    category: "breakfast",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Heart-Healthy", "Anti-Inflammatory", "Vegetarian", "High Fiber", "Vegan Option"],
    ingredients: [
      { item: "rolled oats", quantity: 0.5, unit: "cup" },
      { item: "almond milk", quantity: 0.75, unit: "cup" },
      { item: "chia seeds", quantity: 1, unit: "tbsp" },
      { item: "sliced almonds", quantity: 1, unit: "tbsp" },
      { item: "banana", quantity: 0.5, unit: "medium" },
      { item: "cinnamon", quantity: 0.25, unit: "tsp" }
    ],
    instructions: [
      "Combine oats, almond milk, chia seeds, and cinnamon in jar",
      "Stir well and refrigerate overnight (or minimum 4 hours)",
      "In the morning, stir the oats",
      "Top with sliced banana and almonds",
      "Optional: drizzle with honey or maple syrup",
      "Serve cold or microwave for 30 seconds if preferred warm"
    ],
    nutrition: { calories: 320, protein: 10, carbs: 45, fat: 12 }
  },
  {
    id: "smoked-salmon-cream-cheese-bagel",
    name: "Smoked Salmon & Cream Cheese Bagel",
    description: "Mini bagel with cream cheese, smoked salmon, capers, and red onion",
    cuisine: "American",
    category: "breakfast",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["High Protein", "Omega-3 Rich", "Pescatarian", "Heart-Healthy"],
    ingredients: [
      { item: "mini whole grain bagel", quantity: 1, unit: "piece" },
      { item: "cream cheese (light)", quantity: 2, unit: "tbsp" },
      { item: "smoked salmon", quantity: 2, unit: "oz" },
      { item: "red onion (sliced thin)", quantity: 2, unit: "slices" },
      { item: "capers", quantity: 1, unit: "tsp" },
      { item: "fresh dill", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Toast bagel halves until lightly golden",
      "Spread cream cheese on both halves",
      "Layer smoked salmon on bottom half",
      "Top with red onion slices and capers",
      "Sprinkle with fresh dill",
      "Close sandwich or serve open-faced"
    ],
    nutrition: { calories: 310, protein: 20, carbs: 28, fat: 14 }
  },
  {
    id: "veggie-egg-white-omelet",
    name: "Veggie Egg White Omelet",
    description: "Light and fluffy egg white omelet packed with colorful vegetables",
    cuisine: "American",
    category: "breakfast",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Low Calorie", "High Protein", "Gluten-Free", "Vegetarian", "Low Fat"],
    ingredients: [
      { item: "egg whites", quantity: 4, unit: "large" },
      { item: "bell peppers (mixed)", quantity: 0.25, unit: "cup" },
      { item: "mushrooms (sliced)", quantity: 0.25, unit: "cup" },
      { item: "cherry tomatoes (halved)", quantity: 4, unit: "small" },
      { item: "baby spinach", quantity: 0.25, unit: "cup" },
      { item: "olive oil spray", quantity: 2, unit: "sprays" }
    ],
    instructions: [
      "Spray non-stick pan with olive oil and heat over medium",
      "Sauté peppers and mushrooms for 2-3 minutes",
      "Whisk egg whites and pour into pan",
      "Cook until edges start to set",
      "Add vegetables and tomatoes to one half",
      "Fold omelet in half and cook 1-2 more minutes"
    ],
    nutrition: { calories: 165, protein: 22, carbs: 8, fat: 4 }
  },
  {
    id: "peanut-butter-banana-toast",
    name: "Peanut Butter Banana Toast",
    description: "Whole grain toast with natural peanut butter and fresh banana slices",
    cuisine: "American",
    category: "breakfast",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Heart-Healthy", "Energy Boost", "Vegan Option", "High Fiber"],
    ingredients: [
      { item: "whole grain bread", quantity: 1, unit: "slice" },
      { item: "natural peanut butter", quantity: 1.5, unit: "tbsp" },
      { item: "banana", quantity: 0.5, unit: "medium" },
      { item: "cinnamon", quantity: 1, unit: "pinch" },
      { item: "honey", quantity: 0.5, unit: "tsp" },
      { item: "chia seeds", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Toast bread until golden brown",
      "Spread peanut butter evenly on toast",
      "Slice banana and arrange on top",
      "Sprinkle with cinnamon and chia seeds",
      "Drizzle with honey if desired",
      "Serve immediately"
    ],
    nutrition: { calories: 290, protein: 10, carbs: 38, fat: 13 }
  },
  {
    id: "breakfast-burrito-bowl",
    name: "Breakfast Burrito Bowl",
    description: "Scrambled eggs over seasoned black beans with avocado and salsa",
    cuisine: "Mexican",
    category: "breakfast",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "High Fiber", "Gluten-Free", "Vegetarian", "Anti-Inflammatory"],
    ingredients: [
      { item: "eggs", quantity: 2, unit: "large" },
      { item: "black beans (cooked)", quantity: 0.25, unit: "cup" },
      { item: "avocado", quantity: 0.25, unit: "medium" },
      { item: "salsa", quantity: 2, unit: "tbsp" },
      { item: "shredded cheese", quantity: 2, unit: "tbsp" },
      { item: "cilantro", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Heat black beans in small pan with cumin",
      "Scramble eggs in separate pan",
      "Place warm beans in bowl",
      "Top with scrambled eggs",
      "Add diced avocado, salsa, and cheese",
      "Garnish with fresh cilantro"
    ],
    nutrition: { calories: 340, protein: 20, carbs: 20, fat: 20 }
  },
  {
    id: "cottage-cheese-fruit-bowl",
    name: "Cottage Cheese & Fruit Bowl",
    description: "Protein-rich cottage cheese with fresh seasonal fruit and nuts",
    cuisine: "American",
    category: "breakfast",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Probiotic", "Gluten-Free", "Vegetarian", "Low Sugar"],
    ingredients: [
      { item: "cottage cheese (low-fat)", quantity: 0.75, unit: "cup" },
      { item: "pineapple chunks", quantity: 0.25, unit: "cup" },
      { item: "strawberries (sliced)", quantity: 3, unit: "medium" },
      { item: "walnuts (chopped)", quantity: 1, unit: "tbsp" },
      { item: "hemp seeds", quantity: 1, unit: "tsp" },
      { item: "cinnamon", quantity: 1, unit: "pinch" }
    ],
    instructions: [
      "Place cottage cheese in serving bowl",
      "Arrange pineapple and strawberries on top",
      "Sprinkle with chopped walnuts and hemp seeds",
      "Dust with cinnamon",
      "Optional: add a small drizzle of honey",
      "Serve chilled"
    ],
    nutrition: { calories: 235, protein: 24, carbs: 20, fat: 8 }
  },
  {
    id: "spinach-mushroom-frittata",
    name: "Spinach Mushroom Frittata",
    description: "Italian-style baked egg dish with fresh vegetables and herbs",
    cuisine: "Italian",
    category: "breakfast",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Low Carb", "Gluten-Free", "Vegetarian", "Keto-Friendly"],
    ingredients: [
      { item: "eggs", quantity: 2, unit: "large" },
      { item: "baby spinach", quantity: 0.5, unit: "cup" },
      { item: "mushrooms (sliced)", quantity: 0.25, unit: "cup" },
      { item: "parmesan cheese", quantity: 2, unit: "tbsp" },
      { item: "olive oil", quantity: 1, unit: "tsp" },
      { item: "fresh basil", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Preheat oven to 375°F",
      "Sauté mushrooms and spinach in oven-safe pan",
      "Whisk eggs with parmesan and basil",
      "Pour eggs over vegetables in pan",
      "Transfer to oven and bake 12-15 minutes until set",
      "Let cool slightly, slice and serve"
    ],
    nutrition: { calories: 255, protein: 18, carbs: 5, fat: 19 }
  },
  {
    id: "chia-pudding-berries",
    name: "Chia Pudding with Berries",
    description: "Nutrient-dense chia seed pudding topped with fresh berries",
    cuisine: "American",
    category: "breakfast",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Vegan", "High Fiber", "Omega-3 Rich", "Gluten-Free", "Anti-Inflammatory"],
    ingredients: [
      { item: "chia seeds", quantity: 3, unit: "tbsp" },
      { item: "almond milk (unsweetened)", quantity: 1, unit: "cup" },
      { item: "vanilla extract", quantity: 0.25, unit: "tsp" },
      { item: "mixed berries", quantity: 0.25, unit: "cup" },
      { item: "maple syrup", quantity: 1, unit: "tsp" },
      { item: "sliced almonds", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Mix chia seeds, almond milk, and vanilla in jar",
      "Stir well and refrigerate overnight (minimum 4 hours)",
      "Chia will absorb liquid and become pudding-like",
      "In morning, stir pudding and drizzle with maple syrup",
      "Top with fresh berries and almonds",
      "Serve cold"
    ],
    nutrition: { calories: 260, protein: 8, carbs: 28, fat: 14 }
  },
  {
    id: "turkey-sausage-egg-muffin",
    name: "Turkey Sausage & Egg Muffin",
    description: "English muffin sandwich with lean turkey sausage and egg",
    cuisine: "American",
    category: "breakfast",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["High Protein", "Portion-Controlled", "Low Fat", "Balanced Meal"],
    ingredients: [
      { item: "whole wheat English muffin", quantity: 1, unit: "piece" },
      { item: "turkey sausage patty", quantity: 1, unit: "piece" },
      { item: "egg", quantity: 1, unit: "large" },
      { item: "cheddar cheese (reduced-fat)", quantity: 1, unit: "slice" },
      { item: "tomato slice", quantity: 1, unit: "slice" },
      { item: "baby spinach", quantity: 2, unit: "leaves" }
    ],
    instructions: [
      "Cook turkey sausage patty according to package directions",
      "Fry or scramble egg to your preference",
      "Toast English muffin halves",
      "Layer sausage, egg, cheese, tomato, and spinach",
      "Close sandwich and serve warm",
      "Can be wrapped in foil for on-the-go"
    ],
    nutrition: { calories: 315, protein: 24, carbs: 28, fat: 12 }
  },
  {
    id: "apple-cinnamon-quinoa",
    name: "Apple Cinnamon Quinoa Bowl",
    description: "Warm quinoa breakfast bowl with sautéed apples and warming spices",
    cuisine: "American",
    category: "breakfast",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Vegan", "Gluten-Free", "High Fiber", "Heart-Healthy", "Anti-Inflammatory"],
    ingredients: [
      { item: "cooked quinoa", quantity: 0.5, unit: "cup" },
      { item: "apple (diced)", quantity: 0.5, unit: "medium" },
      { item: "almond milk", quantity: 0.25, unit: "cup" },
      { item: "cinnamon", quantity: 0.5, unit: "tsp" },
      { item: "walnuts (chopped)", quantity: 1, unit: "tbsp" },
      { item: "maple syrup", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Sauté diced apple with cinnamon in small pan",
      "Add cooked quinoa and almond milk to pan",
      "Heat through for 2-3 minutes, stirring",
      "Transfer to bowl",
      "Top with chopped walnuts and drizzle with maple syrup",
      "Serve warm"
    ],
    nutrition: { calories: 275, protein: 7, carbs: 45, fat: 8 }
  },
  {
    id: "breakfast-quesadilla",
    name: "Breakfast Quesadilla",
    description: "Whole wheat tortilla filled with eggs, cheese, and black beans",
    cuisine: "Mexican",
    category: "breakfast",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["High Protein", "High Fiber", "Vegetarian", "Portion-Controlled"],
    ingredients: [
      { item: "whole wheat tortilla (small)", quantity: 1, unit: "piece" },
      { item: "eggs (scrambled)", quantity: 1, unit: "large" },
      { item: "black beans", quantity: 2, unit: "tbsp" },
      { item: "shredded cheese", quantity: 2, unit: "tbsp" },
      { item: "salsa", quantity: 2, unit: "tbsp" },
      { item: "avocado", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Scramble egg and set aside",
      "Place tortilla in dry pan over medium heat",
      "On one half, layer beans, egg, and cheese",
      "Fold tortilla in half",
      "Cook 2 minutes per side until golden and cheese melts",
      "Cut into wedges, serve with salsa and avocado"
    ],
    nutrition: { calories: 295, protein: 15, carbs: 28, fat: 14 }
  },
  {
    id: "protein-pancakes-blueberries",
    name: "Protein Pancakes with Blueberries",
    description: "Fluffy high-protein pancakes topped with fresh blueberries",
    cuisine: "American",
    category: "breakfast",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["High Protein", "Low Sugar", "Portion-Controlled", "Vegetarian"],
    ingredients: [
      { item: "protein pancake mix", quantity: 0.33, unit: "cup" },
      { item: "egg", quantity: 1, unit: "large" },
      { item: "almond milk", quantity: 0.25, unit: "cup" },
      { item: "fresh blueberries", quantity: 0.25, unit: "cup" },
      { item: "Greek yogurt", quantity: 2, unit: "tbsp" },
      { item: "maple syrup", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Mix pancake mix, egg, and almond milk until smooth",
      "Heat non-stick pan over medium heat",
      "Pour batter to make 2 small pancakes",
      "Cook 2-3 minutes per side until golden",
      "Stack pancakes and top with blueberries",
      "Add dollop of Greek yogurt and drizzle with maple syrup"
    ],
    nutrition: { calories: 305, protein: 26, carbs: 35, fat: 8 }
  },
  {
    id: "mediterranean-breakfast-plate",
    name: "Mediterranean Breakfast Plate",
    description: "Hummus, olives, feta, cucumber, and whole grain pita",
    cuisine: "Mediterranean",
    category: "breakfast",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Mediterranean Diet", "Heart-Healthy", "Anti-Inflammatory", "Vegetarian", "High Fiber"],
    ingredients: [
      { item: "hummus", quantity: 0.25, unit: "cup" },
      { item: "whole grain pita (mini)", quantity: 1, unit: "piece" },
      { item: "feta cheese", quantity: 2, unit: "tbsp" },
      { item: "kalamata olives", quantity: 5, unit: "olives" },
      { item: "cucumber (sliced)", quantity: 0.5, unit: "cup" },
      { item: "cherry tomatoes", quantity: 5, unit: "small" }
    ],
    instructions: [
      "Warm pita in oven or toaster",
      "Arrange hummus in small bowl",
      "Plate feta, olives, cucumber, and tomatoes",
      "Cut pita into triangles for dipping",
      "Drizzle olive oil over vegetables if desired",
      "Serve with fresh herbs like mint or parsley"
    ],
    nutrition: { calories: 285, protein: 11, carbs: 32, fat: 14 }
  },
  {
    id: "sweet-potato-breakfast-hash",
    name: "Sweet Potato Breakfast Hash",
    description: "Roasted sweet potato with turkey sausage and peppers",
    cuisine: "American",
    category: "breakfast",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Gluten-Free", "Anti-Inflammatory", "Balanced Meal"],
    ingredients: [
      { item: "sweet potato (diced)", quantity: 0.5, unit: "cup" },
      { item: "turkey sausage", quantity: 1, unit: "link" },
      { item: "bell pepper (diced)", quantity: 0.25, unit: "cup" },
      { item: "onion (diced)", quantity: 2, unit: "tbsp" },
      { item: "olive oil", quantity: 1, unit: "tsp" },
      { item: "paprika", quantity: 0.25, unit: "tsp" }
    ],
    instructions: [
      "Dice sweet potato and cook in microwave 3 minutes to soften",
      "Heat olive oil in pan over medium-high",
      "Add sweet potato, peppers, and onions",
      "Cook 5-7 minutes until potatoes are golden",
      "Slice and add turkey sausage, cook through",
      "Season with paprika and serve hot"
    ],
    nutrition: { calories: 280, protein: 16, carbs: 28, fat: 12 }
  },
  {
    id: "almond-butter-protein-bowl",
    name: "Almond Butter Protein Bowl",
    description: "Creamy almond butter base with banana, granola, and seeds",
    cuisine: "American",
    category: "breakfast",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Heart-Healthy", "Energy Boost", "Vegan Option"],
    ingredients: [
      { item: "almond butter", quantity: 2, unit: "tbsp" },
      { item: "Greek yogurt", quantity: 0.5, unit: "cup" },
      { item: "banana (sliced)", quantity: 0.5, unit: "medium" },
      { item: "granola", quantity: 2, unit: "tbsp" },
      { item: "hemp seeds", quantity: 1, unit: "tsp" },
      { item: "dark chocolate chips", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Mix almond butter with Greek yogurt until smooth",
      "Transfer to serving bowl",
      "Top with sliced banana",
      "Sprinkle with granola, hemp seeds, and chocolate chips",
      "Optional: drizzle with honey",
      "Serve immediately"
    ],
    nutrition: { calories: 340, protein: 16, carbs: 35, fat: 17 }
  },
  {
    id: "shakshuka-single-serving",
    name: "Shakshuka (Single Serving)",
    description: "North African eggs poached in spiced tomato sauce",
    cuisine: "Mediterranean",
    category: "breakfast",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Anti-Inflammatory", "Gluten-Free", "Vegetarian", "Low Carb"],
    ingredients: [
      { item: "crushed tomatoes", quantity: 0.5, unit: "cup" },
      { item: "eggs", quantity: 2, unit: "large" },
      { item: "bell pepper (diced)", quantity: 0.25, unit: "cup" },
      { item: "onion (diced)", quantity: 2, unit: "tbsp" },
      { item: "cumin", quantity: 0.25, unit: "tsp" },
      { item: "feta cheese", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Sauté onion and bell pepper in small pan",
      "Add crushed tomatoes and cumin",
      "Simmer 5 minutes until sauce thickens",
      "Make two wells in sauce and crack eggs into them",
      "Cover and cook 5-7 minutes until eggs are set",
      "Top with crumbled feta and serve with whole grain bread"
    ],
    nutrition: { calories: 265, protein: 16, carbs: 18, fat: 14 }
  },

  // ==================== LUNCH (20) ====================
  {
    id: "grilled-chicken-caesar-salad",
    name: "Grilled Chicken Caesar Salad",
    description: "Classic Caesar with grilled chicken breast, romaine, and parmesan",
    cuisine: "American",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Low Carb", "Keto-Friendly", "Gluten-Free Option"],
    ingredients: [
      { item: "grilled chicken breast", quantity: 3, unit: "oz" },
      { item: "romaine lettuce (chopped)", quantity: 2, unit: "cups" },
      { item: "parmesan cheese (shaved)", quantity: 2, unit: "tbsp" },
      { item: "Caesar dressing (light)", quantity: 2, unit: "tbsp" },
      { item: "whole grain croutons", quantity: 2, unit: "tbsp" },
      { item: "lemon wedge", quantity: 1, unit: "piece" }
    ],
    instructions: [
      "Grill or pan-sear chicken breast with seasoning",
      "Let chicken rest 5 minutes, then slice",
      "Toss romaine with Caesar dressing",
      "Arrange lettuce on plate",
      "Top with sliced chicken and parmesan",
      "Add croutons and squeeze lemon over top"
    ],
    nutrition: { calories: 315, protein: 32, carbs: 12, fat: 16 }
  },
  {
    id: "mediterranean-quinoa-bowl",
    name: "Mediterranean Quinoa Bowl",
    description: "Quinoa with cucumber, tomatoes, chickpeas, feta, and lemon dressing",
    cuisine: "Mediterranean",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Anti-Inflammatory", "Vegetarian", "Heart-Healthy", "High Fiber", "Vegan Option"],
    ingredients: [
      { item: "cooked quinoa", quantity: 0.5, unit: "cup" },
      { item: "chickpeas (cooked)", quantity: 0.25, unit: "cup" },
      { item: "cucumber (diced)", quantity: 0.25, unit: "cup" },
      { item: "cherry tomatoes (halved)", quantity: 0.25, unit: "cup" },
      { item: "feta cheese", quantity: 2, unit: "tbsp" },
      { item: "lemon olive oil dressing", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Place quinoa as base in bowl",
      "Arrange chickpeas, cucumber, and tomatoes on top",
      "Crumble feta cheese over bowl",
      "Drizzle with lemon olive oil dressing",
      "Toss gently before eating",
      "Garnish with fresh herbs if desired"
    ],
    nutrition: { calories: 340, protein: 12, carbs: 42, fat: 14 }
  },
  {
    id: "turkey-avocado-wrap",
    name: "Turkey & Avocado Wrap",
    description: "Whole wheat wrap with sliced turkey, avocado, and fresh vegetables",
    cuisine: "American",
    category: "lunch",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["High Protein", "Heart-Healthy", "Dairy-Free Option", "Portable"],
    ingredients: [
      { item: "whole wheat tortilla (large)", quantity: 1, unit: "piece" },
      { item: "sliced turkey breast", quantity: 3, unit: "oz" },
      { item: "avocado (mashed)", quantity: 0.25, unit: "medium" },
      { item: "lettuce leaves", quantity: 2, unit: "leaves" },
      { item: "tomato (sliced)", quantity: 2, unit: "slices" },
      { item: "mustard", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Lay tortilla flat and spread mashed avocado",
      "Add thin layer of mustard",
      "Layer turkey, lettuce, and tomato",
      "Roll tightly, folding in sides",
      "Cut diagonally in half",
      "Secure with toothpick if needed"
    ],
    nutrition: { calories: 325, protein: 26, carbs: 32, fat: 12 }
  },
  {
    id: "asian-chicken-lettuce-wraps",
    name: "Asian Chicken Lettuce Wraps",
    description: "Ground chicken with Asian flavors served in crisp lettuce cups",
    cuisine: "Asian",
    category: "lunch",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Low Sodium", "Gluten-Free", "Anti-Inflammatory", "Low Carb", "High Protein"],
    ingredients: [
      { item: "ground chicken", quantity: 3, unit: "oz" },
      { item: "butter lettuce leaves", quantity: 4, unit: "large" },
      { item: "water chestnuts (diced)", quantity: 2, unit: "tbsp" },
      { item: "green onions (sliced)", quantity: 2, unit: "tbsp" },
      { item: "low-sodium soy sauce", quantity: 1, unit: "tsp" },
      { item: "fresh ginger (minced)", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Brown ground chicken in pan over medium-high heat",
      "Add ginger, water chestnuts, and soy sauce",
      "Cook 3-4 minutes until chicken is done",
      "Wash and dry lettuce leaves",
      "Spoon chicken mixture into lettuce cups",
      "Top with green onions and serve immediately"
    ],
    nutrition: { calories: 225, protein: 28, carbs: 8, fat: 9 }
  },
  {
    id: "caprese-salad-grilled-chicken",
    name: "Caprese Salad with Grilled Chicken",
    description: "Fresh mozzarella, tomato, basil, and grilled chicken with balsamic",
    cuisine: "Italian",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Low Carb", "Anti-Inflammatory", "Gluten-Free", "High Protein", "Mediterranean Diet"],
    ingredients: [
      { item: "grilled chicken breast", quantity: 3, unit: "oz" },
      { item: "fresh mozzarella", quantity: 2, unit: "oz" },
      { item: "tomato (sliced)", quantity: 1, unit: "medium" },
      { item: "fresh basil leaves", quantity: 6, unit: "leaves" },
      { item: "balsamic glaze", quantity: 1, unit: "tbsp" },
      { item: "olive oil", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Slice grilled chicken, mozzarella, and tomato",
      "Arrange in alternating pattern on plate",
      "Tuck basil leaves between slices",
      "Drizzle with olive oil and balsamic glaze",
      "Season with salt and black pepper",
      "Serve at room temperature"
    ],
    nutrition: { calories: 310, protein: 32, carbs: 10, fat: 16 }
  },
  {
    id: "tuna-avocado-salad",
    name: "Tuna Avocado Salad",
    description: "Light tuna salad mixed with avocado instead of mayo, served on greens",
    cuisine: "American",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Omega-3 Rich", "Heart-Healthy", "Low Carb", "Pescatarian"],
    ingredients: [
      { item: "canned tuna (in water)", quantity: 3, unit: "oz" },
      { item: "avocado (mashed)", quantity: 0.25, unit: "medium" },
      { item: "mixed greens", quantity: 2, unit: "cups" },
      { item: "cherry tomatoes", quantity: 5, unit: "small" },
      { item: "lemon juice", quantity: 1, unit: "tsp" },
      { item: "red onion (diced)", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Drain tuna and place in bowl",
      "Add mashed avocado, lemon juice, and red onion",
      "Mix until combined and creamy",
      "Arrange mixed greens on plate",
      "Top with tuna mixture and cherry tomatoes",
      "Season with black pepper and serve"
    ],
    nutrition: { calories: 245, protein: 26, carbs: 12, fat: 11 }
  },
  {
    id: "greek-chicken-pita",
    name: "Greek Chicken Pita",
    description: "Grilled chicken in pita with tzatziki, cucumber, and tomato",
    cuisine: "Mediterranean",
    category: "lunch",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["High Protein", "Mediterranean Diet", "Portion-Controlled"],
    ingredients: [
      { item: "whole wheat pita (small)", quantity: 1, unit: "piece" },
      { item: "grilled chicken (diced)", quantity: 3, unit: "oz" },
      { item: "tzatziki sauce", quantity: 2, unit: "tbsp" },
      { item: "cucumber (diced)", quantity: 0.25, unit: "cup" },
      { item: "tomato (diced)", quantity: 0.25, unit: "cup" },
      { item: "red onion (sliced)", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Warm pita in oven or microwave",
      "Cut pita in half to create pocket",
      "Spread tzatziki inside pita",
      "Stuff with chicken, cucumber, tomato, and onion",
      "Add lettuce if desired",
      "Serve with lemon wedge"
    ],
    nutrition: { calories: 305, protein: 28, carbs: 30, fat: 9 }
  },
  {
    id: "shrimp-avocado-salad",
    name: "Shrimp & Avocado Salad",
    description: "Grilled shrimp over mixed greens with avocado and citrus dressing",
    cuisine: "American",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Omega-3 Rich", "Low Carb", "Pescatarian", "Heart-Healthy"],
    ingredients: [
      { item: "cooked shrimp", quantity: 4, unit: "oz" },
      { item: "mixed greens", quantity: 2, unit: "cups" },
      { item: "avocado (sliced)", quantity: 0.25, unit: "medium" },
      { item: "cherry tomatoes", quantity: 5, unit: "small" },
      { item: "citrus vinaigrette", quantity: 2, unit: "tbsp" },
      { item: "red onion (sliced thin)", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Grill or sauté shrimp with light seasoning",
      "Arrange mixed greens on plate",
      "Top with warm shrimp, avocado slices, and tomatoes",
      "Add red onion slices",
      "Drizzle with citrus vinaigrette",
      "Serve immediately while shrimp is warm"
    ],
    nutrition: { calories: 280, protein: 28, carbs: 14, fat: 14 }
  },
  {
    id: "veggie-hummus-wrap",
    name: "Veggie Hummus Wrap",
    description: "Colorful vegetables with hummus in whole wheat wrap",
    cuisine: "Mediterranean",
    category: "lunch",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Vegan", "High Fiber", "Anti-Inflammatory", "Heart-Healthy", "Low Sodium"],
    ingredients: [
      { item: "whole wheat tortilla", quantity: 1, unit: "large" },
      { item: "hummus", quantity: 3, unit: "tbsp" },
      { item: "cucumber (sliced)", quantity: 0.25, unit: "cup" },
      { item: "bell pepper (sliced)", quantity: 0.25, unit: "cup" },
      { item: "shredded carrots", quantity: 0.25, unit: "cup" },
      { item: "baby spinach", quantity: 0.5, unit: "cup" }
    ],
    instructions: [
      "Spread hummus evenly over tortilla",
      "Layer spinach leaves in center",
      "Add cucumber, bell pepper, and carrots",
      "Season with black pepper if desired",
      "Roll tightly, folding in sides",
      "Cut in half diagonally and serve"
    ],
    nutrition: { calories: 285, protein: 10, carbs: 42, fat: 10 }
  },
  {
    id: "chicken-tortilla-soup-cup",
    name: "Chicken Tortilla Soup Cup",
    description: "Hearty Mexican-inspired soup with chicken, beans, and vegetables",
    cuisine: "Mexican",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Anti-Inflammatory", "Gluten-Free", "High Fiber"],
    ingredients: [
      { item: "chicken breast (shredded)", quantity: 2, unit: "oz" },
      { item: "black beans", quantity: 0.25, unit: "cup" },
      { item: "diced tomatoes", quantity: 0.25, unit: "cup" },
      { item: "chicken broth (low-sodium)", quantity: 1, unit: "cup" },
      { item: "corn", quantity: 2, unit: "tbsp" },
      { item: "tortilla strips", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Heat chicken broth in small pot",
      "Add shredded chicken, beans, tomatoes, and corn",
      "Simmer 10 minutes until heated through",
      "Season with cumin and chili powder",
      "Ladle into bowl",
      "Top with tortilla strips and fresh cilantro"
    ],
    nutrition: { calories: 265, protein: 24, carbs: 28, fat: 6 }
  },
  {
    id: "salmon-arugula-salad",
    name: "Salmon & Arugula Salad",
    description: "Baked salmon over peppery arugula with lemon vinaigrette",
    cuisine: "Mediterranean",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Omega-3 Rich", "Anti-Inflammatory", "Heart-Healthy", "Pescatarian"],
    ingredients: [
      { item: "baked salmon fillet", quantity: 3, unit: "oz" },
      { item: "arugula", quantity: 2, unit: "cups" },
      { item: "cherry tomatoes", quantity: 5, unit: "small" },
      { item: "red onion (sliced)", quantity: 2, unit: "tbsp" },
      { item: "lemon vinaigrette", quantity: 2, unit: "tbsp" },
      { item: "capers", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Bake salmon at 400°F for 12-15 minutes",
      "Let salmon rest, then flake into chunks",
      "Toss arugula with lemon vinaigrette",
      "Arrange on plate and top with salmon",
      "Add cherry tomatoes, red onion, and capers",
      "Serve with lemon wedge"
    ],
    nutrition: { calories: 295, protein: 26, carbs: 8, fat: 18 }
  },
  {
    id: "egg-salad-lettuce-cups",
    name: "Egg Salad Lettuce Cups",
    description: "Classic egg salad served in crisp lettuce cups instead of bread",
    cuisine: "American",
    category: "lunch",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["High Protein", "Low Carb", "Keto-Friendly", "Gluten-Free", "Vegetarian"],
    ingredients: [
      { item: "hard-boiled eggs", quantity: 2, unit: "large" },
      { item: "Greek yogurt", quantity: 2, unit: "tbsp" },
      { item: "Dijon mustard", quantity: 1, unit: "tsp" },
      { item: "butter lettuce leaves", quantity: 4, unit: "large" },
      { item: "celery (diced)", quantity: 2, unit: "tbsp" },
      { item: "fresh dill", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Chop hard-boiled eggs",
      "Mix with Greek yogurt, mustard, celery, and dill",
      "Season with salt and pepper",
      "Wash and dry lettuce leaves",
      "Spoon egg salad into lettuce cups",
      "Garnish with paprika and serve"
    ],
    nutrition: { calories: 235, protein: 16, carbs: 6, fat: 16 }
  },
  {
    id: "thai-peanut-chicken-bowl",
    name: "Thai Peanut Chicken Bowl",
    description: "Grilled chicken with vegetables and spicy peanut sauce over greens",
    cuisine: "Asian",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Anti-Inflammatory", "Dairy-Free", "Gluten-Free Option"],
    ingredients: [
      { item: "grilled chicken (sliced)", quantity: 3, unit: "oz" },
      { item: "mixed greens", quantity: 1, unit: "cup" },
      { item: "shredded cabbage", quantity: 0.5, unit: "cup" },
      { item: "shredded carrots", quantity: 0.25, unit: "cup" },
      { item: "peanut sauce", quantity: 2, unit: "tbsp" },
      { item: "crushed peanuts", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Arrange greens and cabbage in bowl",
      "Top with sliced chicken and shredded carrots",
      "Drizzle with peanut sauce",
      "Toss everything together",
      "Top with crushed peanuts",
      "Garnish with cilantro and lime wedge"
    ],
    nutrition: { calories: 325, protein: 30, carbs: 18, fat: 16 }
  },
  {
    id: "lentil-veggie-soup",
    name: "Lentil Vegetable Soup",
    description: "Hearty plant-based soup with lentils and seasonal vegetables",
    cuisine: "Mediterranean",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Vegan", "High Fiber", "Heart-Healthy", "Anti-Inflammatory", "Low Fat"],
    ingredients: [
      { item: "cooked lentils", quantity: 0.5, unit: "cup" },
      { item: "vegetable broth", quantity: 1, unit: "cup" },
      { item: "diced carrots", quantity: 0.25, unit: "cup" },
      { item: "diced celery", quantity: 0.25, unit: "cup" },
      { item: "spinach", quantity: 0.5, unit: "cup" },
      { item: "garlic (minced)", quantity: 1, unit: "clove" }
    ],
    instructions: [
      "Sauté garlic, carrots, and celery in pot",
      "Add vegetable broth and bring to simmer",
      "Add cooked lentils and simmer 10 minutes",
      "Stir in spinach until wilted",
      "Season with cumin and black pepper",
      "Serve hot with whole grain bread"
    ],
    nutrition: { calories: 245, protein: 14, carbs: 42, fat: 2 }
  },
  {
    id: "chicken-pesto-zoodles",
    name: "Chicken Pesto Zoodles",
    description: "Grilled chicken over zucchini noodles with fresh basil pesto",
    cuisine: "Italian",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Low Carb", "Keto-Friendly", "Gluten-Free", "High Protein", "Anti-Inflammatory"],
    ingredients: [
      { item: "grilled chicken (sliced)", quantity: 3, unit: "oz" },
      { item: "zucchini noodles", quantity: 2, unit: "cups" },
      { item: "basil pesto", quantity: 2, unit: "tbsp" },
      { item: "cherry tomatoes (halved)", quantity: 5, unit: "small" },
      { item: "parmesan cheese", quantity: 1, unit: "tbsp" },
      { item: "pine nuts", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Sauté zucchini noodles in pan 2-3 minutes",
      "Add pesto and toss to coat",
      "Transfer zoodles to plate",
      "Top with sliced grilled chicken",
      "Add cherry tomatoes, parmesan, and pine nuts",
      "Serve immediately while warm"
    ],
    nutrition: { calories: 310, protein: 30, carbs: 12, fat: 18 }
  },
  {
    id: "black-bean-sweet-potato-bowl",
    name: "Black Bean & Sweet Potato Bowl",
    description: "Roasted sweet potato with black beans, avocado, and lime",
    cuisine: "Mexican",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Vegan", "High Fiber", "Anti-Inflammatory", "Gluten-Free", "Heart-Healthy"],
    ingredients: [
      { item: "roasted sweet potato (cubed)", quantity: 0.5, unit: "cup" },
      { item: "black beans", quantity: 0.5, unit: "cup" },
      { item: "avocado (sliced)", quantity: 0.25, unit: "medium" },
      { item: "corn", quantity: 2, unit: "tbsp" },
      { item: "lime juice", quantity: 1, unit: "tbsp" },
      { item: "cilantro", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Roast sweet potato cubes at 425°F for 20 minutes",
      "Warm black beans with cumin",
      "Place sweet potato and beans in bowl",
      "Top with corn and avocado slices",
      "Squeeze lime juice over everything",
      "Garnish with fresh cilantro"
    ],
    nutrition: { calories: 330, protein: 12, carbs: 52, fat: 10 }
  },
  {
    id: "cobb-salad-mini",
    name: "Mini Cobb Salad",
    description: "Classic Cobb with turkey, egg, bacon, avocado, and blue cheese",
    cuisine: "American",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Low Carb", "Keto-Friendly", "Gluten-Free"],
    ingredients: [
      { item: "mixed greens", quantity: 2, unit: "cups" },
      { item: "turkey breast (diced)", quantity: 2, unit: "oz" },
      { item: "hard-boiled egg (chopped)", quantity: 1, unit: "large" },
      { item: "turkey bacon (crumbled)", quantity: 1, unit: "slice" },
      { item: "avocado (diced)", quantity: 0.25, unit: "medium" },
      { item: "blue cheese crumbles", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Arrange mixed greens on plate",
      "Arrange turkey, egg, bacon, and avocado in rows",
      "Sprinkle blue cheese over top",
      "Serve with ranch or vinaigrette on side",
      "Toss before eating or eat in sections",
      "Season with black pepper"
    ],
    nutrition: { calories: 340, protein: 28, carbs: 10, fat: 22 }
  },
  {
    id: "mediterranean-tuna-salad",
    name: "Mediterranean Tuna Salad",
    description: "Tuna with white beans, olives, tomatoes, and lemon dressing",
    cuisine: "Mediterranean",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Omega-3 Rich", "Mediterranean Diet", "Heart-Healthy", "Pescatarian"],
    ingredients: [
      { item: "canned tuna (in water)", quantity: 3, unit: "oz" },
      { item: "white beans", quantity: 0.25, unit: "cup" },
      { item: "cherry tomatoes (halved)", quantity: 5, unit: "small" },
      { item: "kalamata olives", quantity: 5, unit: "olives" },
      { item: "mixed greens", quantity: 1, unit: "cup" },
      { item: "lemon vinaigrette", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Drain tuna and flake into bowl",
      "Add white beans, tomatoes, and olives",
      "Toss with lemon vinaigrette",
      "Serve over bed of mixed greens",
      "Garnish with fresh parsley",
      "Add lemon wedge on side"
    ],
    nutrition: { calories: 285, protein: 28, carbs: 20, fat: 10 }
  },
  {
    id: "chicken-veggie-stir-fry",
    name: "Chicken Vegetable Stir-Fry",
    description: "Quick-cooked chicken and crisp vegetables in light sauce",
    cuisine: "Asian",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Low Sodium", "Gluten-Free Option", "Diabetic-Friendly"],
    ingredients: [
      { item: "chicken breast (sliced)", quantity: 3, unit: "oz" },
      { item: "broccoli florets", quantity: 0.5, unit: "cup" },
      { item: "bell peppers (sliced)", quantity: 0.25, unit: "cup" },
      { item: "snap peas", quantity: 0.25, unit: "cup" },
      { item: "low-sodium soy sauce", quantity: 1, unit: "tbsp" },
      { item: "fresh ginger (minced)", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Heat wok or large pan over high heat",
      "Stir-fry chicken until nearly cooked",
      "Add broccoli and peppers, cook 2-3 minutes",
      "Add snap peas, ginger, and soy sauce",
      "Toss everything for 1-2 minutes",
      "Serve immediately over small portion of brown rice if desired"
    ],
    nutrition: { calories: 245, protein: 30, carbs: 14, fat: 8 }
  },
  {
    id: "caprese-stuffed-portobello",
    name: "Caprese Stuffed Portobello",
    description: "Grilled portobello mushroom filled with mozzarella, tomato, and basil",
    cuisine: "Italian",
    category: "lunch",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Low Carb", "Vegetarian", "Gluten-Free", "Anti-Inflammatory", "Mediterranean Diet"],
    ingredients: [
      { item: "portobello mushroom cap (large)", quantity: 1, unit: "piece" },
      { item: "fresh mozzarella", quantity: 2, unit: "oz" },
      { item: "tomato (sliced)", quantity: 0.5, unit: "medium" },
      { item: "fresh basil", quantity: 4, unit: "leaves" },
      { item: "balsamic glaze", quantity: 1, unit: "tbsp" },
      { item: "olive oil", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Remove stem from mushroom and brush with olive oil",
      "Grill or bake mushroom cap 5 minutes",
      "Fill with sliced tomato and mozzarella",
      "Return to oven until cheese melts",
      "Top with fresh basil leaves",
      "Drizzle with balsamic glaze and serve"
    ],
    nutrition: { calories: 245, protein: 14, carbs: 12, fat: 16 }
  },

  // ==================== DINNER (20) ====================
  {
    id: "grilled-salmon-asparagus",
    name: "Grilled Salmon with Asparagus",
    description: "Herb-crusted salmon fillet with roasted asparagus and lemon",
    cuisine: "American",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Anti-Inflammatory", "Heart-Healthy", "Omega-3 Rich", "Low Sodium", "Diabetic-Friendly", "Pescatarian"],
    ingredients: [
      { item: "salmon fillet", quantity: 4, unit: "oz" },
      { item: "asparagus spears", quantity: 6, unit: "spears" },
      { item: "olive oil", quantity: 1, unit: "tbsp" },
      { item: "lemon (sliced)", quantity: 2, unit: "slices" },
      { item: "fresh dill", quantity: 1, unit: "tbsp" },
      { item: "garlic (minced)", quantity: 1, unit: "clove" }
    ],
    instructions: [
      "Preheat oven to 400°F",
      "Season salmon with dill, garlic, salt, and pepper",
      "Toss asparagus with olive oil",
      "Place salmon and asparagus on baking sheet",
      "Top salmon with lemon slices",
      "Bake 12-15 minutes until salmon flakes easily"
    ],
    nutrition: { calories: 320, protein: 28, carbs: 8, fat: 20 }
  },
  {
    id: "chicken-stir-fry-veggies",
    name: "Chicken Stir-Fry with Vegetables",
    description: "Tender chicken with colorful vegetables in Asian-inspired sauce",
    cuisine: "Asian",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Diabetic-Friendly", "Low Sodium", "Gluten-Free Option", "High Protein"],
    ingredients: [
      { item: "chicken breast (sliced)", quantity: 4, unit: "oz" },
      { item: "broccoli florets", quantity: 0.5, unit: "cup" },
      { item: "bell peppers (sliced)", quantity: 0.5, unit: "cup" },
      { item: "snow peas", quantity: 0.25, unit: "cup" },
      { item: "low-sodium stir-fry sauce", quantity: 2, unit: "tbsp" },
      { item: "sesame oil", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Heat sesame oil in wok over high heat",
      "Stir-fry chicken until golden, about 4 minutes",
      "Add broccoli and peppers, cook 3 minutes",
      "Add snow peas and sauce",
      "Toss everything for 2 minutes",
      "Serve over small portion of brown rice or cauliflower rice"
    ],
    nutrition: { calories: 305, protein: 32, carbs: 16, fat: 12 }
  },
  {
    id: "beef-taco-bowl",
    name: "Beef Taco Bowl",
    description: "Seasoned ground beef over lettuce with taco toppings",
    cuisine: "Mexican",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Customizable", "Dairy-Free Option", "Gluten-Free"],
    ingredients: [
      { item: "lean ground beef", quantity: 3, unit: "oz" },
      { item: "romaine lettuce (chopped)", quantity: 2, unit: "cups" },
      { item: "black beans", quantity: 0.25, unit: "cup" },
      { item: "corn", quantity: 2, unit: "tbsp" },
      { item: "salsa", quantity: 2, unit: "tbsp" },
      { item: "avocado (sliced)", quantity: 0.25, unit: "medium" }
    ],
    instructions: [
      "Brown ground beef with taco seasoning",
      "Place chopped lettuce in bowl as base",
      "Add warm beef, black beans, and corn",
      "Top with salsa and avocado slices",
      "Optional: add shredded cheese and sour cream",
      "Serve with lime wedge"
    ],
    nutrition: { calories: 340, protein: 26, carbs: 24, fat: 16 }
  },
  {
    id: "baked-cod-sweet-potato",
    name: "Baked Cod with Sweet Potato",
    description: "Flaky cod fillet with roasted sweet potato and green beans",
    cuisine: "American",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Low Sodium", "Anti-Inflammatory", "Diabetic-Friendly", "Heart-Healthy", "Pescatarian"],
    ingredients: [
      { item: "cod fillet", quantity: 4, unit: "oz" },
      { item: "sweet potato (cubed)", quantity: 0.5, unit: "cup" },
      { item: "green beans", quantity: 0.75, unit: "cup" },
      { item: "olive oil", quantity: 1, unit: "tbsp" },
      { item: "lemon juice", quantity: 1, unit: "tbsp" },
      { item: "paprika", quantity: 0.25, unit: "tsp" }
    ],
    instructions: [
      "Preheat oven to 425°F",
      "Toss sweet potato cubes with olive oil and paprika",
      "Roast sweet potato 15 minutes",
      "Add cod and green beans to sheet pan",
      "Drizzle cod with lemon juice",
      "Bake additional 12-15 minutes until cod flakes"
    ],
    nutrition: { calories: 310, protein: 26, carbs: 28, fat: 10 }
  },
  {
    id: "turkey-meatballs-zucchini-noodles",
    name: "Turkey Meatballs with Zucchini Noodles",
    description: "Lean turkey meatballs in marinara over zucchini noodles",
    cuisine: "Italian",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Low Carb", "High Protein", "Gluten-Free", "Keto-Friendly"],
    ingredients: [
      { item: "turkey meatballs", quantity: 3, unit: "meatballs" },
      { item: "zucchini noodles", quantity: 2, unit: "cups" },
      { item: "marinara sauce", quantity: 0.5, unit: "cup" },
      { item: "parmesan cheese", quantity: 1, unit: "tbsp" },
      { item: "fresh basil", quantity: 2, unit: "leaves" },
      { item: "garlic", quantity: 1, unit: "clove" }
    ],
    instructions: [
      "Bake or pan-fry turkey meatballs until cooked through",
      "Heat marinara sauce in pan",
      "Add meatballs to sauce and simmer",
      "Sauté zucchini noodles 2-3 minutes",
      "Plate zoodles and top with meatballs and sauce",
      "Garnish with parmesan and fresh basil"
    ],
    nutrition: { calories: 295, protein: 28, carbs: 18, fat: 12 }
  },
  {
    id: "grilled-chicken-mediterranean",
    name: "Grilled Chicken Mediterranean Style",
    description: "Herb-marinated chicken with Greek salad and tzatziki",
    cuisine: "Mediterranean",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Mediterranean Diet", "Heart-Healthy", "Anti-Inflammatory", "Gluten-Free"],
    ingredients: [
      { item: "chicken breast", quantity: 4, unit: "oz" },
      { item: "cucumber (diced)", quantity: 0.5, unit: "cup" },
      { item: "cherry tomatoes (halved)", quantity: 5, unit: "small" },
      { item: "feta cheese", quantity: 2, unit: "tbsp" },
      { item: "tzatziki sauce", quantity: 2, unit: "tbsp" },
      { item: "kalamata olives", quantity: 4, unit: "olives" }
    ],
    instructions: [
      "Marinate chicken in lemon, garlic, and oregano",
      "Grill chicken 6-7 minutes per side",
      "Mix cucumber, tomatoes, feta, and olives for salad",
      "Slice grilled chicken",
      "Serve chicken with Greek salad on the side",
      "Top with tzatziki sauce"
    ],
    nutrition: { calories: 325, protein: 34, carbs: 12, fat: 16 }
  },
  {
    id: "shrimp-cauliflower-rice-bowl",
    name: "Shrimp & Cauliflower Rice Bowl",
    description: "Garlic butter shrimp over seasoned cauliflower rice",
    cuisine: "American",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Low Carb", "Keto-Friendly", "High Protein", "Gluten-Free", "Pescatarian"],
    ingredients: [
      { item: "large shrimp", quantity: 5, unit: "pieces" },
      { item: "cauliflower rice", quantity: 1, unit: "cup" },
      { item: "butter", quantity: 1, unit: "tbsp" },
      { item: "garlic (minced)", quantity: 2, unit: "cloves" },
      { item: "lemon juice", quantity: 1, unit: "tbsp" },
      { item: "parsley", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Sauté cauliflower rice in pan with seasoning",
      "In separate pan, melt butter with garlic",
      "Add shrimp and cook 2-3 minutes per side",
      "Squeeze lemon juice over shrimp",
      "Plate cauliflower rice and top with shrimp",
      "Garnish with fresh parsley"
    ],
    nutrition: { calories: 275, protein: 26, carbs: 10, fat: 16 }
  },
  {
    id: "pork-chops-roasted-vegetables",
    name: "Pork Chops with Roasted Vegetables",
    description: "Juicy pork chop with colorful roasted vegetables",
    cuisine: "American",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Gluten-Free", "Diabetic-Friendly", "Balanced Meal"],
    ingredients: [
      { item: "boneless pork chop", quantity: 4, unit: "oz" },
      { item: "Brussels sprouts (halved)", quantity: 0.5, unit: "cup" },
      { item: "carrots (chopped)", quantity: 0.25, unit: "cup" },
      { item: "red onion (wedges)", quantity: 0.25, unit: "cup" },
      { item: "olive oil", quantity: 1, unit: "tbsp" },
      { item: "rosemary", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Preheat oven to 425°F",
      "Toss vegetables with olive oil and rosemary",
      "Roast vegetables 15 minutes",
      "Season pork chop and add to pan",
      "Roast additional 15-18 minutes until pork reaches 145°F",
      "Let pork rest 5 minutes before serving"
    ],
    nutrition: { calories: 340, protein: 28, carbs: 18, fat: 18 }
  },
  {
    id: "teriyaki-chicken-broccoli",
    name: "Teriyaki Chicken & Broccoli",
    description: "Glazed chicken thighs with steamed broccoli in teriyaki sauce",
    cuisine: "Asian",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Gluten-Free Option", "Diabetic-Friendly"],
    ingredients: [
      { item: "boneless chicken thigh", quantity: 4, unit: "oz" },
      { item: "broccoli florets", quantity: 1, unit: "cup" },
      { item: "teriyaki sauce (low-sodium)", quantity: 2, unit: "tbsp" },
      { item: "sesame seeds", quantity: 1, unit: "tsp" },
      { item: "green onions (sliced)", quantity: 1, unit: "tbsp" },
      { item: "fresh ginger", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Cook chicken in pan until golden",
      "Add teriyaki sauce and ginger, simmer",
      "Steam broccoli until tender-crisp",
      "Slice chicken and arrange with broccoli",
      "Drizzle with extra teriyaki sauce",
      "Top with sesame seeds and green onions"
    ],
    nutrition: { calories: 315, protein: 30, carbs: 16, fat: 14 }
  },
  {
    id: "stuffed-bell-peppers",
    name: "Stuffed Bell Peppers",
    description: "Bell peppers filled with ground turkey, quinoa, and vegetables",
    cuisine: "American",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "High Fiber", "Gluten-Free", "Balanced Meal"],
    ingredients: [
      { item: "bell pepper (large)", quantity: 1, unit: "piece" },
      { item: "ground turkey", quantity: 3, unit: "oz" },
      { item: "cooked quinoa", quantity: 0.25, unit: "cup" },
      { item: "diced tomatoes", quantity: 0.25, unit: "cup" },
      { item: "mozzarella cheese", quantity: 2, unit: "tbsp" },
      { item: "Italian seasoning", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Preheat oven to 375°F",
      "Cut top off bell pepper and remove seeds",
      "Brown ground turkey with Italian seasoning",
      "Mix turkey with quinoa and tomatoes",
      "Stuff pepper with mixture and top with cheese",
      "Bake 25-30 minutes until pepper is tender"
    ],
    nutrition: { calories: 330, protein: 28, carbs: 26, fat: 14 }
  },
  {
    id: "lemon-herb-tilapia",
    name: "Lemon Herb Tilapia",
    description: "Light and flaky tilapia with lemon, herbs, and roasted vegetables",
    cuisine: "Mediterranean",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Low Calorie", "High Protein", "Heart-Healthy", "Pescatarian", "Gluten-Free"],
    ingredients: [
      { item: "tilapia fillet", quantity: 4, unit: "oz" },
      { item: "zucchini (sliced)", quantity: 0.5, unit: "cup" },
      { item: "cherry tomatoes", quantity: 6, unit: "small" },
      { item: "lemon (sliced)", quantity: 2, unit: "slices" },
      { item: "olive oil", quantity: 1, unit: "tbsp" },
      { item: "fresh thyme", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Preheat oven to 400°F",
      "Place tilapia on parchment-lined baking sheet",
      "Top with lemon slices and thyme",
      "Arrange zucchini and tomatoes around fish",
      "Drizzle everything with olive oil",
      "Bake 12-15 minutes until fish flakes easily"
    ],
    nutrition: { calories: 245, protein: 26, carbs: 8, fat: 12 }
  },
  {
    id: "beef-broccoli-stir-fry",
    name: "Beef & Broccoli Stir-Fry",
    description: "Tender beef strips with broccoli in savory Asian sauce",
    cuisine: "Asian",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Low Carb", "Gluten-Free Option", "Diabetic-Friendly"],
    ingredients: [
      { item: "sirloin beef (sliced thin)", quantity: 3, unit: "oz" },
      { item: "broccoli florets", quantity: 1, unit: "cup" },
      { item: "low-sodium soy sauce", quantity: 1, unit: "tbsp" },
      { item: "oyster sauce", quantity: 1, unit: "tbsp" },
      { item: "garlic (minced)", quantity: 1, unit: "clove" },
      { item: "sesame oil", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Heat wok over high heat with sesame oil",
      "Stir-fry beef until browned, about 3 minutes",
      "Remove beef and set aside",
      "Add broccoli and garlic, cook 3 minutes",
      "Return beef to wok with sauces",
      "Toss everything together and serve"
    ],
    nutrition: { calories: 285, protein: 26, carbs: 12, fat: 16 }
  },
  {
    id: "chicken-caprese-baked",
    name: "Baked Chicken Caprese",
    description: "Chicken breast topped with mozzarella, tomato, and basil",
    cuisine: "Italian",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Low Carb", "Gluten-Free", "Mediterranean Diet"],
    ingredients: [
      { item: "chicken breast", quantity: 4, unit: "oz" },
      { item: "fresh mozzarella", quantity: 2, unit: "oz" },
      { item: "tomato (sliced)", quantity: 2, unit: "slices" },
      { item: "fresh basil", quantity: 4, unit: "leaves" },
      { item: "balsamic glaze", quantity: 1, unit: "tbsp" },
      { item: "olive oil", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Preheat oven to 400°F",
      "Season chicken and sear in oven-safe pan",
      "Top chicken with tomato slices and mozzarella",
      "Transfer to oven and bake 15-18 minutes",
      "Top with fresh basil leaves",
      "Drizzle with balsamic glaze before serving"
    ],
    nutrition: { calories: 310, protein: 36, carbs: 6, fat: 16 }
  },
  {
    id: "shrimp-zucchini-boats",
    name: "Shrimp Zucchini Boats",
    description: "Zucchini halves filled with seasoned shrimp and cheese",
    cuisine: "American",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Low Carb", "Keto-Friendly", "High Protein", "Gluten-Free", "Pescatarian"],
    ingredients: [
      { item: "zucchini (large)", quantity: 1, unit: "piece" },
      { item: "cooked shrimp (chopped)", quantity: 3, unit: "oz" },
      { item: "cream cheese", quantity: 2, unit: "tbsp" },
      { item: "parmesan cheese", quantity: 2, unit: "tbsp" },
      { item: "garlic powder", quantity: 0.25, unit: "tsp" },
      { item: "paprika", quantity: 0.25, unit: "tsp" }
    ],
    instructions: [
      "Preheat oven to 375°F",
      "Halve zucchini lengthwise and scoop out seeds",
      "Mix shrimp, cream cheese, and seasonings",
      "Fill zucchini halves with shrimp mixture",
      "Top with parmesan cheese",
      "Bake 20-25 minutes until zucchini is tender"
    ],
    nutrition: { calories: 265, protein: 26, carbs: 10, fat: 14 }
  },
  {
    id: "turkey-chili-small-bowl",
    name: "Turkey Chili (Small Bowl)",
    description: "Hearty turkey chili with beans and vegetables",
    cuisine: "American",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "High Fiber", "Gluten-Free", "Anti-Inflammatory"],
    ingredients: [
      { item: "ground turkey", quantity: 3, unit: "oz" },
      { item: "kidney beans", quantity: 0.25, unit: "cup" },
      { item: "diced tomatoes", quantity: 0.5, unit: "cup" },
      { item: "bell pepper (diced)", quantity: 0.25, unit: "cup" },
      { item: "chili powder", quantity: 1, unit: "tsp" },
      { item: "cumin", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Brown ground turkey in pot",
      "Add peppers and cook 3 minutes",
      "Add beans, tomatoes, and spices",
      "Simmer 15-20 minutes",
      "Season with salt and pepper",
      "Top with shredded cheese and green onions if desired"
    ],
    nutrition: { calories: 305, protein: 28, carbs: 26, fat: 10 }
  },
  {
    id: "baked-chicken-brussels-sprouts",
    name: "Baked Chicken & Brussels Sprouts",
    description: "Sheet pan dinner with chicken and roasted Brussels sprouts",
    cuisine: "American",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Gluten-Free", "Anti-Inflammatory", "Low Carb"],
    ingredients: [
      { item: "chicken thigh (boneless)", quantity: 4, unit: "oz" },
      { item: "Brussels sprouts (halved)", quantity: 1, unit: "cup" },
      { item: "olive oil", quantity: 1, unit: "tbsp" },
      { item: "garlic powder", quantity: 0.5, unit: "tsp" },
      { item: "lemon juice", quantity: 1, unit: "tbsp" },
      { item: "fresh thyme", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Preheat oven to 425°F",
      "Season chicken with garlic powder and thyme",
      "Toss Brussels sprouts with olive oil",
      "Arrange chicken and sprouts on sheet pan",
      "Roast 25-30 minutes until chicken is done",
      "Squeeze lemon juice over everything before serving"
    ],
    nutrition: { calories: 315, protein: 28, carbs: 12, fat: 18 }
  },
  {
    id: "grilled-shrimp-skewers",
    name: "Grilled Shrimp Skewers",
    description: "Marinated shrimp skewers with vegetables",
    cuisine: "Mediterranean",
    category: "dinner",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["High Protein", "Low Carb", "Gluten-Free", "Pescatarian", "Heart-Healthy"],
    ingredients: [
      { item: "large shrimp", quantity: 6, unit: "pieces" },
      { item: "bell peppers (chunks)", quantity: 0.25, unit: "cup" },
      { item: "red onion (chunks)", quantity: 0.25, unit: "cup" },
      { item: "olive oil", quantity: 1, unit: "tbsp" },
      { item: "lemon juice", quantity: 1, unit: "tbsp" },
      { item: "garlic (minced)", quantity: 1, unit: "clove" }
    ],
    instructions: [
      "Marinate shrimp in olive oil, lemon, and garlic",
      "Thread shrimp and vegetables onto skewers",
      "Grill over medium-high heat 2-3 minutes per side",
      "Brush with marinade while cooking",
      "Serve with lemon wedges",
      "Optional: serve over small portion of rice or quinoa"
    ],
    nutrition: { calories: 265, protein: 24, carbs: 10, fat: 15 }
  },
  {
    id: "cauliflower-crust-pizza",
    name: "Personal Cauliflower Crust Pizza",
    description: "Low-carb pizza with cauliflower crust and your favorite toppings",
    cuisine: "Italian",
    category: "dinner",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Low Carb", "Keto-Friendly", "Gluten-Free", "Vegetarian Option"],
    ingredients: [
      { item: "cauliflower pizza crust (small)", quantity: 1, unit: "piece" },
      { item: "marinara sauce", quantity: 0.25, unit: "cup" },
      { item: "mozzarella cheese", quantity: 2, unit: "oz" },
      { item: "mushrooms (sliced)", quantity: 0.25, unit: "cup" },
      { item: "bell peppers (diced)", quantity: 2, unit: "tbsp" },
      { item: "fresh basil", quantity: 3, unit: "leaves" }
    ],
    instructions: [
      "Preheat oven according to crust package",
      "Spread marinara sauce on crust",
      "Top with mozzarella, mushrooms, and peppers",
      "Bake until cheese is melted and bubbly",
      "Top with fresh basil leaves",
      "Cut into slices and serve"
    ],
    nutrition: { calories: 290, protein: 18, carbs: 22, fat: 16 }
  },
  {
    id: "seared-scallops-spinach",
    name: "Seared Scallops with Spinach",
    description: "Pan-seared scallops over garlic sautéed spinach",
    cuisine: "American",
    category: "dinner",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Low Carb", "Gluten-Free", "Pescatarian", "Elegant"],
    ingredients: [
      { item: "sea scallops", quantity: 4, unit: "large" },
      { item: "baby spinach", quantity: 2, unit: "cups" },
      { item: "butter", quantity: 1, unit: "tbsp" },
      { item: "garlic (minced)", quantity: 2, unit: "cloves" },
      { item: "lemon juice", quantity: 1, unit: "tbsp" },
      { item: "white wine", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Pat scallops dry and season with salt and pepper",
      "Sear scallops in hot pan 2-3 minutes per side",
      "Remove scallops and set aside",
      "Sauté garlic and spinach in same pan",
      "Add white wine and lemon juice",
      "Plate spinach and top with scallops"
    ],
    nutrition: { calories: 275, protein: 24, carbs: 8, fat: 16 }
  },

  // ==================== SNACKS (20) ====================
  {
    id: "hummus-veggie-sticks",
    name: "Hummus with Veggie Sticks",
    description: "Creamy hummus with colorful raw vegetables for dipping",
    cuisine: "Mediterranean",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Anti-Inflammatory", "Vegan", "High Fiber", "Low Sodium", "Heart-Healthy"],
    ingredients: [
      { item: "hummus", quantity: 0.25, unit: "cup" },
      { item: "carrot sticks", quantity: 0.5, unit: "cup" },
      { item: "cucumber sticks", quantity: 0.5, unit: "cup" },
      { item: "bell pepper strips", quantity: 0.25, unit: "cup" },
      { item: "cherry tomatoes", quantity: 4, unit: "small" },
      { item: "olive oil drizzle", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Place hummus in small serving bowl",
      "Drizzle with olive oil and sprinkle with paprika",
      "Wash and cut vegetables into sticks",
      "Arrange vegetables around hummus",
      "Optional: sprinkle with fresh herbs",
      "Serve immediately or refrigerate"
    ],
    nutrition: { calories: 165, protein: 6, carbs: 20, fat: 8 }
  },
  {
    id: "cheese-whole-grain-crackers",
    name: "Cheese & Whole Grain Crackers",
    description: "Sharp cheddar cheese with whole grain crackers",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["High Protein", "Vegetarian", "Portion-Controlled", "Calcium-Rich"],
    ingredients: [
      { item: "sharp cheddar cheese", quantity: 1.5, unit: "oz" },
      { item: "whole grain crackers", quantity: 6, unit: "crackers" },
      { item: "apple slices", quantity: 0.25, unit: "cup" },
      { item: "grapes", quantity: 8, unit: "grapes" },
      { item: "walnuts", quantity: 5, unit: "halves" }
    ],
    instructions: [
      "Slice cheese into small cubes or slices",
      "Arrange cheese and crackers on plate",
      "Add apple slices and grapes",
      "Add walnuts for crunch",
      "Serve at room temperature",
      "Optional: add honey drizzle"
    ],
    nutrition: { calories: 285, protein: 12, carbs: 24, fat: 16 }
  },
  {
    id: "apple-almond-butter",
    name: "Apple Slices with Almond Butter",
    description: "Crisp apple slices with creamy almond butter",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Heart-Healthy", "Vegan", "Natural Sweetness", "High Fiber"],
    ingredients: [
      { item: "apple", quantity: 1, unit: "medium" },
      { item: "almond butter", quantity: 2, unit: "tbsp" },
      { item: "cinnamon", quantity: 1, unit: "pinch" },
      { item: "hemp seeds", quantity: 1, unit: "tsp" },
      { item: "honey", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Wash and slice apple into 8 wedges",
      "Remove core and seeds",
      "Arrange apple slices on plate",
      "Place almond butter in small bowl for dipping",
      "Sprinkle cinnamon over almond butter",
      "Optional: drizzle with honey and sprinkle hemp seeds"
    ],
    nutrition: { calories: 245, protein: 6, carbs: 30, fat: 13 }
  },
  {
    id: "greek-yogurt-berries",
    name: "Greek Yogurt with Berries",
    description: "Protein-rich Greek yogurt topped with fresh mixed berries",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["Probiotic", "Low Sugar", "High Protein", "Gluten-Free", "Vegetarian"],
    ingredients: [
      { item: "Greek yogurt (plain)", quantity: 0.75, unit: "cup" },
      { item: "mixed berries (fresh)", quantity: 0.25, unit: "cup" },
      { item: "honey", quantity: 1, unit: "tsp" },
      { item: "sliced almonds", quantity: 1, unit: "tbsp" },
      { item: "chia seeds", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Place Greek yogurt in serving bowl",
      "Top with fresh berries",
      "Drizzle with honey",
      "Sprinkle with almonds and chia seeds",
      "Optional: add vanilla extract to yogurt",
      "Serve immediately"
    ],
    nutrition: { calories: 220, protein: 18, carbs: 24, fat: 7 }
  },
  {
    id: "mixed-nuts-trail-mix",
    name: "Mixed Nuts Trail Mix",
    description: "Energy-boosting mix of nuts, seeds, and dried fruit",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Heart-Healthy", "Energy Boost", "Customizable", "Omega-3 Rich", "Vegan"],
    ingredients: [
      { item: "almonds", quantity: 10, unit: "nuts" },
      { item: "walnuts", quantity: 5, unit: "halves" },
      { item: "cashews", quantity: 8, unit: "nuts" },
      { item: "dried cranberries", quantity: 1, unit: "tbsp" },
      { item: "dark chocolate chips", quantity: 1, unit: "tbsp" },
      { item: "pumpkin seeds", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Combine all nuts in a small bowl",
      "Add dried cranberries and chocolate chips",
      "Mix in pumpkin seeds",
      "Toss everything together",
      "Portion into small container for on-the-go",
      "Store remainder in airtight container"
    ],
    nutrition: { calories: 280, protein: 8, carbs: 22, fat: 20 }
  },
  {
    id: "hard-boiled-eggs",
    name: "Hard-Boiled Eggs with Seasoning",
    description: "Protein-packed hard-boiled eggs with your favorite seasonings",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["High Protein", "Keto-Friendly", "Gluten-Free", "Low Carb", "Vegetarian"],
    ingredients: [
      { item: "hard-boiled eggs", quantity: 2, unit: "large" },
      { item: "everything bagel seasoning", quantity: 0.5, unit: "tsp" },
      { item: "paprika", quantity: 1, unit: "pinch" },
      { item: "sea salt", quantity: 1, unit: "pinch" },
      { item: "black pepper", quantity: 1, unit: "pinch" }
    ],
    instructions: [
      "Peel hard-boiled eggs",
      "Cut eggs in half lengthwise",
      "Sprinkle with everything bagel seasoning",
      "Add paprika, salt, and pepper to taste",
      "Serve immediately or refrigerate",
      "Optional: add a dollop of Greek yogurt"
    ],
    nutrition: { calories: 155, protein: 13, carbs: 1, fat: 11 }
  },
  {
    id: "cucumber-cream-cheese-bites",
    name: "Cucumber Cream Cheese Bites",
    description: "Refreshing cucumber rounds topped with herbed cream cheese",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Low Carb", "Keto-Friendly", "Gluten-Free", "Vegetarian", "Low Calorie"],
    ingredients: [
      { item: "cucumber (thick slices)", quantity: 8, unit: "slices" },
      { item: "cream cheese (whipped)", quantity: 2, unit: "tbsp" },
      { item: "fresh dill", quantity: 1, unit: "tsp" },
      { item: "cherry tomatoes (halved)", quantity: 4, unit: "small" },
      { item: "everything bagel seasoning", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Slice cucumber into thick rounds",
      "Mix cream cheese with fresh dill",
      "Top each cucumber slice with cream cheese",
      "Add half a cherry tomato on top",
      "Sprinkle with everything bagel seasoning",
      "Serve immediately or chill"
    ],
    nutrition: { calories: 135, protein: 4, carbs: 8, fat: 10 }
  },
  {
    id: "edamame-sea-salt",
    name: "Edamame with Sea Salt",
    description: "Steamed edamame pods sprinkled with sea salt",
    cuisine: "Asian",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Vegan", "High Protein", "High Fiber", "Gluten-Free", "Low Calorie"],
    ingredients: [
      { item: "edamame pods (frozen)", quantity: 1, unit: "cup" },
      { item: "sea salt", quantity: 0.5, unit: "tsp" },
      { item: "sesame oil", quantity: 0.5, unit: "tsp" },
      { item: "red pepper flakes", quantity: 1, unit: "pinch" }
    ],
    instructions: [
      "Boil edamame pods for 5 minutes",
      "Drain well",
      "Toss with sesame oil while hot",
      "Sprinkle with sea salt and red pepper flakes",
      "Serve warm",
      "Eat by squeezing beans out of pods"
    ],
    nutrition: { calories: 155, protein: 12, carbs: 12, fat: 6 }
  },
  {
    id: "turkey-cheese-roll-ups",
    name: "Turkey & Cheese Roll-Ups",
    description: "Deli turkey rolled with cheese and vegetables",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["High Protein", "Low Carb", "Keto-Friendly", "Gluten-Free", "Portable"],
    ingredients: [
      { item: "sliced turkey breast", quantity: 3, unit: "slices" },
      { item: "Swiss cheese slices", quantity: 2, unit: "slices" },
      { item: "cucumber sticks", quantity: 3, unit: "sticks" },
      { item: "mustard", quantity: 1, unit: "tsp" },
      { item: "lettuce leaves", quantity: 3, unit: "small" }
    ],
    instructions: [
      "Lay turkey slices flat",
      "Spread thin layer of mustard on each",
      "Place cheese slice on turkey",
      "Add lettuce and cucumber stick",
      "Roll tightly and secure with toothpick",
      "Serve immediately or refrigerate"
    ],
    nutrition: { calories: 175, protein: 20, carbs: 4, fat: 9 }
  },
  {
    id: "cottage-cheese-pineapple",
    name: "Cottage Cheese with Pineapple",
    description: "Creamy cottage cheese with sweet pineapple chunks",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Probiotic", "Gluten-Free", "Vegetarian", "Low Fat"],
    ingredients: [
      { item: "cottage cheese (low-fat)", quantity: 0.75, unit: "cup" },
      { item: "fresh pineapple chunks", quantity: 0.25, unit: "cup" },
      { item: "sunflower seeds", quantity: 1, unit: "tbsp" },
      { item: "cinnamon", quantity: 1, unit: "pinch" },
      { item: "honey", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Place cottage cheese in serving bowl",
      "Top with fresh pineapple chunks",
      "Sprinkle with sunflower seeds",
      "Dust with cinnamon",
      "Drizzle with honey if desired",
      "Serve chilled"
    ],
    nutrition: { calories: 195, protein: 22, carbs: 18, fat: 5 }
  },
  {
    id: "avocado-toast-mini",
    name: "Mini Avocado Toast",
    description: "Small piece of whole grain toast with mashed avocado",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Heart-Healthy", "Vegan Option", "Anti-Inflammatory", "High Fiber"],
    ingredients: [
      { item: "whole grain bread (small slice)", quantity: 1, unit: "slice" },
      { item: "avocado", quantity: 0.25, unit: "medium" },
      { item: "lemon juice", quantity: 0.5, unit: "tsp" },
      { item: "red pepper flakes", quantity: 1, unit: "pinch" },
      { item: "sea salt", quantity: 1, unit: "pinch" },
      { item: "hemp seeds", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Toast bread until golden",
      "Mash avocado with lemon juice and salt",
      "Spread avocado on toast",
      "Sprinkle with red pepper flakes and hemp seeds",
      "Cut into triangles if desired",
      "Serve immediately"
    ],
    nutrition: { calories: 165, protein: 5, carbs: 18, fat: 9 }
  },
  {
    id: "protein-smoothie-mini",
    name: "Mini Protein Smoothie",
    description: "Small protein-packed smoothie for energy boost",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: false,
    healthBadges: ["High Protein", "Low Sugar", "Dairy-Free Option", "Energy Boost"],
    ingredients: [
      { item: "protein powder (vanilla)", quantity: 0.5, unit: "scoop" },
      { item: "banana", quantity: 0.5, unit: "small" },
      { item: "almond milk (unsweetened)", quantity: 0.75, unit: "cup" },
      { item: "spinach", quantity: 0.25, unit: "cup" },
      { item: "almond butter", quantity: 1, unit: "tsp" },
      { item: "ice cubes", quantity: 3, unit: "cubes" }
    ],
    instructions: [
      "Add almond milk to blender",
      "Add banana, spinach, and protein powder",
      "Add almond butter and ice",
      "Blend until smooth and creamy",
      "Pour into small glass",
      "Drink immediately for best taste"
    ],
    nutrition: { calories: 185, protein: 16, carbs: 20, fat: 5 }
  },
  {
    id: "dark-chocolate-almonds",
    name: "Dark Chocolate Covered Almonds",
    description: "Antioxidant-rich dark chocolate with crunchy almonds",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Heart-Healthy", "Antioxidant-Rich", "Vegan", "Energy Boost"],
    ingredients: [
      { item: "dark chocolate (70% cacao)", quantity: 1, unit: "oz" },
      { item: "whole almonds", quantity: 15, unit: "nuts" },
      { item: "sea salt flakes", quantity: 1, unit: "pinch" }
    ],
    instructions: [
      "Purchase pre-made dark chocolate almonds OR",
      "Melt dark chocolate in microwave",
      "Toss almonds in melted chocolate",
      "Place on parchment paper",
      "Sprinkle with sea salt",
      "Refrigerate 10 minutes to set"
    ],
    nutrition: { calories: 235, protein: 6, carbs: 18, fat: 18 }
  },
  {
    id: "string-cheese-cherry-tomatoes",
    name: "String Cheese with Cherry Tomatoes",
    description: "Portable snack of string cheese and fresh tomatoes",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["High Protein", "Portable", "Gluten-Free", "Vegetarian", "Low Carb"],
    ingredients: [
      { item: "string cheese (mozzarella)", quantity: 1, unit: "stick" },
      { item: "cherry tomatoes", quantity: 8, unit: "small" },
      { item: "fresh basil leaves", quantity: 4, unit: "leaves" },
      { item: "balsamic glaze", quantity: 1, unit: "tsp" },
      { item: "black pepper", quantity: 1, unit: "pinch" }
    ],
    instructions: [
      "Peel string cheese into strips or leave whole",
      "Wash cherry tomatoes",
      "Arrange cheese and tomatoes on plate",
      "Tuck basil leaves between items",
      "Drizzle with balsamic glaze",
      "Season with black pepper"
    ],
    nutrition: { calories: 135, protein: 10, carbs: 8, fat: 8 }
  },
  {
    id: "rice-cakes-peanut-butter",
    name: "Rice Cakes with Peanut Butter",
    description: "Crispy rice cakes topped with natural peanut butter and banana",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Gluten-Free", "Energy Boost", "Vegan Option", "Heart-Healthy"],
    ingredients: [
      { item: "rice cakes (plain)", quantity: 2, unit: "cakes" },
      { item: "natural peanut butter", quantity: 2, unit: "tbsp" },
      { item: "banana (sliced)", quantity: 0.5, unit: "small" },
      { item: "cinnamon", quantity: 1, unit: "pinch" },
      { item: "honey", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Spread peanut butter on each rice cake",
      "Top with banana slices",
      "Sprinkle with cinnamon",
      "Drizzle with honey if desired",
      "Serve immediately for best crunch",
      "Can be made ahead and wrapped"
    ],
    nutrition: { calories: 265, protein: 9, carbs: 32, fat: 12 }
  },
  {
    id: "caprese-skewers-mini",
    name: "Mini Caprese Skewers",
    description: "Bite-sized skewers with mozzarella, tomato, and basil",
    cuisine: "Italian",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Low Carb", "Vegetarian", "Gluten-Free", "Mediterranean Diet"],
    ingredients: [
      { item: "cherry tomatoes", quantity: 6, unit: "small" },
      { item: "mini mozzarella balls", quantity: 6, unit: "balls" },
      { item: "fresh basil leaves", quantity: 6, unit: "leaves" },
      { item: "balsamic glaze", quantity: 1, unit: "tsp" },
      { item: "olive oil", quantity: 1, unit: "tsp" },
      { item: "sea salt", quantity: 1, unit: "pinch" }
    ],
    instructions: [
      "Thread tomato, basil, and mozzarella on toothpicks",
      "Repeat for 6 skewers",
      "Arrange on serving plate",
      "Drizzle with olive oil and balsamic glaze",
      "Sprinkle with sea salt",
      "Serve at room temperature"
    ],
    nutrition: { calories: 165, protein: 10, carbs: 8, fat: 12 }
  },
  {
    id: "roasted-chickpeas-spiced",
    name: "Spiced Roasted Chickpeas",
    description: "Crunchy roasted chickpeas with savory spices",
    cuisine: "Mediterranean",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Vegan", "High Fiber", "High Protein", "Gluten-Free", "Crunchy"],
    ingredients: [
      { item: "chickpeas (cooked, drained)", quantity: 0.5, unit: "cup" },
      { item: "olive oil", quantity: 1, unit: "tsp" },
      { item: "paprika", quantity: 0.25, unit: "tsp" },
      { item: "cumin", quantity: 0.25, unit: "tsp" },
      { item: "garlic powder", quantity: 0.125, unit: "tsp" },
      { item: "sea salt", quantity: 0.25, unit: "tsp" }
    ],
    instructions: [
      "Preheat oven to 400°F",
      "Pat chickpeas dry with paper towel",
      "Toss with olive oil and spices",
      "Spread on baking sheet in single layer",
      "Roast 20-25 minutes until crispy",
      "Let cool slightly before eating"
    ],
    nutrition: { calories: 155, protein: 7, carbs: 22, fat: 5 }
  },
  {
    id: "celery-almond-butter",
    name: "Celery Sticks with Almond Butter",
    description: "Crunchy celery filled with creamy almond butter",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Low Carb", "Vegan", "Gluten-Free", "Heart-Healthy", "Low Calorie"],
    ingredients: [
      { item: "celery stalks", quantity: 3, unit: "stalks" },
      { item: "almond butter", quantity: 2, unit: "tbsp" },
      { item: "raisins", quantity: 1, unit: "tbsp" },
      { item: "hemp seeds", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Wash celery and cut into 3-inch pieces",
      "Fill celery groove with almond butter",
      "Top with raisins (ants on a log style)",
      "Sprinkle with hemp seeds",
      "Arrange on plate",
      "Serve immediately or refrigerate"
    ],
    nutrition: { calories: 215, protein: 6, carbs: 18, fat: 15 }
  },
  {
    id: "tuna-cucumber-bites",
    name: "Tuna Cucumber Bites",
    description: "Light tuna salad on cucumber rounds",
    cuisine: "American",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["High Protein", "Low Carb", "Omega-3 Rich", "Gluten-Free", "Pescatarian"],
    ingredients: [
      { item: "cucumber (thick slices)", quantity: 8, unit: "slices" },
      { item: "canned tuna (in water)", quantity: 2, unit: "oz" },
      { item: "Greek yogurt", quantity: 1, unit: "tbsp" },
      { item: "Dijon mustard", quantity: 0.5, unit: "tsp" },
      { item: "fresh dill", quantity: 1, unit: "tsp" },
      { item: "paprika", quantity: 1, unit: "pinch" }
    ],
    instructions: [
      "Slice cucumber into thick rounds",
      "Mix tuna with Greek yogurt, mustard, and dill",
      "Top each cucumber slice with tuna mixture",
      "Sprinkle with paprika",
      "Chill before serving if desired",
      "Serve as elegant finger food"
    ],
    nutrition: { calories: 125, protein: 16, carbs: 6, fat: 4 }
  },
  {
    id: "guacamole-veggie-chips",
    name: "Guacamole with Veggie Chips",
    description: "Fresh guacamole with crunchy vegetable chips",
    cuisine: "Mexican",
    category: "snack",
    baseServings: 1,
    fingerFood: true,
    healthBadges: ["Vegan", "Heart-Healthy", "Anti-Inflammatory", "Gluten-Free"],
    ingredients: [
      { item: "ripe avocado", quantity: 0.5, unit: "medium" },
      { item: "lime juice", quantity: 1, unit: "tsp" },
      { item: "diced tomato", quantity: 2, unit: "tbsp" },
      { item: "red onion (minced)", quantity: 1, unit: "tbsp" },
      { item: "cilantro (chopped)", quantity: 1, unit: "tbsp" },
      { item: "veggie chips", quantity: 1, unit: "oz" }
    ],
    instructions: [
      "Mash avocado in small bowl",
      "Mix in lime juice, tomato, onion, and cilantro",
      "Season with salt and pepper",
      "Serve with veggie chips for dipping",
      "Eat immediately to prevent browning",
      "Press plastic wrap on surface if storing"
    ],
    nutrition: { calories: 245, protein: 4, carbs: 22, fat: 17 }
  }
];
