import React, { useState } from 'react';
import { Bell, Filter } from 'lucide-react';
import AlertForm from '../components/AlertForm';
import AlertCard from '../components/AlertCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAlerts } from '../hooks/useAlerts';
import type { AlertStatus } from '../types';

const AlertsPage: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<AlertStatus | undefined>(undefined);
    const { alerts, loading, error, deleteAlert, refresh } = useAlerts(statusFilter);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this alert?')) {
            try {
                await deleteAlert(id);
            } catch (err) {
                alert('Failed to delete alert');
            }
        }
    };

    const handleAlertCreated = () => {
        refresh();
    };

    const filterOptions: { label: string; value: AlertStatus | undefined }[] = [
        { label: 'All', value: undefined },
        { label: 'Pending', value: 'pending' },
        { label: 'Triggered', value: 'triggered' },
    ];

    const pendingCount = alerts.filter(a => a.status === 'pending').length;
    const triggeredCount = alerts.filter(a => a.status === 'triggered').length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 頭部 */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bell className="w-8 h-8 text-primary-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Price Alerts</h1>
                                <p className="text-sm text-gray-500">
                                    {pendingCount} pending · {triggeredCount} triggered
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 內容 */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 左側：警報表單 */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <AlertForm onSuccess={handleAlertCreated} />
                        </div>
                    </div>

                    {/* 右側：警報列表 */}
                    <div className="lg:col-span-2">
                        {/* 過濾器 */}
                        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                            <div className="flex items-center gap-4">
                                <Filter className="w-5 h-5 text-gray-500" />
                                <div className="flex gap-2 flex-wrap">
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option.label}
                                            onClick={() => setStatusFilter(option.value)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === option.value
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 警報列表 */}
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <LoadingSpinner size="lg" message="Loading alerts..." />
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                                <p className="font-medium">Error loading alerts</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        ) : alerts.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow-md">
                                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg mb-2">No alerts yet</p>
                                <p className="text-gray-400 text-sm">
                                    Create your first price alert to get started
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {alerts.map((alert) => (
                                    <AlertCard
                                        key={alert.id}
                                        alert={alert}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AlertsPage;