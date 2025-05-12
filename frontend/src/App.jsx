import { useState } from 'react';
import './App.css';
import CardDeck from './components/CardDeck';
import SavedJobs from './components/SavedJobs';
import Profile from './components/Profile';
import TipBanner from './components/TipBanner';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/About';

function App() {
  const [view, setView] = useState('login');
  const [savedJobs, setSavedJobs] = useState([]);
  const [login, setLogin] = useState(false);

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 text-gray-900 h-screen w-screen">
      <header className="p-4 shadow-md bg-white">
        <h1 className="text-2xl font-bold">CyMatch</h1>
      </header>

      {login && (
        <nav className="space-x-4 mt-4 px-4">
          <button
            onClick={() => setView('home')}
            className="bg-gray-200 text-black shadow-md hover:bg-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Home
          </button>
          <button
            onClick={() => setView('saved')}
            className="bg-gray-200 text-black shadow-md hover:bg-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Saved Jobs
          </button>
          <button
            onClick={() => setView('profile')}
            className="bg-gray-200 text-black shadow-md hover:bg-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Profile
          </button>
          <button
            onClick={() => setView('about')}
            className="bg-gray-200 text-black shadow-md hover:bg-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            About
          </button>
        </nav>
      )}

      {view === 'home' && (
        <div className="flex-grow flex items-center justify-center p-4">
          <TipBanner />
        </div>
      )}

      <main className="flex-grow flex items-center justify-center p-4">
        {view === 'home' ? (
          <CardDeck savedJobs={savedJobs} setSavedJobs={setSavedJobs} />
        ) : view === 'saved' ? (
          <SavedJobs />
        ) : view === 'profile' ? (
          <Profile />
        ) : view === 'about' ? (
          <About />
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
