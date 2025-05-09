import { useState, useEffect } from 'react';
import './App.css';
import JobCard from './components/JobCard';
import SwipeableCard from './components/SwipeableCard';
import { fetchJobs, deleteJob, saveJob } from './services/api';

import aliceImg from './assets/alice.jpeg';
import bobImg from './assets/bob.jpeg';
import CardDeck from './components/CardDeck';

function App() {
  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 text-gray-900">
      <header className="p-4 shadow-md bg-white">
        <h1 className="text-2xl font-bold">CyMatch</h1>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <CardDeck />
      </main>
    </div>
  );
}

export default App;
