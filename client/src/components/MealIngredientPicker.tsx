import { useState } from 'react';
import { Sparkles, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface MealIngredientPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMealGenerated: (meal: any) => void;
  mealSlot: string;
}

const INGREDIENTS = {
  proteins: [
    'Chicken Breast', 'Eggs', 'Salmon', 'Steak', 'Tofu', 
    'Protein Shake', 'Greek Yogurt', 'Cottage Cheese', 'Turkey', 
    'Tuna', 'Shrimp', 'Ground Beef', 'Pork Chop', 'Tilapia',
    'Cod', 'Tempeh', 'Chicken Thigh', 'Lamb', 'Bison', 'Duck'
  ],
  starchyCarbs: [
    'Oats', 'Rice', 'Potatoes', 'Pasta', 'Quinoa', 
    'Sweet Potato', 'Bread', 'Tortillas', 'Bagel', 
    'English Muffin', 'Pancakes', 'Waffles', 'Couscous',
    'Barley', 'Farro', 'Rice Cakes', 'Cornbread', 'Polenta',
    'Noodles', 'Pita Bread'
  ],
  fibrousCarbs: [
    'Broccoli', 'Spinach', 'Peppers', 'Green Beans', 'Asparagus', 
    'Zucchini', 'Cauliflower', 'Brussels Sprouts', 'Kale', 
    'Carrots', 'Tomatoes', 'Mushrooms', 'Onions', 'Celery',
    'Cucumber', 'Lettuce', 'Cabbage', 'Eggplant', 'Squash',
    'Bok Choy'
  ],
  fats: [
    'Peanut Butter', 'Almond Butter', 'Cashew Butter', 'Almonds', 
    'Walnuts', 'Cashews', 'Pecans', 'Macadamia Nuts', 'Pistachios', 
    'Pumpkin Seeds', 'Sunflower Seeds', 'Chia Seeds', 'Flax Seeds', 
    'Avocado', 'Olive Oil', 'Coconut Oil', 'Butter', 'Cheese', 
    'Heavy Cream', 'MCT Oil'
  ]
};

export default function MealIngredientPicker({ 
  open, 
  onOpenChange, 
  onMealGenerated,
  mealSlot 
}: MealIngredientPickerProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<'proteins' | 'starchyCarbs' | 'fibrousCarbs' | 'fats'>('proteins');
  const [customIngredients, setCustomIngredients] = useState('');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const hasProtein = selectedIngredients.some(ing => 
    INGREDIENTS.proteins.includes(ing)
  );

  const handleGenerateMeal = async () => {
    if (!hasProtein) {
      toast({
        title: "Protein Required",
        description: "Please select at least one protein source",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);

    try {
      const allIngredients = [...selectedIngredients];
      
      if (customIngredients.trim()) {
        allIngredients.push(...customIngredients.split(',').map(i => i.trim()).filter(Boolean));
      }

      const data = await apiRequest('/api/meals/fridge-rescue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fridgeItems: allIngredients,
          userId: 1
        })
      });
      console.log('🍳 AI Meal Creator received data:', data);

      const generatedMeal = data.meals?.[0];
      
      if (!generatedMeal) {
        throw new Error('No meal generated');
      }

      console.log('✅ Generated meal:', generatedMeal.name);

      const mealWithImage = {
        ...generatedMeal,
        imageUrl: generatedMeal.imageUrl || '/assets/meals/default-breakfast.jpg'
      };

      onMealGenerated(mealWithImage);
      
      setSelectedIngredients([]);
      setCustomIngredients('');
      setActiveCategory('proteins');
      onOpenChange(false);

      toast({
        title: "Meal Generated!",
        description: `${generatedMeal.name} is ready to add`,
      });

    } catch (error) {
      console.error('Failed to generate meal:', error);
      toast({
        title: "Generation Failed",
        description: "Please try again with different ingredients",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'proteins': return '🥩 Proteins';
      case 'starchyCarbs': return '🍞 Starchy Carbs';
      case 'fibrousCarbs': return '🥦 Fibrous Carbs';
      case 'fats': return '🥑 Fats';
      default: return category;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] sm:h-auto sm:max-h-[80vh] bg-gradient-to-b from-[#0f0f0f] via-[#1a1a1a] to-[#2b2b2b] border border-white/10 p-4 flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-white flex items-center gap-2 text-xl">
            <ChefHat className="w-6 h-6 text-purple-400" />
            AI Meal Creator - Pick Your Ingredients
          </DialogTitle>
        </DialogHeader>

        {/* Category Tabs - Fixed */}
        <div className="flex gap-1 mb-3 flex-shrink-0">
          {(['proteins', 'starchyCarbs', 'fibrousCarbs', 'fats'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeCategory === category
                  ? 'bg-purple-600/40 border-2 border-purple-400 text-white'
                  : 'bg-black/40 border border-white/20 text-white/70 hover:bg-white/10'
              }`}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto mb-3 min-h-0">
          {/* Ingredient Grid - Small Checkboxes */}
          <div className="mb-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-1">
              {INGREDIENTS[activeCategory].map((ingredient) => (
                <label
                  key={ingredient}
                  className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white cursor-pointer group p-1 min-h-[44px]"
                >
                  <Checkbox
                    checked={selectedIngredients.includes(ingredient)}
                    onCheckedChange={() => toggleIngredient(ingredient)}
                    className="h-1.5 w-1.5 border-white/30 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-500"
                  />
                  <span className="text-[11px] group-hover:text-emerald-300 transition-colors text-center">
                    {ingredient}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Ingredients Input */}
          <div className="mb-3 pb-3 border-b border-white/10">
            <label className="text-white text-xs font-semibold mb-1.5 block">
              Add Custom Ingredients
            </label>
            <Input
              value={customIngredients}
              onChange={(e) => setCustomIngredients(e.target.value)}
              placeholder="e.g., turkey bacon, almond milk, cauliflower rice"
              className="bg-black/40 border-white/20 text-white placeholder:text-white/40 text-xs h-8"
              data-testid="input-custom-ingredients"
            />
            <p className="text-white/40 text-[10px] mt-1">
              Separate multiple ingredients with commas
            </p>
          </div>

          {/* Selected Ingredients Count */}
          {selectedIngredients.length > 0 && (
            <div className="mb-3 p-2 bg-emerald-600/10 border border-emerald-500/30 rounded-lg">
              <p className="text-emerald-300 text-xs">
                ✓ {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* Requirement Notice */}
          {!hasProtein && selectedIngredients.length > 0 && (
            <div className="mb-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300 text-xs">
                ⚠️ Please select at least one protein source to generate your meal
              </p>
            </div>
          )}
        </div>

        {/* Fixed Bottom Section */}
        <div className="flex-shrink-0 space-y-3">
          {/* Generate Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerateMeal}
              disabled={!hasProtein || generating}
              className={`flex-1 min-h-[48px] text-base font-semibold transition-all ${
                !hasProtein || generating
                  ? 'bg-gray-600/40 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30'
              }`}
              data-testid="button-generate-meal"
            >
              {generating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Generating Your Meal...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate My Meal
                </>
              )}
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="bg-black/40 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>

          {/* Progress Bar */}
          {generating && (
            <div>
              <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse" style={{ width: '100%' }} />
              </div>
              <p className="text-white/60 text-xs text-center mt-2">
                AI is crafting your perfect {mealSlot}...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
