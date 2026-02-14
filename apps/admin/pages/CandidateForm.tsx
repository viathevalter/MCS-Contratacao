import React, { useState, ChangeEvent, FormEvent } from 'react';
import Layout from '../components/Layout';
import { stagingRepo } from '../lib/stagingRepo';
import { FileMetadata } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

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
  offers: Set<string>; // Changed from single string to Set for multi-select
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

const CandidateForm: React.FC = () => {
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
      <Layout>
        <Card className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Solicitud enviada con éxito!</h2>
          <p className="text-slate-600 mb-6">Hemos recibido su información correctamente.</p>

          <div className="bg-slate-50 p-4 rounded-lg inline-block mb-8">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Número de registro</span>
            <div className="text-lg font-mono font-bold text-brand-600">{submittedId.substring(0, 8).toUpperCase()}</div>
          </div>

          <div>
            <Button
              onClick={resetForm}
              size="lg"
            >
              Enviar otra solicitud
            </Button>
          </div>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Ofertas de Empleo</h1>
        <p className="text-lg text-slate-600">Oferta de trabajo en la Unión Europea. Complete el formulario para postularse.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <Card
          title={
            <div className="flex items-center">
              <span className="bg-brand-100 text-brand-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
              <svg className="w-5 h-5 text-slate-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Datos Personales
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              name="name"
              label="Nombre Completo"
              required
              value={formData.name}
              onChange={handleInputChange}
              containerClassName="w-full"
              placeholder="Su nombre y apellido"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="phone"
                type="tel"
                label="Teléfono / Whatsapp"
                required
                value={formData.phone}
                onChange={handleInputChange}
                containerClassName="w-full"
                placeholder="+00 000 000 000"
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
            />
          </div>
        </Card>

        {/* Profile Info */}
        <Card
          title={
            <div className="flex items-center">
              <span className="bg-brand-100 text-brand-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
              <svg className="w-5 h-5 text-slate-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Perfil Profesional
            </div>
          }
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">¿Qué clase de documentación tiene? *</label>
              <div className="space-y-2">
                {DOCUMENTATION_OPTIONS.map((opt) => {
                  const isSelected = formData.documentation === opt;
                  return (
                    <label key={opt}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200
                        ${isSelected
                          ? 'bg-brand-600 border-brand-600 text-white shadow-md transform scale-[1.01]'
                          : 'bg-brand-50 border-brand-100 text-slate-700 hover:bg-brand-100'
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
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 transition-colors flex-shrink-0
                        ${isSelected ? 'bg-white border-white' : 'bg-white border-brand-200'}
                      `}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-700'}`}>{opt}</span>
                    </label>
                  );
                })}
              </div>
              {formData.documentation === 'Otro' && (
                <div className="mt-2 animate-fade-in-down">
                  <Input
                    name="documentationOther"
                    value={formData.documentationOther}
                    onChange={handleInputChange}
                    placeholder="Especifique su documentación"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">¿Qué idiomas habla? (Selección Múltiple) *</label>
              <div className="space-y-2">
                {LANGUAGE_OPTIONS.map((lang) => {
                  const isSelected = formData.languages.has(lang);
                  return (
                    <label key={lang}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200
                        ${isSelected
                          ? 'bg-brand-600 border-brand-600 text-white shadow-md transform scale-[1.01]'
                          : 'bg-brand-50 border-brand-100 text-slate-700 hover:bg-brand-100'
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
                        ${isSelected ? 'bg-white border-white' : 'bg-white border-brand-200'}
                      `}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-sm bg-brand-600" />}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-700'}`}>{lang}</span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-2">
                <Input
                  name="languageOther"
                  value={formData.languageOther}
                  onChange={handleInputChange}
                  placeholder="Otro idioma (opcional)"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Offer Selection */}
        <Card
          title={
            <div className="flex items-center">
              <span className="bg-brand-100 text-brand-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">3</span>
              <svg className="w-5 h-5 text-slate-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Interés y Documentos
            </div>
          }
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Seleccione la oferta de su interés (Selección Múltiple) *</label>
              <div className="space-y-2">
                {OFFER_OPTIONS.map((opt) => {
                  const isSelected = formData.offers.has(opt);
                  return (
                    <label key={opt}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200
                        ${isSelected
                          ? 'bg-brand-600 border-brand-600 text-white shadow-md transform scale-[1.01]'
                          : 'bg-brand-50 border-brand-100 text-slate-700 hover:bg-brand-100'
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
                        ${isSelected ? 'bg-white border-white' : 'bg-white border-brand-200'}
                      `}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-sm bg-brand-600" />}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-700'}`}>{opt}</span>
                    </label>
                  );
                })}
              </div>
              {formData.offers.has('Otro') && (
                <div className="mt-2 animate-fade-in-down">
                  <Input
                    name="offerOther"
                    value={formData.offerOther}
                    onChange={handleInputChange}
                    placeholder="Especifique el área de interés"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adjuntar hoja de vida y certificaciones</label>
              <p className="text-xs text-slate-500 mb-2">Seleccione un archivo (PDF, DOCX, JPG). Máx 5MB.</p>
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-brand-50 file:text-brand-700
                  hover:file:bg-brand-100
                  bg-white rounded-lg border border-slate-200
                "
              />
              {formData.fileMeta && (
                <div className="mt-2 text-xs text-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  Archivo seleccionado: {formData.fileMeta.name} ({(formData.fileMeta.size / 1024).toFixed(0)} KB)
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones <span className="text-slate-400 font-normal">(Opcional)</span></label>
              <textarea
                name="observations"
                rows={3}
                value={formData.observations}
                onChange={handleInputChange}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 border bg-white text-slate-900"
                placeholder="Información adicional relevante..."
              />
            </div>
          </div>
        </Card>

        <div className="sticky bottom-4 z-10">
          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            className="shadow-lg"
          >
            ENVIAR SOLICITUD
          </Button>
        </div>

      </form>
    </Layout>
  );
};

export default CandidateForm;