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
    onIngredientsSubmit(validIngredients);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="space-y-4">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => updateIngredient(index, e.target.value)}
              placeholder="Enter an ingredient"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex gap-4">
        <button
          type="button"
          onClick={addIngredient}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
        >
          <Plus size={20} />
          Add Ingredient
        </button>
        
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Predict Recipes
        </button>
      </div>
    </form>
  );
}