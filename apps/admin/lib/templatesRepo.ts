import { MessageTemplate } from '../types';

const STORAGE_KEY = 'wolters_message_templates';

const generateUUID = () => Math.random().toString(36).substring(2, 15);

const SEED_TEMPLATES: MessageTemplate[] = [
  {
    id: 't1',
    name: 'Primer Contacto (WhatsApp)',
    text: 'Hola {nombre}, te escribimos de Wolters Recruitment. Hemos recibido tu solicitud para {profesion}. ¿Tienes un momento para hablar?',
    created_at: new Date().toISOString()
  },
  {
    id: 't2',
    name: 'Solicitud Documentos',
    text: 'Hola {nombre}, para avanzar con tu candidatura necesitamos que nos envíes foto de tu pasaporte y certificaciones. Gracias.',
    created_at: new Date().toISOString()
  },
  {
    id: 't3',
    name: 'Agendar Entrevista',
    text: 'Hola {nombre}, nos gustaría realizar una breve entrevista telefónica mañana. ¿A qué hora te viene bien?',
    created_at: new Date().toISOString()
  },
  {
    id: 't4',
    name: 'Aprobado',
    text: '¡Buenas noticias {nombre}! Has sido pre-seleccionado para la vacante. Nos pondremos en contacto pronto con los siguientes pasos.',
    created_at: new Date().toISOString()
  },
  {
    id: 't5',
    name: 'Email Formal',
    text: 'Estimado/a {nombre},\n\nGracias por su interés en trabajar con Wolters.\nAdjunto encontrará la información sobre la posición de {profesion}.\n\nSaludos,\nEquipo Wolters',
    created_at: new Date().toISOString()
  }
];

export const templatesRepo = {
  listTemplates: (): MessageTemplate[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Auto-seed if empty
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TEMPLATES));
        return SEED_TEMPLATES;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  createTemplate: (name: string, text: string): MessageTemplate => {
    const t: MessageTemplate = {
      id: generateUUID(),
      name,
      text,
      created_at: new Date().toISOString()
    };
    const all = templatesRepo.listTemplates();
    const updated = [t, ...all];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return t;
  },

  updateTemplate: (id: string, updates: Partial<MessageTemplate>) => {
    const all = templatesRepo.listTemplates();
    const idx = all.findIndex(t => t.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
  },

  deleteTemplate: (id: string) => {
    const all = templatesRepo.listTemplates();
    const updated = all.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
