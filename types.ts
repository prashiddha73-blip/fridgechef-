
export interface Recipe {
  title: string;
  ingredientsUsed: string[];
  missingIngredients: string[];
  steps: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookingTime: string;
}

export interface AnalysisResult {
  detectedIngredients: string[];
  suggestedRecipes: Recipe[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AppState {
  image: string | null;
  analyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
  chatHistory: ChatMessage[];
  isAsking: boolean;
  selectedRecipe: Recipe | null;
}
