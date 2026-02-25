import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-8 rounded-full mb-8 animate-bounce">
                <Ghost size={80} className="text-gray-400" />
            </div>
            <h1 className="text-6xl font-black text-gray-800 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-600 mb-8">Oops! Page not found.</h2>
            <p className="text-gray-500 max-w-md mb-12">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                to="/"
                className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 transition shadow-lg shadow-orange-100"
            >
                <Home size={20} />
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
