import { LogOut } from 'lucide-react';

const LogoutButton = () => {
    const handleLogout = () => {
        sessionStorage.clear()
        window.location.href = '/login'; // Redirige al login
    };

    return (
        <button
            onClick={handleLogout}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out"
        >
            <LogOut size={20} /> 
        </button>
    );
};



export default LogoutButton;