import React from 'react';

export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="text-center p-8 rounded-xl shadow-lg bg-white">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Frontend Initialized</h1>
        <p className="text-gray-600 mb-6 max-w-md">
          Your Vite + React + TailwindCSS + shadcn setup is ready. Start building your beautiful dashboard!
        </p>
        <a
          href="https://ui.shadcn.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Explore shadcn/ui Docs
        </a>
      </div>
    </div>
  );
}
