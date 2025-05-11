import { useState, useEffect } from 'react';

const Login = ({ setLogin, setView }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: username, password })
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || res.statusText);
            }

            const { token } = await res.json();
            localStorage.setItem('jwt', token);        // persist your JWT
            setLogin(true);                             // flip “logged in”
            setView('home');                            // go to home screen
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-xl p-6 mb-6 max-w-md mx-auto space-y-4"
        >
            <h2 className="text-xl font-bold mb-4">Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="text"
                name="username"
                placeholder="Email"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full border p-2 rounded-md"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border p-2 rounded-md"
                required
            />
            <div className="flex justify-between">
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-xl"
                >
                    Login
                </button>
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl"
                    onClick={() => setView('register')}
                >
                    Register
                </button>
            </div>
        </form>
    );
};

export default Login
