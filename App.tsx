
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ImagePicker } from './components/ImagePicker';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { AppState, AnalysisResult, ChatMessage, Recipe } from './types';
import { analyzeFridgeImage, askChefQuestion } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    image: null,
    analyzing: false,
    result: null,
    error: null,
    chatHistory: [],
    isAsking: false,
    selectedRecipe: null,
  });

  const [questionInput, setQuestionInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatHistory]);

  const handleImageSelected = useCallback(async (base64: string) => {
    setState(prev => ({ 
      ...prev, 
      image: base64, 
      analyzing: true, 
      result: null, 
      error: null,
      chatHistory: [],
      selectedRecipe: null
    }));

    try {
      const result = await analyzeFridgeImage(base64);
      setState(prev => ({ 
        ...prev, 
        analyzing: false, 
        result 
      }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        analyzing: false, 
        error: err.message || "Something went wrong while analyzing the image. Please try again." 
      }));
    }
  }, []);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim() || !state.result || state.isAsking) return;

    const userMsg: ChatMessage = { role: 'user', content: questionInput };
    const currentQuestion = questionInput;
    setQuestionInput('');
    
    setState(prev => ({ 
      ...prev, 
      isAsking: true,
      chatHistory: [...prev.chatHistory, userMsg]
    }));

    try {
      const answer = await askChefQuestion(currentQuestion, state.result, state.chatHistory);
      const assistantMsg: ChatMessage = { role: 'assistant', content: answer };
      setState(prev => ({ 
        ...prev, 
        isAsking: false,
        chatHistory: [...prev.chatHistory, assistantMsg]
      }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isAsking: false,
        chatHistory: [...prev.chatHistory, { role: 'assistant', content: "Sorry, I'm having trouble thinking right now. Please try again later." }]
      }));
    }
  };

  const openRecipe = (recipe: Recipe) => {
    setState(prev => ({ ...prev, selectedRecipe: recipe }));
  };

  const closeRecipe = () => {
    setState(prev => ({ ...prev, selectedRecipe: null }));
  };

  const reset = useCallback(() => {
    setState({
      image: null,
      analyzing: false,
      result: null,
      error: null,
      chatHistory: [],
      isAsking: false,
      selectedRecipe: null
    });
  }, []);

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {!state.image && (
          <div className="text-center max-w-2xl mx-auto py-12">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              What's for dinner?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Don't know what to cook with the random items in your fridge? Just snap a photo and let our AI chef suggest simple, delicious recipes.
            </p>
            <ImagePicker onImageSelected={handleImageSelected} disabled={state.analyzing} />
          </div>
        )}

        {state.image && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3 flex-shrink-0">
                <div className="sticky top-24 space-y-4">
                  <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-square">
                    <img 
                      src={state.image} 
                      alt="Your ingredients" 
                      className="w-full h-full object-cover"
                    />
                    {state.analyzing && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-white font-medium animate-pulse">Analyzing ingredients...</p>
                        <p className="text-white/70 text-sm mt-2">Thinking of tasty recipes for you.</p>
                      </div>
                    )}
                  </div>
                  {!state.analyzing && (
                    <button 
                      onClick={reset}
                      className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Start Over
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-grow space-y-8 w-full">
                {state.error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-3xl flex items-start gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-bold mb-1">Oops! Something went wrong</h4>
                      <p className="text-sm opacity-90">{state.error}</p>
                      <button 
                        onClick={() => state.image && handleImageSelected(state.image)}
                        className="mt-3 text-sm font-bold underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                )}

                {state.result && (
                  <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-20">
                    <section>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Identified from Image
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {state.result.detectedIngredients.map((ing, i) => (
                          <span 
                            key={i} 
                            className="bg-white text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 shadow-sm hover:border-orange-200 transition-colors"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-6">
                      <div className="flex items-end justify-between">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Chef's Picks
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">Click a recipe to open full details</p>
                      </div>
                      
                      {state.result.suggestedRecipes.map((recipe, i) => (
                        <RecipeCard key={i} recipe={recipe} onClick={() => openRecipe(recipe)} />
                      ))}
                    </section>

                    {/* Chat Section */}
                    <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[400px] md:h-[500px]">
                      <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold">C</div>
                          <div>
                            <h4 className="font-bold text-sm">Ask Chef AI</h4>
                            <p className="text-[10px] opacity-70">Kitchen help, substitutions, and more</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex-grow overflow-y-auto p-6 space-y-4">
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none text-slate-700 text-sm max-w-[80%]">
                          Hi there! Those look like some great ingredients. Any questions about these recipes or need a substitution for something?
                        </div>
                        {state.chatHistory.map((msg, i) => (
                          <div 
                            key={i} 
                            className={`p-4 rounded-2xl text-sm max-w-[80%] ${
                              msg.role === 'user' 
                              ? 'bg-orange-500 text-white ml-auto rounded-tr-none' 
                              : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none'
                            }`}
                          >
                            {msg.content}
                          </div>
                        ))}
                        {state.isAsking && (
                          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center max-w-[40%]">
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      <form onSubmit={handleAskQuestion} className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
                        <input 
                          type="text" 
                          value={questionInput}
                          onChange={(e) => setQuestionInput(e.target.value)}
                          placeholder="Can I use milk instead of cream?"
                          className="flex-grow px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        />
                        <button 
                          type="submit"
                          disabled={state.isAsking || !questionInput.trim()}
                          className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-all shadow-md active:scale-90"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                          </svg>
                        </button>
                      </form>
                    </section>
                  </div>
                )}

                {state.analyzing && !state.result && (
                  <div className="space-y-8">
                    <div className="h-12 w-full bg-slate-100 rounded-full animate-pulse"></div>
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                          <div className="h-8 bg-slate-100 rounded-lg w-1/2 animate-pulse"></div>
                          <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <div className="h-4 bg-slate-100 rounded w-1/4 animate-pulse"></div>
                              <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                              <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse"></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 bg-slate-100 rounded w-1/4 animate-pulse"></div>
                              <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                              <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {state.selectedRecipe && (
        <RecipeModal recipe={state.selectedRecipe} onClose={closeRecipe} />
      )}
    </Layout>
  );
};

export default App;
