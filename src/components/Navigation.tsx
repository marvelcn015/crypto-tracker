import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Bell, Star } from 'lucide-react';

const Navigation: React.FC = () => {
    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/alerts', icon: Bell, label: 'Alerts' },
        { path: '/favorites', icon: Star, label: 'Favorites' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive
                                ? 'text-primary-600 bg-primary-50'
                                : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-6 h-6 ${isActive ? 'fill-primary-100' : ''}`} />
                                <span className="text-xs mt-1 font-medium">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default Navigation;