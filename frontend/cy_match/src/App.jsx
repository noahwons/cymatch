import { useState, useEffect } from 'react';
import './App.css';
import JobCard from './components/JobCard';
import SwipeableCard from './components/SwipeableCard';
import { fetchJobs, deleteJob, saveJob } from './services/api';

import aliceImg from './assets/alice.jpeg';
import bobImg from './assets/bob.jpeg';
import CardDeck from './components/CardDeck';
import SavedJobs from './components/SavedJobs';
import Profile from './components/Profile';
import TipBanner from './components/TipBanner';
import Login from './components/Login';
import Register from './components/Register';


function App() {

  const [view, setView] = useState('login');
  const [savedJobs, setSavedJobs] = useState([]);
  const [login, setLogin] = useState(false);

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 text-gray-900 h-screen w-screen">
      <header className="p-4 shadow-md bg-white">
        <h1 className="text-2xl font-bold">CyMatch</h1>
      </header>

      {login ? (
        <nav className="space-x-4 mt-4">
          <button
            onClick={() => setView('home')}
            className="bg-gray-600 text-white shadow-md hover:bg-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Home
          </button>

          <button
            onClick={() => setView('saved')}
            className="bg-gray-600 text-white shadow-md hover:bg-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Saved Jobs
          </button>

          <button
            onClick={() => setView('profile')}
            className="bg-gray-600 text-white shadow-md hover:bg-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Profile
          </button>
        </nav>
      ) : null}


      {view === 'home' ? (
        <div className='flex-grow flex items-center justify-center p-4'>
          <TipBanner />
        </div>
      ) : null}



      <main className="flex-grow flex items-center justify-center p-4">
        {view === 'home' ? (
          <CardDeck savedJobs={savedJobs} setSavedJobs={setSavedJobs} />
        ) : view === 'saved' ? (
          <SavedJobs />
        ) : view === 'profile' ? (
          <Profile />
        ) : view === 'login' ? (
          <Login setLogin={setLogin} setView={setView} />
        ) : view === 'register' ? (
          <Register setLogin={setLogin} setView={setView} />
        ) : null}

      </main>
    </div>
  );
}

export default App;
