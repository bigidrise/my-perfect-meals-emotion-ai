import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MealCardButtons from '@/components/meal-calendar/MealCardButtons';

interface MealCardProps {
  meal: {
    id: string;
    title: string;
    description?: string;
    calories?: number;
    protein?: number;
    status?: string;
    slot?: string;
  };
}

export default function MealCard({ meal }: MealCardProps) {
  return (
    <Card className="p-4 rounded-2xl shadow space-y-3 bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{meal.title}</CardTitle>
        {meal.description && (
          <p className="text-sm text-gray-600">{meal.description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {(meal.calories || meal.protein) && (
          <div className="flex gap-4 text-sm text-gray-700 mb-3">
            {meal.calories && <span>Calories: {meal.calories}</span>}
            {meal.protein && <span>Protein: {meal.protein}g</span>}
          </div>
        )}
        <MealCardButtons mealInstanceId={meal.id} />
      </CardContent>
    </Card>
  );
}