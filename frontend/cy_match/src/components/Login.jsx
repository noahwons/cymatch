import React from 'react'

const Login = ({ setLogin, setView }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Login</h2>

            {/* space-y-4 adds 1rem gap between each child */}
            <div className="space-y-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="w-full border p-2 rounded-md"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded-md"
                    required
                />

                <button
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-xl"
                    onClick={() => {
                        setLogin(true)
                        setView('home')
                    }}
                >
                    Login
                </button>
            </div>
        </div>
    )
}

export default Login
