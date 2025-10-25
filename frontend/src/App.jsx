// Main Application Component
import React from 'react';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* TODO: Add routing if needed (login, settings, etc.) */}
      <Dashboard />
    </div>
  );
}

export default App;
