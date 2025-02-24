export interface Ingredient {
  name: string;
  quantity?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  cookingTime: string;
  servings: number;
  imageUrl: string;
}