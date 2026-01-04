
import React from 'react';
import { Recipe } from '../types';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">{recipe.title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="flex gap-4 text-sm font-medium">
            <div className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {recipe.cookingTime}
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {recipe.difficulty}
            </div>
          </div>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
              Ingredients
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required</h4>
                <ul className="space-y-1.5">
                  {recipe.ingredientsUsed.map((ing, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 text-sm p-2 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
              {recipe.missingIngredients.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Optional/Pantry</h4>
                  <ul className="space-y-1.5">
                    {recipe.missingIngredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-500 text-sm p-2 bg-slate-50/50 rounded-lg italic">
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
              Cooking Steps
            </h3>
            <div className="space-y-4">
              {recipe.steps.map((step, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm border-2 border-orange-200 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all">
                    {i + 1}
                  </div>
                  <p className="text-slate-600 text-base leading-relaxed pt-1 group-hover:text-slate-900 transition-colors">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all shadow-md active:scale-95"
          >
            I'm Cooking This!
          </button>
        </div>
      </div>
    </div>
  );
};
