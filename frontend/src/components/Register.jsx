import React from 'react'
import { useState, useEffect } from 'react';


const Register = ({ setLogin, setView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        if (password !== confirm) {
            setError("Passwords don't match");
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || res.statusText);
            }

            setLogin(false);
            setView('login');

        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-xl p-6 mb-6 max-w-md mx-auto space-y-4"
        >
            <h2 className="text-xl font-bold mb-4">Register</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
            <input
                type="password"
                name="confirm"
                placeholder="Confirm Password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full border p-2 rounded-md"
                required
            />
            <button
                type="submit"
                className="w-full px-4 py-2 bg-green-500 text-white rounded-xl"
            >
                Create Account
            </button>
            <p className="text-center text-sm">
                Already have an account?{' '}
                <button
                    type="button"
                    className="text-blue-500 underline"
                    onClick={() => setView('login')}
                >
                    Log in
                </button>
            </p>
        </form>
    );
};

export default Register