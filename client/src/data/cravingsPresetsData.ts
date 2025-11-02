export type Ingredient = { 
  name: string; 
  quantity: number; 
  unit?: string; 
};

export type CravingPreset = {
  id: string;
  name: string;
  image?: string;
  summary?: string;
  baseServings: number; // quantities are for this base (1)
  ingredients: Ingredient[];
  instructions: string[]; // specific, no fluff
  badges?: string[];
  tags?: string[];
  macros?: { calories: number; protein: number; carbs: number; fat: number };
};

export const CRAVING_PRESETS: CravingPreset[] = [
  {
    id: "crv-001",
    name: "Chocolate Protein Mousse",
    image: "/images/cravings/choc-mousse.jpg",
    summary: "Creamy, chocolatey, high‑protein comfort.",
    baseServings: 1,
    ingredients: [
      { name: "plain Greek yogurt (2%–5%)", quantity: 170, unit: "g" },
      { name: "unsweetened cocoa", quantity: 1.5, unit: "tbsp" },
      { name: "zero‑cal sweetener or maple", quantity: 1, unit: "tbsp" },
      { name: "vanilla extract", quantity: 0.5, unit: "tsp" },
      { name: "pinch of salt", quantity: 1 }
    ],
    instructions: [
      "Whisk yogurt, cocoa, sweetener, vanilla, salt until smooth.",
      "Chill 10+ min for thicker texture.",
      "Optional: top with berries or dark chocolate shavings."
    ],
    badges: ["High protein", "Low sugar"],
    tags: ["chocolate", "dessert", "protein"],
    macros: { calories: 180, protein: 23, carbs: 13, fat: 4 }
  },
  {
    id: "crv-002",
    name: "Strawberry Cheesecake Parfait",
    image: "/images/cravings/strawberry-cheesecake-parfait.jpg",
    summary: "Cheesecake vibe without the crash.",
    baseServings: 1,
    ingredients: [
      { name: "nonfat Greek yogurt", quantity: 170, unit: "g" },
      { name: "light cream cheese", quantity: 28, unit: "g" },
      { name: "vanilla extract", quantity: 0.5, unit: "tsp" },
      { name: "strawberries, sliced", quantity: 0.75, unit: "cup" },
      { name: "graham crumbs (or HF alternative)", quantity: 1, unit: "tbsp" },
      { name: "sweetener", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Mix yogurt, cream cheese, vanilla, sweetener until fluffy.",
      "Layer with strawberries and crumbs in a glass.",
      "Top with extra berries."
    ],
    badges: ["High protein", "Lower sugar"],
    tags: ["strawberry", "cheesecake", "parfait"],
    macros: { calories: 220, protein: 18, carbs: 28, fat: 5 }
  },
  {
    id: "crv-003",
    name: "Cinnamon Roll Protein Oats",
    image: "/images/cravings/cinnamon-roll-oats.jpg",
    summary: "Warm, cozy, frosting vibes.",
    baseServings: 1,
    ingredients: [
      { name: "rolled oats", quantity: 40, unit: "g" },
      { name: "protein powder, vanilla", quantity: 24, unit: "g" },
      { name: "cinnamon", quantity: 0.5, unit: "tsp" },
      { name: "unsweetened almond milk", quantity: 240, unit: "ml" },
      { name: "Greek yogurt (topping)", quantity: 60, unit: "g" },
      { name: "sweetener (to taste)", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Cook oats with milk, cinnamon until creamy.",
      "Stir in protein powder off heat.",
      "Top with yogurt swirl and extra cinnamon."
    ],
    badges: ["High protein", "High fiber"],
    tags: ["oatmeal", "cinnamon", "breakfast"],
    macros: { calories: 290, protein: 27, carbs: 33, fat: 6 }
  },
  {
    id: "crv-004",
    name: "Apple Pie Crumble Cup",
    image: "/images/cravings/apple-crumble-cup.jpg",
    summary: "Pie flavor, weeknight speed.",
    baseServings: 1,
    ingredients: [
      { name: "apple, diced", quantity: 1 },
      { name: "rolled oats", quantity: 20, unit: "g" },
      { name: "almond or oat flour", quantity: 1, unit: "tbsp" },
      { name: "cinnamon", quantity: 0.5, unit: "tsp" },
      { name: "butter or coconut oil, melted", quantity: 1, unit: "tsp" },
      { name: "sweetener", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Toss diced apple with half the cinnamon.",
      "Mix oats, flour, remaining cinnamon, butter, sweetener.",
      "Layer apple, then crumble; microwave 60-90 sec or bake 350°F 12 min."
    ],
    badges: ["High fiber"],
    tags: ["apple", "dessert", "crumble"],
    macros: { calories: 210, protein: 4, carbs: 38, fat: 6 }
  },
  {
    id: "crv-005",
    name: "Peanut Butter Cup Bites",
    image: "/images/cravings/pb-cup-bites.jpg",
    summary: "Salty‑sweet, chocolate‑peanut hit with control.",
    baseServings: 1,
    ingredients: [
      { name: "natural peanut butter", quantity: 1, unit: "tbsp" },
      { name: "dark chocolate chips 60–70%", quantity: 1, unit: "tbsp" },
      { name: "oat flour (or protein crisps)", quantity: 1, unit: "tbsp" },
      { name: "pinch of salt", quantity: 1 }
    ],
    instructions: [
      "Mix PB with oat flour and salt; roll into 4-5 small balls.",
      "Melt chocolate chips; dip each ball halfway.",
      "Chill 15 min until set."
    ],
    badges: ["Portion controlled"],
    tags: ["peanut butter", "chocolate", "snack"],
    macros: { calories: 190, protein: 6, carbs: 13, fat: 13 }
  },
  {
    id: "crv-006",
    name: "Salt-&-Vinegar Roasted Chickpeas",
    image: "/images/cravings/sv-chickpeas.jpg",
    summary: "Crunch like chips, fiber like a champ.",
    baseServings: 1,
    ingredients: [
      { name: "canned chickpeas, drained", quantity: 120, unit: "g" },
      { name: "apple cider vinegar", quantity: 1.5, unit: "tbsp" },
      { name: "olive oil", quantity: 1, unit: "tsp" },
      { name: "salt", quantity: 0.25, unit: "tsp" }
    ],
    instructions: [
      "Pat chickpeas dry; toss with oil, vinegar, salt.",
      "Air-fry 375°F / 190°C 12-15 min, shaking twice.",
      "Cool 5 min to maximize crunch."
    ],
    badges: ["High fiber"],
    tags: ["crunchy", "salty", "snack"],
    macros: { calories: 180, protein: 9, carbs: 22, fat: 6 }
  },
  {
    id: "crv-007",
    name: "BBQ Potato Wedges (Air‑Fryer)",
    image: "/images/cravings/bbq-wedges.jpg",
    summary: "Fries energy, less grease.",
    baseServings: 1,
    ingredients: [
      { name: "russet potato, wedged", quantity: 200, unit: "g" },
      { name: "olive oil", quantity: 1, unit: "tsp" },
      { name: "BBQ seasoning (low‑sodium)", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Toss wedges with oil and seasoning.",
      "Air‑fry 400°F / 205°C 15–18 min, shaking once.",
      "Finish with extra BBQ seasoning if desired."
    ],
    badges: ["Lower fat"],
    tags: ["potato", "bbq", "crispy"],
    macros: { calories: 220, protein: 5, carbs: 38, fat: 6 }
  },
  {
    id: "crv-008",
    name: "Crispy Chicken Tenders (Air‑Fryer)",
    image: "/images/cravings/chicken-tenders.jpg",
    summary: "Crispy outside, juicy inside.",
    baseServings: 1,
    ingredients: [
      { name: "chicken breast, strips", quantity: 120, unit: "g" },
      { name: "egg white", quantity: 1 },
      { name: "panko crumbs (whole‑wheat pref.)", quantity: 0.5, unit: "cup" },
      { name: "paprika + garlic powder", quantity: 1, unit: "tsp" },
      { name: "salt", quantity: 0.25, unit: "tsp" }
    ],
    instructions: [
      "Dip strips in egg white, then seasoned panko.",
      "Air‑fry 400°F / 205°C 8-10 min, flipping once.",
      "Check internal temp 165°F / 74°C."
    ],
    badges: ["High protein"],
    tags: ["chicken", "crispy", "protein"],
    macros: { calories: 230, protein: 28, carbs: 18, fat: 6 }
  },
  {
    id: "crv-009",
    name: "Portobello Pizza Caps",
    image: "/images/cravings/portobello-pizza.jpg",
    summary: "Pizza flavor, veggie base.",
    baseServings: 1,
    ingredients: [
      { name: "large portobello cap", quantity: 1 },
      { name: "marinara (no‑sugar‑added)", quantity: 2, unit: "tbsp" },
      { name: "part‑skim mozzarella, shredded", quantity: 28, unit: "g" },
      { name: "turkey pepperoni (opt)", quantity: 6, unit: "slices" }
    ],
    instructions: [
      "Scoop gills lightly; pat cap dry.",
      "Fill with marinara, cheese, pepperoni.",
      "Bake 375°F / 190°C 12-15 min until cheese bubbles."
    ],
    badges: ["Low carb"],
    tags: ["pizza", "mushroom", "cheese"],
    macros: { calories: 190, protein: 18, carbs: 8, fat: 10 }
  },
  {
    id: "crv-010",
    name: "Turkey Nacho Skillet (Single‑Serve)",
    image: "/images/cravings/turkey-nacho-skillet.jpg",
    summary: "Nacho fix, protein‑forward.",
    baseServings: 1,
    ingredients: [
      { name: "extra‑lean ground turkey", quantity: 120, unit: "g" },
      { name: "taco seasoning (low‑sodium)", quantity: 1, unit: "tsp" },
      { name: "black beans, rinsed", quantity: 60, unit: "g" },
      { name: "salsa", quantity: 2, unit: "tbsp" },
      { name: "baked tortilla chips", quantity: 15, unit: "g" },
      { name: "shredded cheese", quantity: 28, unit: "g" }
    ],
    instructions: [
      "Brown turkey with taco seasoning.",
      "Add beans, salsa; simmer 2 min.",
      "Top chips with turkey mix and cheese; broil 1-2 min."
    ],
    badges: ["High protein"],
    tags: ["nacho", "turkey", "mexican"],
    macros: { calories: 270, protein: 27, carbs: 18, fat: 9 }
  },
  {
    id: "crv-011",
    name: "2‑Ingredient Banana Soft‑Serve",
    image: "/images/cravings/banana-soft-serve.jpg",
    summary: "Ice‑cream feel, fruit‑first.",
    baseServings: 1,
    ingredients: [
      { name: "frozen ripe banana coins", quantity: 120, unit: "g" },
      { name: "unsweetened almond milk", quantity: 30, unit: "ml" }
    ],
    instructions: [
      "Blend bananas with milk, scraping as needed, until soft‑serve.",
      "Optional: add vanilla or cinnamon."
    ],
    badges: ["No added sugar"],
    tags: ["ice cream", "banana", "simple"],
    macros: { calories: 120, protein: 2, carbs: 30, fat: 0 }
  },
  {
    id: "crv-012",
    name: "Chocolate PB 'Milkshake'",
    image: "/images/cravings/choc-pb-shake.jpg",
    summary: "Thick, rich, macro‑friendly.",
    baseServings: 1,
    ingredients: [
      { name: "protein powder, chocolate", quantity: 30, unit: "g" },
      { name: "frozen banana", quantity: 100, unit: "g" },
      { name: "peanut butter", quantity: 1, unit: "tbsp" },
      { name: "unsweetened almond milk", quantity: 240, unit: "ml" },
      { name: "ice cubes", quantity: 4 }
    ],
    instructions: [
      "Blend everything on high until thick and smooth.",
      "Add more ice for thicker consistency."
    ],
    badges: ["High protein"],
    tags: ["shake", "chocolate", "peanut butter"],
    macros: { calories: 260, protein: 25, carbs: 25, fat: 8 }
  },
  {
    id: "crv-013",
    name: "Oatmeal Chocolate‑Chip Cookie (Mug/Air‑Fryer)",
    image: "/images/cravings/oat-cookie.jpg",
    summary: "Chewy, gooey center; better macros.",
    baseServings: 1,
    ingredients: [
      { name: "oat flour", quantity: 30, unit: "g" },
      { name: "applesauce (unsweetened)", quantity: 2, unit: "tbsp" },
      { name: "egg white", quantity: 1 },
      { name: "dark chocolate chips", quantity: 1, unit: "tbsp" },
      { name: "vanilla + pinch salt", quantity: 1 }
    ],
    instructions: [
      "Mix all; form into cookie shape in oven‑safe mug or air‑fryer basket.",
      "Bake 350°F / 175°C 8-10 min or air‑fry 320°F 6-8 min.",
      "Cool slightly before eating."
    ],
    badges: ["Lower sugar"],
    tags: ["cookie", "oatmeal", "chocolate chip"],
    macros: { calories: 200, protein: 7, carbs: 28, fat: 7 }
  },
  {
    id: "crv-014",
    name: "Baked Cinnamon Donut Holes",
    image: "/images/cravings/donut-holes.jpg",
    summary: "Donut shop vibe, oven method.",
    baseServings: 1,
    ingredients: [
      { name: "oat flour", quantity: 30, unit: "g" },
      { name: "plain Greek yogurt", quantity: 45, unit: "g" },
      { name: "egg white", quantity: 1 },
      { name: "baking powder", quantity: 0.5, unit: "tsp" },
      { name: "cinnamon", quantity: 0.5, unit: "tsp" },
      { name: "sweetener", quantity: 1 }
    ],
    instructions: [
      "Whisk batter until smooth; roll into 6-8 small balls.",
      "Bake 375°F / 190°C 8-10 min until golden.",
      "Optional: roll in cinnamon-sweetener mix while warm."
    ],
    badges: ["Baked not fried"],
    tags: ["donut", "cinnamon", "baked"],
    macros: { calories: 160, protein: 9, carbs: 24, fat: 3 }
  },
  {
    id: "crv-015",
    name: "Air‑Fryer Fries (Real Potato)",
    image: "/images/cravings/airfries.jpg",
    summary: "Crisp edges, tender centers.",
    baseServings: 1,
    ingredients: [
      { name: "russet potato, sticks", quantity: 220, unit: "g" },
      { name: "olive oil", quantity: 1, unit: "tsp" },
      { name: "salt", quantity: 0.25, unit: "tsp" }
    ],
    instructions: [
      "Soak sticks 10 min, dry well.",
      "Toss with oil/salt; air‑fry 390°F / 200°C 16–20 min, shaking."
    ],
    badges: ["Lower fat"],
    tags: ["fries", "potato", "crispy"],
    macros: { calories: 240, protein: 5, carbs: 42, fat: 6 }
  },
  {
    id: "crv-016",
    name: "Light 'Mac' & Cheese (Cauli‑Mac Blend)",
    image: "/images/cravings/cauli-mac.jpg",
    summary: "Creamy, cheesy, sneaky veg.",
    baseServings: 1,
    ingredients: [
      { name: "whole‑wheat elbows, dry", quantity: 40, unit: "g" },
      { name: "cauliflower florets", quantity: 120, unit: "g" },
      { name: "part‑skim cheddar, shredded", quantity: 28, unit: "g" },
      { name: "Greek yogurt", quantity: 45, unit: "g" },
      { name: "mustard + garlic powder", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Cook pasta and cauliflower together until tender; drain.",
      "Mix with cheese, yogurt, mustard, garlic powder until creamy.",
      "Season with salt/pepper to taste."
    ],
    badges: ["Hidden veggies"],
    tags: ["mac and cheese", "cauliflower", "comfort food"],
    macros: { calories: 250, protein: 15, carbs: 36, fat: 7 }
  },
  {
    id: "crv-017",
    name: "90‑Second Brownie Mug",
    image: "/images/cravings/mug-brownie.jpg",
    summary: "Fudgy fix, portion‑controlled.",
    baseServings: 1,
    ingredients: [
      { name: "oat flour", quantity: 30, unit: "g" },
      { name: "unsweetened cocoa", quantity: 1.5, unit: "tbsp" },
      { name: "sweetener or maple", quantity: 1, unit: "tbsp" },
      { name: "milk of choice", quantity: 60, unit: "ml" },
      { name: "baking powder", quantity: 0.25, unit: "tsp" },
      { name: "pinch salt", quantity: 1 }
    ],
    instructions: [
      "Mix dry ingredients in microwave‑safe mug.",
      "Add milk; stir until smooth.",
      "Microwave 75-90 sec until set but still fudgy."
    ],
    badges: ["Single serving"],
    tags: ["brownie", "chocolate", "microwave"],
    macros: { calories: 175, protein: 5, carbs: 30, fat: 4 }
  },
  {
    id: "crv-018",
    name: "Loaded Cauliflower 'Potato' Salad",
    image: "/images/cravings/cauli-potato-salad.jpg",
    summary: "Picnic vibes, lighter base.",
    baseServings: 1,
    ingredients: [
      { name: "cauliflower, steamed & cooled", quantity: 200, unit: "g" },
      { name: "Greek yogurt", quantity: 45, unit: "g" },
      { name: "Dijon mustard", quantity: 1, unit: "tsp" },
      { name: "green onion, chopped", quantity: 1, unit: "tbsp" },
      { name: "turkey bacon bits", quantity: 1, unit: "tbsp" },
      { name: "cheddar, diced", quantity: 14, unit: "g" }
    ],
    instructions: [
      "Chop steamed cauliflower into bite‑size pieces.",
      "Mix yogurt, mustard, green onion.",
      "Toss cauliflower with dressing, top with bacon and cheese."
    ],
    badges: ["Lower carb"],
    tags: ["salad", "cauliflower", "loaded"],
    macros: { calories: 165, protein: 12, carbs: 12, fat: 8 }
  },
  {
    id: "crv-019",
    name: "Buffalo Chicken Lettuce Wraps",
    image: "/images/cravings/buffalo-wraps.jpg",
    summary: "Wing flavor, no mess.",
    baseServings: 1,
    ingredients: [
      { name: "cooked chicken breast, diced", quantity: 120, unit: "g" },
      { name: "buffalo sauce (low‑sodium)", quantity: 2, unit: "tbsp" },
      { name: "Greek yogurt", quantity: 30, unit: "g" },
      { name: "celery, diced", quantity: 2, unit: "tbsp" },
      { name: "butter lettuce leaves", quantity: 4 }
    ],
    instructions: [
      "Mix chicken with buffalo sauce.",
      "Fill lettuce cups with buffalo chicken.",
      "Top with yogurt dollop and diced celery."
    ],
    badges: ["High protein", "Low carb"],
    tags: ["buffalo", "chicken", "wraps"],
    macros: { calories: 180, protein: 30, carbs: 4, fat: 4 }
  },
  {
    id: "crv-020",
    name: "Vanilla Protein Pancake Stack",
    image: "/images/cravings/protein-pancakes.jpg",
    summary: "Sunday morning vibes, macro‑friendly.",
    baseServings: 1,
    ingredients: [
      { name: "protein powder, vanilla", quantity: 30, unit: "g" },
      { name: "egg white", quantity: 2 },
      { name: "banana, mashed", quantity: 0.5 },
      { name: "baking powder", quantity: 0.5, unit: "tsp" },
      { name: "cinnamon", quantity: 0.25, unit: "tsp" },
      { name: "unsweetened almond milk", quantity: 60, unit: "ml" }
    ],
    instructions: [
      "Blend all ingredients until smooth batter forms.",
      "Cook 3-4 small pancakes in non‑stick pan, 2 min per side.",
      "Stack and top with berries or sugar‑free syrup."
    ],
    badges: ["High protein"],
    tags: ["pancakes", "protein", "breakfast"],
    macros: { calories: 240, protein: 28, carbs: 20, fat: 5 }
  },
  {
    id: "crv-021",
    name: "Matcha Energy Balls",
    image: "/images/cravings/matcha-energy-balls.jpg",
    summary: "Earthy, energizing bites with green tea power.",
    baseServings: 1,
    ingredients: [
      { name: "rolled oats", quantity: 40, unit: "g" },
      { name: "almond butter", quantity: 1, unit: "tbsp" },
      { name: "honey or maple syrup", quantity: 1, unit: "tbsp" },
      { name: "matcha powder", quantity: 1, unit: "tsp" },
      { name: "chia seeds", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Mix everything until combined.",
      "Roll into 4–5 small balls; chill 15 min to set."
    ],
    badges: ["Energizing", "Antioxidant-rich"],
    tags: ["green tea", "bites", "snack"],
    macros: { calories: 220, protein: 8, carbs: 26, fat: 9 }
  },
  {
    id: "crv-022",
    name: "Spicy Mango Yogurt Bowl",
    image: "/images/cravings/spicy-mango-yogurt-bowl.jpg",
    summary: "Tropical sweetness meets chili heat.",
    baseServings: 1,
    ingredients: [
      { name: "plain Greek yogurt", quantity: 150, unit: "g" },
      { name: "mango, diced", quantity: 0.5, unit: "cup" },
      { name: "chili-lime seasoning", quantity: 0.25, unit: "tsp" },
      { name: "honey or agave", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Stir yogurt and honey together.",
      "Top with mango and sprinkle chili-lime seasoning."
    ],
    badges: ["High protein", "Refreshing"],
    tags: ["spicy", "fruit", "sweet"],
    macros: { calories: 180, protein: 15, carbs: 22, fat: 4 }
  },
  {
    id: "crv-023",
    name: "Mediterranean Hummus Plate",
    image: "/images/cravings/mediterranean-hummus-plate.jpg",
    summary: "Creamy hummus with crisp veggie dippers.",
    baseServings: 1,
    ingredients: [
      { name: "hummus", quantity: 3, unit: "tbsp" },
      { name: "carrot sticks", quantity: 0.5, unit: "cup" },
      { name: "cucumber slices", quantity: 0.5, unit: "cup" },
      { name: "olive oil drizzle", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Spread hummus on a plate.",
      "Arrange veggies and drizzle olive oil on top."
    ],
    badges: ["Plant-based", "High fiber"],
    tags: ["savory", "veggie", "dip"],
    macros: { calories: 190, protein: 6, carbs: 16, fat: 11 }
  },
  {
    id: "crv-024",
    name: "Thai Peanut Lettuce Cups",
    image: "/images/cravings/thai-peanut-lettuce-cups.jpg",
    summary: "Crunchy, sweet-salty peanut flavor in lettuce wraps.",
    baseServings: 1,
    ingredients: [
      { name: "lettuce leaves", quantity: 3 },
      { name: "shredded chicken or tofu", quantity: 80, unit: "g" },
      { name: "peanut sauce", quantity: 1.5, unit: "tbsp" },
      { name: "shredded carrots", quantity: 0.25, unit: "cup" }
    ],
    instructions: [
      "Fill lettuce leaves with chicken, sauce, and carrots.",
      "Roll and eat immediately."
    ],
    badges: ["High protein", "Lower carb"],
    tags: ["savory", "asian", "crunchy"],
    macros: { calories: 210, protein: 20, carbs: 9, fat: 11 }
  },
  {
    id: "crv-025",
    name: "Coconut Chia Pudding",
    image: "/images/cravings/coconut-chia-pudding.jpg",
    summary: "Creamy coconut base with fiber and omega-3s.",
    baseServings: 1,
    ingredients: [
      { name: "chia seeds", quantity: 2, unit: "tbsp" },
      { name: "light coconut milk", quantity: 120, unit: "ml" },
      { name: "vanilla extract", quantity: 0.25, unit: "tsp" },
      { name: "sweetener (optional)", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Mix all ingredients in a jar.",
      "Refrigerate 3+ hours until thick."
    ],
    badges: ["High fiber", "Vegan"],
    tags: ["pudding", "sweet", "creamy"],
    macros: { calories: 200, protein: 5, carbs: 16, fat: 12 }
  },
  {
    id: "crv-026",
    name: "Protein Trail Mix Clusters",
    image: "/images/cravings/protein-trailmix-clusters.jpg",
    summary: "Crunchy, salty-sweet trail mix clusters.",
    baseServings: 1,
    ingredients: [
      { name: "mixed nuts", quantity: 25, unit: "g" },
      { name: "pumpkin seeds", quantity: 10, unit: "g" },
      { name: "dried cranberries", quantity: 10, unit: "g" },
      { name: "protein powder, vanilla", quantity: 10, unit: "g" },
      { name: "honey", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Mix everything in a bowl.",
      "Bake or air-fry 300°F / 150°C for 10 min until lightly set."
    ],
    badges: ["High protein", "On-the-go"],
    tags: ["trail mix", "sweet-salty", "snack"],
    macros: { calories: 240, protein: 12, carbs: 18, fat: 14 }
  },
  {
    id: "crv-027",
    name: "Mini Caprese Skewers",
    image: "/images/cravings/mini-caprese-skewers.jpg",
    summary: "Tomato, mozzarella, basil — Italian simplicity.",
    baseServings: 1,
    ingredients: [
      { name: "cherry tomatoes", quantity: 6 },
      { name: "mini mozzarella balls", quantity: 4 },
      { name: "fresh basil leaves", quantity: 4 },
      { name: "balsamic glaze", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Thread tomato, mozzarella, and basil onto skewers.",
      "Drizzle with balsamic glaze."
    ],
    badges: ["Fresh", "Low carb"],
    tags: ["savory", "italian", "bite-size"],
    macros: { calories: 160, protein: 9, carbs: 6, fat: 11 }
  },
  {
    id: "crv-028",
    name: "Sweet Potato Fries (Air-Fryer)",
    image: "/images/cravings/sweet-potato-fries.jpg",
    summary: "Naturally sweet and crispy edges.",
    baseServings: 1,
    ingredients: [
      { name: "sweet potato, sticks", quantity: 180, unit: "g" },
      { name: "olive oil", quantity: 1, unit: "tsp" },
      { name: "cinnamon + salt", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Toss sticks with oil and seasoning.",
      "Air-fry 400°F / 205°C for 15–18 min, shake halfway."
    ],
    badges: ["Whole food", "Lower fat"],
    tags: ["sweet", "crunchy", "side"],
    macros: { calories: 210, protein: 3, carbs: 35, fat: 7 }
  },
  {
    id: "crv-029",
    name: "Sushi Roll Snack Cups",
    image: "/images/cravings/sushi-roll-snack-cups.jpg",
    summary: "All sushi flavor, no rolling required.",
    baseServings: 1,
    ingredients: [
      { name: "cooked sushi rice", quantity: 60, unit: "g" },
      { name: "imitation crab or tofu", quantity: 50, unit: "g" },
      { name: "avocado, diced", quantity: 0.25, unit: "fruit" },
      { name: "nori flakes", quantity: 1, unit: "tsp" },
      { name: "light soy sauce", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Layer rice, crab, and avocado in a cup.",
      "Top with nori and drizzle soy sauce."
    ],
    badges: ["Balanced", "Creative"],
    tags: ["asian", "savory", "bowl"],
    macros: { calories: 210, protein: 9, carbs: 28, fat: 7 }
  },
  {
    id: "crv-030",
    name: "Chocolate-Covered Strawberry Bites",
    image: "/images/cravings/choc-strawberry-bites.jpg",
    summary: "Romantic, portion-controlled indulgence.",
    baseServings: 1,
    ingredients: [
      { name: "strawberries, halved", quantity: 6 },
      { name: "dark chocolate (70%)", quantity: 20, unit: "g" },
      { name: "crushed almonds (optional)", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Dip strawberry halves in melted chocolate.",
      "Sprinkle almonds and chill until set."
    ],
    badges: ["Lower sugar", "Antioxidant"],
    tags: ["sweet", "chocolate", "fruit"],
    macros: { calories: 170, protein: 3, carbs: 20, fat: 9 }
  }
];