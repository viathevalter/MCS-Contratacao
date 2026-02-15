'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { stagingRepo } from '../../lib/stagingRepo';
import { FileMetadata } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

// Constants for form options
const DOCUMENTATION_OPTIONS = [
    "Pasaporte de la UE (Europeo)",
    "Permiso de trabajo válido",
    "Visa de estudiante",
    "En trámite / Sin documentos",
    "Otro"
];

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

const LANGUAGE_OPTIONS = [
    "Español",
    "Inglés",
    "Portugués",
    "Francés",
    "Alemán"
];

interface FormState {
    name: string;
    phone: string;
    email: string;
    location: string;
    documentation: string;
    documentationOther: string;
    offers: Set<string>;
    offerOther: string;
    languages: Set<string>;
    languageOther: string;
    observations: string;
    fileMeta: FileMetadata | null;
}

const INITIAL_STATE: FormState = {
    name: '',
    phone: '',
    email: '',
    location: '',
    documentation: '',
    documentationOther: '',
    offers: new Set(),
    offerOther: '',
    languages: new Set(),
    languageOther: '',
    observations: '',
    fileMeta: null
};

export default function CandidateForm() {
    const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedId, setSubmittedId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (option: string) => {
        setFormData(prev => {
            const newLangs = new Set(prev.languages);
            if (newLangs.has(option)) {
                newLangs.delete(option);
            } else {
                newLangs.add(option);
            }
            return { ...prev, languages: newLangs };
        });
    };

    const handleOfferChange = (option: string) => {
        setFormData(prev => {
            const newOffers = new Set(prev.offers);
            if (newOffers.has(option)) {
                newOffers.delete(option);
            } else {
                newOffers.add(option);
            }
            return { ...prev, offers: newOffers };
        });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                fileMeta: {
                    name: file.name,
                    size: file.size,
                    type: file.type
                }
            }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic Validation
        if (!formData.name || !formData.phone || !formData.location || !formData.documentation || formData.offers.size === 0) {
            setError("Por favor, complete todos los campos obligatorios marcados con *");
            window.scrollTo(0, 0);
            return;
        }

        setIsSubmitting(true);

        // Process "Other" fields
        const finalDoc = formData.documentation === 'Otro' ? `Otro: ${formData.documentationOther}` : formData.documentation;

        // Process Offers (Multi-select)
        const finalOffersList = Array.from(formData.offers).filter(o => o !== 'Otro');
        if (formData.offers.has('Otro') && formData.offerOther) {
            finalOffersList.push(`Otro: ${formData.offerOther}`);
        }
        const finalOffersString = finalOffersList.join(', ');

        // Explicitly cast to string[] to resolve type inference issue
        const finalLangs = Array.from(formData.languages) as string[];
        if (formData.languageOther) {
            finalLangs.push(`Otro: ${formData.languageOther}`);
        }

        try {
            const submission = await stagingRepo.createSubmission(
                formData.name,
                formData.phone,
                formData.email || undefined,
                {
                    location: formData.location,
                    documentation: finalDoc,
                    languages: finalLangs,
                    offer: finalOffersString, // Saving as comma-separated string
                    observations: formData.observations || undefined,
                    file_meta: formData.fileMeta || undefined
                }
            );

            if (!submission) throw new Error("Failed to create submission");

            // Simulate a small delay for UX
            setTimeout(() => {
                setSubmittedId(submission.id);
                setIsSubmitting(false);
                window.scrollTo(0, 0);
            }, 800);

        } catch (err) {
            console.error(err);
            setError("Hubo un error al guardar su solicitud. Intente nuevamente.");
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData(INITIAL_STATE);
        setSubmittedId(null);
    };

    if (submittedId) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <Card className="text-center animate-fade-in py-12">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">¡Solicitud enviada con éxito!</h2>
                        <p className="text-slate-600 mb-8 text-lg">Hemos recibido su información correctamente.</p>

                        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl inline-block mb-10 shadow-sm">
                            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Número de registro</span>
                            <div className="text-2xl font-mono font-bold text-[#004F9F] mt-1">{submittedId.substring(0, 8).toUpperCase()}</div>
                        </div>

                        <div className="flex flex-col gap-4 items-center">
                            <button
                                onClick={resetForm}
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#FF6B00] hover:bg-[#e66000] shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Enviar otra solicitud
                            </button>
                            <Link href="/" className="text-slate-500 hover:text-slate-900 underline">
                                Volver al inicio
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Shared Header */}
            <Header />

            {/* Hero Section */}
            <div className="relative px-4 py-16 bg-gradient-to-br from-[#004F9F] to-[#003366] text-white overflow-hidden shadow-lg mb-10">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay" />

                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">
                        Ofertas de Empleo
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 font-light leading-relaxed">
                        Oportunidades de trabajo en la Unión Europea. <br className="hidden md:block" />
                        Complete el formulario para iniciar su proceso de postulación.
                    </p>
                </div>
            </div>

            <div className="px-4 pb-20">
                {error && (
                    <div className="max-w-3xl mx-auto bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-sm animate-fade-in-down">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
                    {/* Contact Info */}
                    <Card
                        className="overflow-visible"
                        title={
                            <div className="flex items-center text-xl font-bold text-slate-800">
                                <span className="bg-blue-50 text-[#004F9F] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 border border-blue-100 shadow-sm">1</span>
                                Datos Personales
                            </div>
                        }
                    >
                        <div className="space-y-5 p-1">
                            <Input
                                name="name"
                                label="Nombre Completo"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                containerClassName="w-full"
                                placeholder="Su nombre y apellido"
                                className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input
                                    name="phone"
                                    type="tel"
                                    label="Teléfono / Whatsapp"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    containerClassName="w-full"
                                    placeholder="+00 000 000 000"
                                    className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                />
                                <Input
                                    name="email"
                                    type="email"
                                    label="Correo electrónico"
                                    helperText="(Opcional)"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    containerClassName="w-full"
                                    placeholder="ejemplo@correo.com"
                                    className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                />
                            </div>

                            <Input
                                name="location"
                                label="¿Dónde está ubicado actualmente?"
                                required
                                value={formData.location}
                                onChange={handleInputChange}
                                containerClassName="w-full"
                                placeholder="Ciudad, País"
                                className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            />
                        </div>
                    </Card>

                    {/* Profile Info */}
                    <Card
                        className="overflow-visible"
                        title={
                            <div className="flex items-center text-xl font-bold text-slate-800">
                                <span className="bg-blue-50 text-[#004F9F] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 border border-blue-100 shadow-sm">2</span>
                                Perfil Profesional
                            </div>
                        }
                    >
                        <div className="space-y-8 p-1">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-4">¿Qué clase de documentación tiene? <span className="text-red-500">*</span></label>
                                <div className="space-y-3">
                                    {DOCUMENTATION_OPTIONS.map((opt) => {
                                        const isSelected = formData.documentation === opt;
                                        return (
                                            <label key={opt}
                                                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 group
                            ${isSelected
                                                        ? 'bg-blue-50 border-[#004F9F] ring-1 ring-[#004F9F] shadow-sm'
                                                        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                                    }
                        `}
                                            >
                                                <input
                                                    type="radio"
                                                    name="documentation"
                                                    value={opt}
                                                    checked={isSelected}
                                                    onChange={handleInputChange}
                                                    className="hidden"
                                                />
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 transition-all duration-200 flex-shrink-0
                            ${isSelected ? 'border-[#004F9F] bg-[#004F9F]' : 'border-slate-300 group-hover:border-blue-400'}
                        `}>
                                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                                </div>
                                                <span className={`text-sm font-medium ${isSelected ? 'text-[#002244]' : 'text-slate-700'}`}>{opt}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                                {formData.documentation === 'Otro' && (
                                    <div className="mt-3 animate-fade-in-down pl-9">
                                        <Input
                                            name="documentationOther"
                                            value={formData.documentationOther}
                                            onChange={handleInputChange}
                                            placeholder="Especifique su documentación"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-4">¿Qué idiomas habla? <span className="text-slate-500 font-normal">(Selección Múltiple)</span> <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {LANGUAGE_OPTIONS.map((lang) => {
                                        const isSelected = formData.languages.has(lang);
                                        return (
                                            <label key={lang}
                                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 select-none
                            ${isSelected
                                                        ? 'bg-blue-50 border-[#004F9F] text-[#002244] shadow-sm'
                                                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                                                    }
                        `}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleCheckboxChange(lang)}
                                                    className="hidden"
                                                />
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors flex-shrink-0
                            ${isSelected ? 'bg-[#004F9F] border-[#004F9F] text-white' : 'bg-white border-slate-300'}
                        `}>
                                                    {isSelected && (
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">{lang}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                                <div className="mt-3">
                                    <Input
                                        name="languageOther"
                                        value={formData.languageOther}
                                        onChange={handleInputChange}
                                        placeholder="Otro idioma (opcional)"
                                        className="bg-slate-50 border-slate-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Offer Selection */}
                    <Card
                        className="overflow-visible"
                        title={
                            <div className="flex items-center text-xl font-bold text-slate-800">
                                <span className="bg-blue-50 text-[#004F9F] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 border border-blue-100 shadow-sm">3</span>
                                Interés y Documentos
                            </div>
                        }
                    >
                        <div className="space-y-8 p-1">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-4">Seleccione la oferta de su interés <span className="text-slate-500 font-normal">(Selección Múltiple)</span> <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-1 gap-3">
                                    {OFFER_OPTIONS.map((opt) => {
                                        const isSelected = formData.offers.has(opt);
                                        return (
                                            <label key={opt}
                                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200
                            ${isSelected
                                                        ? 'bg-blue-50 border-[#004F9F] text-[#002244] shadow-sm transform translate-x-1'
                                                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                                                    }
                        `}
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={opt}
                                                    checked={isSelected}
                                                    onChange={() => handleOfferChange(opt)}
                                                    className="hidden"
                                                />
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors flex-shrink-0
                            ${isSelected ? 'bg-[#004F9F] border-[#004F9F] text-white' : 'bg-white border-slate-300'}
                        `}>
                                                    {isSelected && (
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">{opt}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                                {formData.offers.has('Otro') && (
                                    <div className="mt-3 animate-fade-in-down pl-1">
                                        <Input
                                            name="offerOther"
                                            value={formData.offerOther}
                                            onChange={handleInputChange}
                                            placeholder="Especifique el área de interés"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Adjuntar hoja de vida y certificaciones</label>
                                <div className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors
                    ${formData.fileMeta ? 'border-blue-300 bg-blue-50' : 'border-slate-300 hover:border-blue-300 hover:bg-slate-50'}
                    `}>
                                    <div className="space-y-1 text-center">
                                        {!formData.fileMeta ? (
                                            <>
                                                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-slate-600 justify-center">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#004F9F] hover:text-[#003366] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                        <span>Subir un archivo</span>
                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                                    </label>
                                                    <p className="pl-1">o arrastrar y soltar</p>
                                                </div>
                                                <p className="text-xs text-slate-500">PDF, DOCX, JPG hasta 5MB</p>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <svg className="w-10 h-10 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                <span className="text-sm font-medium text-slate-900">{formData.fileMeta.name}</span>
                                                <span className="text-xs text-slate-500">{(formData.fileMeta.size / 1024).toFixed(0)} KB</span>
                                                <label htmlFor="file-upload" className="mt-2 text-xs font-semibold text-[#004F9F] hover:text-[#003366] cursor-pointer">
                                                    Cambiar archivo
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Observaciones <span className="text-slate-400 font-normal">(Opcional)</span></label>
                                <textarea
                                    name="observations"
                                    rows={3}
                                    value={formData.observations}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 border bg-white text-slate-900 transition-all placeholder:text-slate-400"
                                    placeholder="Información adicional relevante..."
                                />
                            </div>
                        </div>
                    </Card>

                    <div className="sticky bottom-6 z-10 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-[#FF6B00] hover:bg-[#e66000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-[1.01] hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enviando...
                                </span>
                            ) : "ENVIAR SOLICITUD"}
                        </button>
                    </div>

                </form>
            </div>

            <Footer />
        </div >
    );
}
