
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer group"
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-orange-600 transition-colors">{recipe.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {recipe.cookingTime}
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {recipe.difficulty}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center text-orange-500 font-bold text-sm gap-1 group-hover:translate-x-1 transition-transform">
            View Recipe
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pointer-events-none">
          <div>
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs uppercase">Ingredients</span>
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Used from fridge</p>
                <ul className="grid grid-cols-1 gap-1">
                  {recipe.ingredientsUsed.slice(0, 3).map((ing, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600 text-sm line-clamp-1">
                      <span className="text-orange-500 mt-1">•</span> {ing}
                    </li>
                  ))}
                  {recipe.ingredientsUsed.length > 3 && (
                    <li className="text-slate-400 text-xs italic ml-3">+{recipe.ingredientsUsed.length - 3} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs uppercase">Preview</span>
            </h4>
            <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
              {recipe.steps[0]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
