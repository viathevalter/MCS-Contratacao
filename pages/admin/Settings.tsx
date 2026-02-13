import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { configRepo, AppConfig } from '../../lib/configRepo';

const Settings: React.FC = () => {
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [newItems, setNewItems] = useState({
        job_profiles: '',
        social_security_countries: '',
        previous_companies: ''
    });

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        const data = await configRepo.getConfig();
        setConfig(data);
    };

    const handleAddItem = async (key: keyof AppConfig, value: string) => {
        if (!value.trim()) return;
        const updated = await configRepo.addItem(key, value.trim());
        if (updated) {
            setConfig(updated);
            setNewItems(prev => ({ ...prev, [key]: '' }));
        }
    };

    const handleRemoveItem = async (key: keyof AppConfig, value: string) => {
        if (confirm(`¿Eliminar "${value}" de la lista?`)) {
            const updated = await configRepo.removeItem(key, value);
            if (updated) setConfig(updated);
        }
    };

    if (!config) return <AdminLayout><div>Cargando...</div></AdminLayout>;

    const renderListSection = (title: string, key: keyof AppConfig, placeholder: string) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newItems[key as keyof typeof newItems] || ''}
                    onChange={(e) => setNewItems(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="flex-1 rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 border"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddItem(key, newItems[key as keyof typeof newItems]);
                        }
                    }}
                />
                <button
                    onClick={() => handleAddItem(key, newItems[key as keyof typeof newItems])}
                    disabled={!newItems[key as keyof typeof newItems]}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
                >
                    Agregar
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {config[key].map((item, index) => (
                    <div key={index} className="flex items-center bg-slate-50 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 text-sm group">
                        <span>{item}</span>
                        <button
                            onClick={() => handleRemoveItem(key, item)}
                            className="ml-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Eliminar"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
                {config[key].length === 0 && (
                    <span className="text-slate-400 italic text-sm">Lista vacía</span>
                )}
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Configuración del Sistema</h1>
                <p className="text-slate-600">Administra las listas desplegables y opciones del sistema.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderListSection("Perfiles de Vaga (Job Profiles)", "job_profiles", "Ej: SOLDADOR TIG...")}
                {renderListSection("Países Seguridad Social", "social_security_countries", "Ej: Portugal...")}
                {renderListSection("Empresas Anteriores (Grupo)", "previous_companies", "Ej: KR Industrial...")}
            </div>
        </AdminLayout>
    );
};

export default Settings;
