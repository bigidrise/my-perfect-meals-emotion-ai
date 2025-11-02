// server/services/mealImageGenerator.ts
// DALL-E 3 meal image generation with caching per template

import OpenAI from 'openai';
import crypto from 'crypto';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface MealImageRequest {
  mealName: string;
  ingredients: string[];
  style?: 'overhead' | 'plated' | 'rustic' | 'restaurant';
  templateRef?: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  templateRef?: string;
  hash: string;
  createdAt: string;
}

// In-memory cache for generated images (replace with database/Redis in production)
const imageCache = new Map<string, GeneratedImage>();

// Generate stable hash for caching
function generateImageHash(request: MealImageRequest): string {
  const key = `${request.mealName}-${request.ingredients.join(',')}-${request.style || 'overhead'}`;
  return crypto.createHash('md5').update(key).digest('hex');
}

// Create deterministic prompts for consistent styling
function createImagePrompt(request: MealImageRequest): string {
  const { mealName, ingredients, style = 'overhead' } = request;
  
  const baseStyle = {
    overhead: "overhead 3/4 view on clean white plate, neutral matte background, soft natural lighting",
    plated: "beautifully plated on elegant dish, restaurant presentation, soft natural lighting", 
    rustic: "rustic home-style presentation on wooden table, warm natural lighting",
    restaurant: "professional restaurant plating, garnished, clean presentation"
  }[style];
  
  const ingredientList = ingredients.slice(0, 4).join(', '); // Limit to avoid prompt bloat
  
  return `${mealName} featuring ${ingredientList}, ${baseStyle}, food photography, realistic, appetizing, no text, no logos, high quality, detailed`;
}

// Generate meal image using DALL-E 3
export async function generateMealImage(request: MealImageRequest): Promise<GeneratedImage> {
  const hash = generateImageHash(request);
  
  // Check cache first
  const cached = imageCache.get(hash);
  if (cached) {
    console.log(`🎨 Using cached image for ${request.mealName}`);
    return cached;
  }
  
  const prompt = createImagePrompt(request);
  console.log(`🎨 Generating image for: ${request.mealName}`);
  console.log(`📝 Prompt: ${prompt}`);
  
  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });
    
    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }
    
    const result: GeneratedImage = {
      url: imageUrl,
      prompt,
      templateRef: request.templateRef,
      hash,
      createdAt: new Date().toISOString()
    };
    
    // Cache the result
    imageCache.set(hash, result);
    console.log(`✅ Generated and cached image for ${request.mealName}`);
    
    return result;
    
  } catch (error: any) {
    console.error(`❌ Failed to generate image for ${request.mealName}:`, error.message);
    
    // Return fallback image info instead of throwing
    const fallback: GeneratedImage = {
      url: `/assets/meals/default-${request.mealName.toLowerCase().includes('breakfast') ? 'breakfast' : 
             request.mealName.toLowerCase().includes('lunch') ? 'lunch' : 'dinner'}.svg`,
      prompt: `Fallback for: ${prompt}`,
      templateRef: request.templateRef,
      hash,
      createdAt: new Date().toISOString()
    };
    
    imageCache.set(hash, fallback);
    return fallback;
  }
}

// Batch generate images for multiple meals
export async function generateMealImages(requests: MealImageRequest[]): Promise<GeneratedImage[]> {
  const results: GeneratedImage[] = [];
  
  // Process in small batches to avoid rate limits
  const batchSize = 3;
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    
    const batchPromises = batch.map(request => 
      generateMealImage(request).catch(error => {
        console.error(`Batch error for ${request.mealName}:`, error);
        return {
          url: `/assets/meals/default-dinner.svg`,
          prompt: `Error: ${error.message}`,
          hash: generateImageHash(request),
          createdAt: new Date().toISOString()
        };
      })
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches
    if (i + batchSize < requests.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

// Get cached image if available
export function getCachedImage(request: MealImageRequest): GeneratedImage | null {
  const hash = generateImageHash(request);
  return imageCache.get(hash) || null;
}

// Clear cache (for development/testing)
export function clearImageCache(): void {
  imageCache.clear();
  console.log('🗑️ Image cache cleared');
}

// Get cache statistics
export function getImageCacheStats(): { size: number; entries: string[] } {
  return {
    size: imageCache.size,
    entries: Array.from(imageCache.keys())
  };
}