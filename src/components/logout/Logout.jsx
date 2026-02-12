import React from 'react';
import { useNavigate } from 'react-router-dom';


const LogoutButton = () => {
    const navigate = useNavigate();
    const API_BASE_URL = "https://mern-practice-backend-w82d.vercel.app";
    const handleLogout = async () => {
        try {
            // 1. Inform backend about logout
            const token = localStorage.getItem('token');
            await fetch(`${API_BASE_URL}/api/admins/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                credentials: 'include',
            });

            // 2. Clear localStorage items related to auth
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // 3. Redirect user to login
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout API fails, still clear local state and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-green-700 text-white px-4 py-2 rounded absolute right-10 top-1 hover:bg-green-800 transition-colors"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
