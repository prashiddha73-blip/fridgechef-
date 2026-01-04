
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800">FridgeChef <span className="text-orange-500">AI</span></h1>
          </div>
          <div className="hidden sm:block text-slate-500 text-sm italic">
            "Turning your fridge into a feast"
          </div>
        </div>
      </header>
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} FridgeChef AI • Powered by Gemini
        </div>
      </footer>
    </div>
  );
};
