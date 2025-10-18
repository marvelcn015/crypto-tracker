import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    placeholder = 'Search cryptocurrencies...'
}) => {
    const handleClear = () => {
        onChange('');
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
            </div>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />

            {value && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-gray-100 rounded-r-lg transition-colors"
                    aria-label="Clear search"
                >
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
            )}
        </div>
    );
};

export default SearchBar;