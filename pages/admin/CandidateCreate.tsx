import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { stagingRepo } from '../../lib/stagingRepo';
import { configRepo } from '../../lib/configRepo';
import { AppConfig } from '../../types';

// Options matching CandidateForm/List
const OFFER_OPTIONS = [
    "SOLDADOR MIG MAG/GMAW/FCAW",
    "SOLDADOR TIG/GTAW",
    "SOLDADOR ELECTRODO REVESTIDA/SMAW",
    "TUBERO",
    "ELECTRICISTA",
    "CALDERERO/ARMADOR",
    "MECÁNICO MONTADOR",
    "MONTADOR DE ESTRUCTURA",
    "PINTOR INDUSTRIAL",
    "OPERADOR CNC/TORNERO CNC",
    "AISLADOR TERMICO",
    "Otro"
];

const DOCUMENTATION_OPTIONS = [
    "Pasaporte de la UE (Europeo)",
    "Permiso de trabajo válido",
    "En trámite / Sin documentos",
    "Otro"
];

const CandidateCreate: React.FC = () => {
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
        location: '',
        documentation: '',
        documentationOther: '',
        offer: '',
        offerOther: '',
        languages: [] as string[],
        languageOther: '',
        observations: ''
    });

    const toggleLanguage = (lang: string) => {
        setFormData(prev => {
            const current = prev.languages;
            return {
                ...prev,
                languages: current.includes(lang)
                    ? current.filter(l => l !== lang)
                    : [...current, lang]
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.full_name || !formData.phone || !formData.location || !formData.offer) {
            alert("Por favor complete los campos obligatorios");
            return;
        }

        // Process final values
        const finalDoc = formData.documentation === 'Otro' ? `Otro: ${formData.documentationOther}` : formData.documentation;
        const finalOffer = formData.offer === 'Otro' ? `Otro: ${formData.offerOther}` : formData.offer;

        const finalLangs = [...formData.languages];
        if (formData.languageOther) finalLangs.push(`Otro: ${formData.languageOther}`);

        const newSubmission = await stagingRepo.createSubmission(
            formData.full_name,
            formData.phone,
            formData.email,
            {
                location: formData.location,
                documentation: finalDoc,
                languages: finalLangs,
                offer: finalOffer,
                observations: formData.observations
            }
        );

        if (newSubmission) {
            navigate(`/admin/candidatos/${newSubmission.id}`);
        } else {
            alert("Error al crear candidato");
        }
    };

    return (
        <AdminLayout>
            <PageHeader
                title="Nuevo Candidato"
                description="Registrar un nuevo candidato manualmente"
                backUrl="/admin/candidatos"
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
                                label="Ubicación Actual *"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Ej: Madrid, España"
                                required
                            />
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Perfil Profesional</h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Select
                                        label="Oficio Principal *"
                                        value={formData.offer}
                                        onChange={e => setFormData({ ...formData, offer: e.target.value })}
                                        options={OFFER_OPTIONS.map(o => ({ value: o, label: o }))}
                                    />
                                    {formData.offer === 'Otro' && (
                                        <div className="mt-2">
                                            <Input
                                                label="Especifique Oficio"
                                                value={formData.offerOther}
                                                onChange={e => setFormData({ ...formData, offerOther: e.target.value })}
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Select
                                        label="Documentación *"
                                        value={formData.documentation}
                                        onChange={e => setFormData({ ...formData, documentation: e.target.value })}
                                        options={DOCUMENTATION_OPTIONS.map(d => ({ value: d, label: d }))}
                                    />
                                    {formData.documentation === 'Otro' && (
                                        <div className="mt-2">
                                            <Input
                                                label="Especifique Documentación"
                                                value={formData.documentationOther}
                                                onChange={e => setFormData({ ...formData, documentationOther: e.target.value })}
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">Idiomas</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {config.languages.map(lang => (
                                        <label key={lang} className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 p-2 rounded cursor-pointer hover:bg-slate-100 border border-slate-100">
                                            <input
                                                type="checkbox"
                                                className="rounded text-brand-600 focus:ring-brand-500"
                                                checked={formData.languages.includes(lang)}
                                                onChange={() => toggleLanguage(lang)}
                                            />
                                            <span>{lang}</span>
                                        </label>
                                    ))}
                                    {config.languages.length === 0 && (
                                        <span className="text-sm text-slate-400 italic">No hay idiomas configurados.</span>
                                    )}
                                </div>
                                <div className="mt-2">
                                    <Input
                                        label="Otro Idioma"
                                        value={formData.languageOther}
                                        onChange={e => setFormData({ ...formData, languageOther: e.target.value })}
                                        placeholder="Ej: Italiano B1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Observaciones</label>
                                <textarea
                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 text-sm h-24"
                                    value={formData.observations}
                                    onChange={e => setFormData({ ...formData, observations: e.target.value })}
                                    placeholder="Información adicional sobre el candidato..."
                                />
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/admin/candidatos')}
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit">
                            Crear Candidato
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default CandidateCreate;
