// 🔒 LOCKDOWN PROTECTED: DALL-E image generation system - DO NOT MODIFY
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔒 PROTECTED: Image cache to avoid regenerating the same images
const imageCache = new Map<string, string>();

interface ImageGenerationOptions {
  name: string;
  description?: string;
  type: 'meal' | 'beverage';
  style?: string;
}

// Main function used by stableMealGenerator
export async function generateRecipeImage(recipeName: string): Promise<string | null> {
  return generateImage({
    name: recipeName,
    type: 'meal',
    style: 'appetizing food photography'
  });
}

// 🔒 LOCKDOWN PROTECTED: Main image generation function - DO NOT MODIFY
export async function generateImage(options: ImageGenerationOptions): Promise<string | null> {
  const cacheKey = `${options.type}-${options.name.toLowerCase()}`;
  
  // 🔒 PROTECTED: Check cache first - critical for performance
  if (imageCache.has(cacheKey)) {
    console.log(`📸 Using cached image for: ${options.name}`);
    return imageCache.get(cacheKey)!;
  }

  try {
    console.log(`🎨 Generating image for: ${options.name}`);
    
    // Try Lexica.art first for faster results
    const lexicaUrl = await searchLexicaImage(options.name);
    if (lexicaUrl) {
      imageCache.set(cacheKey, lexicaUrl);
      console.log(`🎨 Found Lexica image for: ${options.name}`);
      return lexicaUrl;
    }

    // Fallback to DALL-E 3 generation if OpenAI key is available
    if (process.env.OPENAI_API_KEY) {
      const dalleUrl = await generateDalleImage(options);
      if (dalleUrl) {
        imageCache.set(cacheKey, dalleUrl);
        console.log(`🤖 Generated DALL-E image for: ${options.name}`);
        return dalleUrl;
      }
    } else {
      console.log(`⚠️ No OpenAI API key available for DALL-E generation`);
    }

    console.log(`⚠️ No image generated for: ${options.name}`);
    return null;
  } catch (error) {
    console.error(`❌ Image generation failed for ${options.name}:`, error);
    return null;
  }
}

async function searchLexicaImage(query: string): Promise<string | null> {
  try {
    const searchQuery = encodeURIComponent(query.toLowerCase());
    const response = await fetch(`https://lexica.art/api/v1/search?q=${searchQuery}`);
    
    if (!response.ok) {
      console.log(`⚠️ Lexica API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (data.images && data.images.length > 0) {
      // Get the first high-quality image
      const bestImage = data.images.find((img: any) => img.width >= 512 && img.height >= 512) || data.images[0];
      return bestImage.src;
    }

    return null;
  } catch (error) {
    console.error('Lexica API error:', error);
    return null;
  }
}

async function generateDalleImage(options: ImageGenerationOptions): Promise<string | null> {
  try {
    const prompt = createImagePrompt(options);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    return response.data?.[0]?.url || null;
  } catch (error) {
    console.error('DALL-E generation error:', error);
    return null;
  }
}

function createImagePrompt(options: ImageGenerationOptions): string {
  const { name, description, type, style } = options;
  
  if (type === 'beverage') {
    return `A professional, appetizing photo of ${name}${description ? `, ${description}` : ''}. Beautiful drink photography, elegant glassware, perfect lighting, restaurant quality presentation. High resolution, food photography style.`;
  }

  // Meal prompt
  const basePrompt = `A professional, appetizing photo of ${name}${description ? `, ${description}` : ''}. Beautiful food photography, elegant plating, perfect lighting, restaurant quality presentation.`;
  
  if (style) {
    return `${basePrompt} ${style} style cooking. High resolution, food photography.`;
  }
  
  return `${basePrompt} High resolution, food photography, appetizing and realistic.`;
}

// API endpoint for image generation
export async function handleImageGeneration(req: any, res: any) {
  try {
    const { name, description, type, style } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const imageUrl = await generateImage({ name, description, type, style });
    
    if (imageUrl) {
      res.json({ imageUrl, cached: imageCache.has(`${type}-${name.toLowerCase()}`) });
    } else {
      res.status(500).json({ error: 'Failed to generate image' });
    }
  } catch (error) {
    console.error('Image generation endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Clear cache periodically to free memory
setInterval(() => {
  if (imageCache.size > 1000) {
    console.log('🧹 Clearing image cache...');
    imageCache.clear();
  }
}, 60 * 60 * 1000); // Clear every hour if cache gets too large