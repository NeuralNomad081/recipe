import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Ingredient } from '../types';

interface Props {
  onIngredientsSubmit: (ingredients: Ingredient[]) => void;
}

export function IngredientInput({ onIngredientsSubmit }: Props) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '' }]);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index].name = value;
    setIngredients(newIngredients);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validIngredients = ingredients.filter(ing => ing.name.trim() !== '');
    if (validIngredients.length === 0) return;
    onIngredientsSubmit(validIngredients);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => updateIngredient(index, e.target.value)}
              placeholder="Enter an ingredient (e.g., chicken, tomatoes, pasta)"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                aria-label="Remove ingredient"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={addIngredient}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200"
        >
          <Plus size={20} />
          Add Another Ingredient
        </button>
        
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
        >
          Generate Recipe
        </button>
      </div>
    </form>
  );
}