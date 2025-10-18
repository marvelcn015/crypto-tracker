import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    message,
    fullScreen = false
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2
                className={`${sizeClasses[size]} animate-spin text-primary-600`}
            />
            {message && (
                <p className="text-gray-600 text-sm">{message}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;