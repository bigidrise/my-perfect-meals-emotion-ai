// --- NEW: server/routes/craving-creator.ts ---
import express from "express";
import { z } from "zod";
import { db } from "../db";
import { mealInstances, userRecipes } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

const router = express.Router();

// Mock authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  req.user = { id: "mock-user-id" };
  next();
};

// Schema for craving generation
const cravingSchema = z.object({
  craving: z.string(),
  servings: z.number().min(1).max(8).default(2),
  mealtime: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).default('dinner'),
  dietaryRestrictions: z.array(z.string()).default([]),
  healthConditions: z.array(z.string()).default([]),
});

// Schema for logging craving meal
const logMealSchema = z.object({
  recipePayload: z.object({
    title: z.string(),
    ingredients: z.any(),
    instructions: z.string(),
    nutrition: z.any().optional(),
  }),
  mealInstanceId: z.string().optional(),
  logNow: z.boolean().default(true),
  note: z.string().optional(),
});

// POST /api/craving-creator/generate - Generate recipe based on craving
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const input = cravingSchema.parse(req.body);
    
    // Mock AI recipe generation - replace with actual AI service
    const generatedRecipe = {
      title: `Healthy ${input.craving}`,
      ingredients: [
        { name: "Main ingredient", amount: "1", unit: "portion" },
        { name: "Supporting ingredient", amount: "1/2", unit: "cup" },
        { name: "Seasoning", amount: "1", unit: "tsp" }
      ],
      instructions: `1. Prepare ingredients for your ${input.craving} craving\n2. Cook according to preference\n3. Season to satisfy your craving\n4. Serve and enjoy`,
      nutrition: {
        calories: 400,
        protein: 25,
        carbs: 35,
        fat: 18,
        fiber: 6
      },
      servings: input.servings,
      prepTime: 15,
      cookTime: 20
    };

    res.json({
      success: true,
      recipe: generatedRecipe,
      source: 'craving-creator'
    });
  } catch (error) {
    console.error("Error generating craving recipe:", error);
    res.status(500).json({ error: "Failed to generate recipe" });
  }
});

// POST /api/craving-creator/log - Log craving meal (convenience wrapper)
router.post('/log', requireAuth, async (req, res) => {
  try {
    const input = logMealSchema.parse(req.body);
    const userId = req.user.id;

    // Save recipe to user_recipes
    const [savedRecipe] = await db.insert(userRecipes).values({
      userId,
      title: input.recipePayload.title,
      ingredients: input.recipePayload.ingredients,
      instructions: input.recipePayload.instructions,
      nutrition: input.recipePayload.nutrition
    }).returning({ id: userRecipes.id });

    // If replacing an existing meal instance
    if (input.mealInstanceId) {
      // Use the replace-and-optional-log flow
      const response = await fetch(`/api/meals/${input.mealInstanceId}/replace-and-optional-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeId: savedRecipe.id,
          logNow: input.logNow,
          source: 'craving',
          note: input.note
        })
      });

      if (!response.ok) {
        throw new Error('Failed to replace meal');
      }

      const result = await response.json();
      return res.json(result);
    } else {
      // Create new standalone meal instance
      const [newInstance] = await db.insert(mealInstances).values({
        userId,
        date: new Date().toISOString().split('T')[0], // today
        slot: 'dinner', // default slot
        recipeId: savedRecipe.id,
        source: 'craving',
        status: input.logNow ? 'eaten' : 'planned',
        loggedAt: input.logNow ? sql`now()` : null,
        notes: input.note || null
      }).returning();

      res.json({
        success: true,
        mealInstance: newInstance,
        recipe: savedRecipe
      });
    }
  } catch (error) {
    console.error("Error logging craving meal:", error);
    res.status(500).json({ error: "Failed to log meal" });
  }
});

export default router;