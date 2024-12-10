import React, { useState } from 'react';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import SurveyApp from '../SurveyApp';

const Login: React.FC = () => {
    const { isAuthenticated, role } = useAuth();
    const token = localStorage.getItem('token');

    if (isAuthenticated && token)
        return <Navigate to={`/${role}/dashboard`} replace state={{ from: window.location.pathname }} />;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://${SurveyApp.API_HOST}:${SurveyApp.API_PORT}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                setError(errorMessage);
                return;
            }

            const { token, role } = await response.json();
            localStorage.setItem('token', token);
            login(role);

            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else if (role === 'user') {
                navigate('/user/dashboard');
            }
        } catch (error) {
            setError('Failed to connect to the server');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 relative">
            <div className="absolute top-0 left-0 p-4">
                <NavLink
                    to="/"
                    className={`text-[1.5rem] font-semibold bg-blue-500 hover:bg-lime-600 
            pl-4 pr-4 pt-1 pb-2 hover:text-slate-100
            text-white rounded-md transform ease-linear duration-400
            `}>
                    back
                </NavLink>
            </div>
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-lime-600"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
