import  { useState } from 'react';
import { ChefHat, Sparkles } from 'lucide-react';
import axios from 'axios';
import { IngredientInput } from './components/IngredientInput';
import { RecipeCard } from './components/RecipeCard';
import type { Ingredient, Recipe } from './types';

const API_URL = import.meta.env.VITE_API_URL;

const predictRecipes = async (ingredients: Ingredient[]): Promise<Recipe[]> => {
  try {
    const ingredientsList = ingredients.map(ing => ing.name).join(', ');
    const message = `Generate a recipe using these ingredients: ${ingredientsList}. Return a JSON object with this exact structure: { "id": "string", "name": "string", "ingredients": [{"name": "string", "quantity": "string"}], "instructions": ["string"], "cookingTime": "string", "servings": number, "imageUrl": "string" }`;
    
    //debug
    console.log("Sending request to:", `${API_URL}/generate`);
    const response = await axios.post(`${API_URL}/generate`, {
      message
    });
    console.log("Response received:", response.data);
    if (response.data.error){
      throw new Error(response.data.error);
    }

    let recipe;
    try {
      recipe = JSON.parse(response.data.response);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      // If there's a raw_response field, try to use that directly
      if (response.data.raw_response) {
        // Try to handle it as a raw string that might be valid JSON
        try {
          // Replace common invalid escape sequences
          const cleanedJson = response.data.raw_response.replace(/\\_/g, '_');
          recipe = JSON.parse(cleanedJson);
        } catch (secondError) {
          console.error("Second parse error:", secondError);
          throw new Error("Failed to parse recipe data");
        }
      } else {
        throw new Error("Invalid response format");
      }
    }
    return [recipe];
}catch(error){
  console.log("Error predicting recipes:", error);
  throw error;
}
};

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIngredientsSubmit = async (ingredients: Ingredient[]) => {
    setLoading(true);
    setError(null);
    try {
      const predictedRecipes = await predictRecipes(ingredients);
      setRecipes(predictedRecipes);
    } catch (error) {
      console.error('Failed to predict recipes:', error);
      setError('Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-block p-3 rounded-full bg-blue-100 mb-6">
            <ChefHat size={48} className="text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Recipe Predictor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your available ingredients into delicious recipes with the power of AI
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-yellow-500" size={24} />
            <h2 className="text-2xl font-semibold text-gray-800">
              What's in your kitchen?
            </h2>
          </div>
          <IngredientInput onIngredientsSubmit={handleIngredientsSubmit} />
        </div>

        {error && (
          <div className="max-w-2xl mx-auto text-center p-4 bg-red-50 rounded-lg border border-red-200 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Crafting your perfect recipe...</p>
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

        {!loading && recipes.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              Add your ingredients above and let's create something delicious!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;