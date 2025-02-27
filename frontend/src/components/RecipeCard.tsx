import { Clock, Users, ChefHat } from 'lucide-react';
import type { Recipe } from '../types';

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
      <div className="relative">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white">
          {recipe.name}
        </h3>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-6 text-gray-600 mb-6 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-blue-500" />
            <span>{recipe.cookingTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={20} className="text-blue-500" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="flex items-center gap-2 text-lg font-semibold mb-3 text-gray-800">
            <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <ChefHat size={18} className="text-blue-600" />
            </span>
            Ingredients
          </h4>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                <span className="font-medium">{ingredient.quantity}</span>
                <span className="ml-2">{ingredient.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Instructions</h4>
          <ol className="space-y-4">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex gap-4 text-gray-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <p className="leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}