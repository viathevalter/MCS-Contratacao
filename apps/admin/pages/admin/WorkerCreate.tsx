import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { workersRepo } from '../../lib/workersRepo';
import { configRepo } from '../../lib/configRepo';
import { AppConfig } from '../../types';

const WorkerCreate: React.FC = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState<AppConfig>(configRepo.getConfigSync());

    // Refresh config on mount
    useEffect(() => {
        const load = async () => {
            const data = await configRepo.getConfig();
            setConfig(data);
        };
        load();
    }, []);

    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        email: '',
        profession_primary: '',
        location: '',
        nationality: '',
        has_driver_license: false,
        european_residence: '',
        social_security_countries: [] as string[],
        previous_companies: [] as string[],
        job_profiles: [] as string[]
    });

    const toggleArraySelection = (field: 'social_security_countries' | 'previous_companies' | 'job_profiles', value: string) => {
        setFormData(prev => {
            const current = prev[field] || [];
            const exists = current.includes(value);
            return {
                ...prev,
                [field]: exists ? current.filter(item => item !== value) : [...current, value]
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.full_name || !formData.phone || !formData.location || !formData.profession_primary) {
            alert("Por favor complete los campos obligatorios");
            return;
        }

        const newWorker = await workersRepo.createWorker({
            full_name: formData.full_name,
            phone: formData.phone,
            email: formData.email,
            location: formData.location,
            documentation_type: formData.documentation_type,
            languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
            profession_primary: formData.profession_primary,
            profession_secondary: formData.profession_secondary,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            status: 'active'
        });

        if (newWorker) {
            navigate(`/admin/trabajadores/${newWorker.id}`);
        } else {
            alert("Error al crear trabajador");
        }
    };

    return (
        <AdminLayout>
            <PageHeader
                title="Nuevo Trabajador"
                description="Registrar un nuevo trabajador manualmente"
                backUrl="/admin/trabajadores"
            />

            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Información Básica</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nombre Completo *"
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                required
                            />
                            <Input
                                label="Teléfono *"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            <Input
                                label="Profesión Principal"
                                value={formData.profession_primary}
                                onChange={e => setFormData({ ...formData, profession_primary: e.target.value })}
                                placeholder="Ej: Soldador"
                            />
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Datos Personales</h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Nacionalidad"
                                    value={formData.nationality}
                                    onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                                    placeholder="Ej: Española"
                                />
                                <Select
                                    label="¿Tiene licencia de conducir?"
                                    value={formData.has_driver_license ? 'yes' : 'no'}
                                    onChange={e => setFormData({ ...formData, has_driver_license: e.target.value === 'yes' })}
                                    options={[
                                        { value: 'no', label: 'No' },
                                        { value: 'yes', label: 'Sí' }
                                    ]}
                                />
                                <Input
                                    label="Residencia Europea (País)"
                                    value={formData.european_residence}
                                    onChange={e => setFormData({ ...formData, european_residence: e.target.value })}
                                />
                                <Input
                                    label="Ubicación Actual"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">Perfiles de Vaga</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {config.job_profiles.map(profile => (
                                                <label key={profile} className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 p-2 rounded cursor-pointer hover:bg-slate-100 border border-slate-100">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded text-brand-600 focus:ring-brand-500"
                                                        checked={formData.job_profiles.includes(profile)}
                                                        onChange={() => toggleArraySelection('job_profiles', profile)}
                                                    />
                                                    <span className="truncate" title={profile}>{profile}</span>
                                                </label>
                                            ))}
                                            {config.job_profiles.length === 0 && <span className="text-sm text-slate-400 italic">No hay perfiles configurados.</span>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-3">Documentación SS</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {config.social_security_countries.map(country => (
                                                    <label key={country} className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 p-2 rounded cursor-pointer hover:bg-slate-100 border border-slate-100">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded text-brand-600 focus:ring-brand-500"
                                                            checked={formData.social_security_countries.includes(country)}
                                                            onChange={() => toggleArraySelection('social_security_countries', country)}
                                                        />
                                                        <span>{country}</span>
                                                    </label>
                                                ))}
                                                {config.social_security_countries.length === 0 && <span className="text-sm text-slate-400 italic col-span-2">Sin opciones.</span>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-3">Experiencia en Grupo</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {config.previous_companies.map(company => (
                                                    <label key={company} className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 p-2 rounded cursor-pointer hover:bg-slate-100 border border-slate-100">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded text-brand-600 focus:ring-brand-500"
                                                            checked={formData.previous_companies.includes(company)}
                                                            onChange={() => toggleArraySelection('previous_companies', company)}
                                                        />
                                                        <span className="truncate" title={company}>{company}</span>
                                                    </label>
                                                ))}
                                                {config.previous_companies.length === 0 && <span className="text-sm text-slate-400 italic col-span-2">Sin opciones.</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/admin/trabajadores')}
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit">
                            Crear Trabajador
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default WorkerCreate;
