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
    <div className="flex flex-col bg-gray-50 text-gray-900 min-h-screen w-full">
      <header className="p-4 shadow-md bg-white flex justify-center">
        <h1 className="text-5xl font-bold">CyMatch</h1>
      </header>

      {login ? (
        <nav className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => setView('home')}
            className="bg-gray-900 text-white shadow-md hover:bg-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Home
          </button>

          <button
            onClick={() => setView('saved')}
            className="bg-gray-900 text-white shadow-md hover:bg-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Saved Jobs
          </button>

          <button
            onClick={() => setView('profile')}
            className="bg-gray-900 text-white shadow-md hover:bg-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Profile
          </button>

          <button
            onClick={() => setView('about')}
            className="bg-gray-900 text-white shadow-md hover:bg-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            About
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
        ) : view === 'about' ? (
          <About />
        ) : null}

      </main>
    </div>
  );
}

export default App;
