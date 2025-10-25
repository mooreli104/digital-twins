// Debug version to test basic rendering
import React from 'react';

function App() {
  console.log('App component rendering...');
  console.log('Environment check:', {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          FarmTwin Debug
        </h1>
        <p className="text-gray-600">
          If you see this, React is working!
        </p>
        <div className="mt-4 text-sm text-gray-500">
          Supabase URL: {import.meta.env.VITE_SUPABASE_URL || 'NOT SET'}
        </div>
      </div>
    </div>
  );
}

export default App;
