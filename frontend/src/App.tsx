import{ useState } from 'react';
import { ChefHat } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { IngredientInput } from './components/IngredientInput';
import { RecipeCard } from './components/RecipeCard';
import type { Ingredient, Recipe } from './types';

const extractJSONFromResponse = (text: string): object => {
  // Remove AI thinking process and markdown
  const cleanText = text
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .replace(/```json\n?|\n?```/g, '')
    .trim();

  try {
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('JSON Parse Error:', error);
    console.log('Raw text:', cleanText);
    throw new Error('Invalid recipe format received');
  }
};

const validateRecipe = (data: Record<string, unknown>): Recipe => {
  const requiredFields = ['id', 'name', 'ingredients', 'instructions', 'cookingTime', 'servings', 'imageUrl'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Invalid recipe format. Missing fields: ${missingFields.join(', ')}`);
  }

  return data as unknown as Recipe;
};

const predictRecipes = async (ingredients: Ingredient[]): Promise<Recipe[]> => {
  try {
    const ingredientsList = ingredients.map(ing => ing.name).join(', ');
    const message = `Generate a recipe using these ingredients: ${ingredientsList}. Return a JSON object with this exact structure: { "id": "string", "name": "string", "ingredients": [{"name": "string", "quantity": "string"}], "instructions": ["string"], "cookingTime": "string", "servings": number, "imageUrl": "string" }`;
    
    const response = await axios.post('http://localhost:3000/generate', {
      message
    });

    const jsonData = extractJSONFromResponse(response.data.response);
    const recipe = validateRecipe(jsonData as Record<string, unknown>);
    
    return [recipe];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('API Error:', axiosError.response?.data);
      const errorMessage: string = axiosError.response?.data && typeof axiosError.response.data === 'object' && 'error' in axiosError.response.data
        ? axiosError.response.data.error as string
        : 'Failed to communicate with recipe service';
      throw new Error(errorMessage);
    }
    throw error;
  }
};

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIngredientsSubmit = async (ingredients: Ingredient[]) => {
    if (!ingredients.length) {
      setError('Please add at least one ingredient');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const predictedRecipes = await predictRecipes(ingredients);
      setRecipes(predictedRecipes);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate recipe';
      console.error('Recipe generation error:', error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Recipe Predictor</h1>
          </div>
          <p className="text-lg text-gray-600">
            Enter your ingredients and let AI suggest delicious recipes for you
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <IngredientInput onIngredientsSubmit={handleIngredientsSubmit} />
        </div>

        {error && (
          <div className="text-center text-red-600 mb-8 p-4 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Generating your recipe...</p>
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

        {!loading && recipes.length === 0 && !error && (
          <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-sm">
            Enter ingredients above to get recipe predictions
          </div>
        )}
      </div>
    </div>
  );
}

export default App;