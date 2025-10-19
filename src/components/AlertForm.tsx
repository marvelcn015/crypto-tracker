import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import api from '../services/api';
import type { CreateAlertRequest, AlertCondition } from '../types';
import { validatePrice } from '../utils/formatters';

interface AlertFormProps {
    onSuccess?: () => void;
}

const AlertForm: React.FC<AlertFormProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState<CreateAlertRequest>({
        crypto_id: '',
        target_price: 0,
        condition: 'above' as AlertCondition,
        note: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 驗證
        if (!formData.crypto_id) {
            setError('Please enter a cryptocurrency ID');
            return;
        }

        if (!validatePrice(formData.target_price.toString())) {
            setError('Target price must be greater than 0');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await api.createAlert(formData);

            setSuccess(true);
            setFormData({
                crypto_id: '',
                target_price: 0,
                condition: 'above',
                note: '',
            });

            setTimeout(() => setSuccess(false), 3000);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('Cryptocurrency not found. Please check the ID.');
            } else {
                setError(err.response?.data?.detail || 'Failed to create alert');
            }
            console.error('Error creating alert:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Create Price Alert</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Crypto ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cryptocurrency ID
                    </label>
                    <input
                        type="text"
                        value={formData.crypto_id}
                        onChange={(e) => setFormData({ ...formData, crypto_id: e.target.value.toLowerCase() })}
                        placeholder="e.g., bitcoin, ethereum, cardano"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Use lowercase IDs from CoinGecko (e.g., bitcoin, ethereum)
                    </p>
                </div>

                {/* Target Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Price (USD)
                    </label>
                    <input
                        type="number"
                        value={formData.target_price || ''}
                        onChange={(e) => setFormData({ ...formData, target_price: parseFloat(e.target.value) || 0 })}
                        placeholder="50000"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        required
                    />
                </div>

                {/* Condition */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alert Condition
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, condition: 'above' })}
                            className={`px-4 py-3 rounded-lg border-2 transition-all ${formData.condition === 'above'
                                ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            Above Target
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, condition: 'below' })}
                            className={`px-4 py-3 rounded-lg border-2 transition-all ${formData.condition === 'below'
                                ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            Below Target
                        </button>
                    </div>
                </div>

                {/* Note */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note (Optional)
                    </label>
                    <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        placeholder="Add a note..."
                        rows={3}
                        maxLength={200}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        {formData.note?.length || 0}/200 characters
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-700">Alert created successfully!</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating...' : 'Create Alert'}
                </button>
            </form>
        </div>
    );
};

export default AlertForm;