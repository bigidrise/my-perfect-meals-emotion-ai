// client/src/components/WeeklyMealCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, RefreshCw } from "lucide-react";
import { useState } from "react";
import MedicalBadges from "./MedicalBadges";
import { getUserMedicalProfile } from "@/utils/medicalPersonalization";

interface WeeklyMealCardProps {
  dateISO: string;
  slot: "breakfast" | "lunch" | "dinner" | "snack";
  meal: any;
  time?: string;
  onRegenerate?: (slot: string, mealType: string) => Promise<void>;
}

export default function WeeklyMealCard({ dateISO, slot, meal, time, onRegenerate }: WeeklyMealCardProps) {
  const [regenerating, setRegenerating] = useState(false);
  
  const title = meal?.name || "Meal";
  const imageUrl = meal?.imageUrl;
  const ingredients = meal?.ingredients || [];
  const nutrition = meal?.nutrition || meal;

  const handleRegenerate = async () => {
    if (!onRegenerate) return;
    setRegenerating(true);
    try {
      await onRegenerate(slot, meal?.mealType || slot);
    } catch (error) {
      console.error("Failed to regenerate meal:", error);
    }
    setRegenerating(false);
  };

  return (
    <Card className="border shadow-xl bg-white">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-600" />
            <div className="font-semibold capitalize text-blue-800">{slot}</div>
          </div>
          {time && <div className="text-xs text-gray-500">⏰ {time}</div>}
        </div>

        {/* Meal Title */}
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        
        {/* Description */}
        {meal?.description && (
          <p className="text-gray-600 text-sm">{meal.description}</p>
        )}

        {/* Meal Image */}
        {imageUrl && (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                console.log("Image load error:", e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Serving Size */}
        <div className="p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Users className="h-4 w-4" />
            <span className="font-medium">Serving Size:</span> {meal?.servingSize || '1 serving'}
          </div>
        </div>

        {/* Nutrition Facts */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-orange-100 p-2 rounded-md">
            <div className="text-sm font-bold text-orange-600">{nutrition?.calories || 'N/A'}</div>
            <div className="text-xs text-gray-500">Calories</div>
          </div>
          <div className="bg-blue-100 p-2 rounded-md">
            <div className="text-sm font-bold text-blue-600">{nutrition?.protein || 'N/A'}g</div>
            <div className="text-xs text-gray-500">Protein</div>
          </div>
          <div className="bg-green-100 p-2 rounded-md">
            <div className="text-sm font-bold text-green-600">{nutrition?.carbs || 'N/A'}g</div>
            <div className="text-xs text-gray-500">Carbs</div>
          </div>
          <div className="bg-purple-100 p-2 rounded-md">
            <div className="text-sm font-bold text-purple-600">{nutrition?.fat || 'N/A'}g</div>
            <div className="text-xs text-gray-500">Fat</div>
          </div>
        </div>

        {/* Medical Badges */}
        {(() => {
          const userProfile = getUserMedicalProfile(1);
          const mealForBadges = {
            id: meal?.id || `${slot}-${dateISO}`,
            name: title,
            calories: nutrition?.calories,
            protein: nutrition?.protein,
            carbs: nutrition?.carbs,
            fat: nutrition?.fat,
            fiber: 0,
            sugar: 0,
            sodium: 0,
            ingredients: ingredients?.map((ing: any) => ({ 
              name: ing.name, 
              amount: parseFloat(ing.amount) || 1, 
              unit: ing.unit || 'serving' 
            })) || []
          };
          const medicalBadges = []; // Skip medical badges for now
          return medicalBadges && medicalBadges.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold mb-2 text-sm">Medical Safety</h4>
              <MedicalBadges badges={medicalBadges} />
            </div>
          );
        })()}

        {/* Ingredients */}
        {ingredients && ingredients.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Ingredients:</h4>
            <ul className="text-xs text-gray-600 space-y-1 max-h-24 overflow-y-auto">
              {ingredients.slice(0, 5).map((ingredient: any, i: number) => (
                <li key={i}>
                  {ingredient.displayText || 
                   (ingredient.amount && ingredient.unit ? 
                    `${ingredient.amount} ${ingredient.unit} ${ingredient.name}` : 
                    ingredient.name)
                  }
                </li>
              ))}
              {ingredients.length > 5 && (
                <li className="text-gray-400">+ {ingredients.length - 5} more...</li>
              )}
            </ul>
          </div>
        )}

        {/* Regenerate Button */}
        {onRegenerate && (
          <Button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
            size="sm"
          >
            <RefreshCw className={`h-3 w-3 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
            {regenerating ? 'Regenerating...' : 'Regenerate Meal'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}