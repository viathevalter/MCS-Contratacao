import React, { useState, useEffect } from 'react';
import { MessageTemplate, CommunicationLog } from '../types';
import { templatesRepo } from '../lib/templatesRepo';
import { commsRepo } from '../lib/commsRepo';
import { withDDI, getWhatsAppLink } from '../lib/phoneUtils';
import { applyTemplate, getContextFromEntity } from '../lib/messageUtils';
import { authMock } from '../lib/authMock';

interface CommunicationPanelProps {
  entity: any;
  type: 'candidate' | 'worker';
  onUpdateEntity?: (updates: any) => void;
}

const CommunicationPanel: React.FC<CommunicationPanelProps> = ({ entity, type, onUpdateEntity }) => {
  // State
  const [ddi, setDdi] = useState(entity.ddi || '+34');
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [history, setHistory] = useState<CommunicationLog[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Load Data
  useEffect(() => {
    setTemplates(templatesRepo.listTemplates());
    setHistory(commsRepo.getLogsByEntity(entity.id));
  }, [entity.id]);

  // Handle Template Selection
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tId = e.target.value;
    setSelectedTemplateId(tId);
    if (tId) {
      const t = templates.find(temp => temp.id === tId);
      if (t) {
        const context = getContextFromEntity(entity, type);
        setMessageText(applyTemplate(t.text, context));
      }
    } else {
      setMessageText('');
    }
  };

  // Handle DDI Change
  const handleDdiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDdi(val);
    if (onUpdateEntity) {
      onUpdateEntity({ ddi: val });
    }
  };

  // Helpers
  const phoneRaw = type === 'candidate' ? entity.raw_phone : entity.phone;
  const emailRaw = type === 'candidate' ? entity.raw_email : entity.email;
  const fullPhone = withDDI(phoneRaw, ddi);
  const session = authMock.getSession();

  const logAction = (channel: 'whatsapp' | 'email' | 'call') => {
    const newLog = commsRepo.logCommunication({
      entity_type: type,
      entity_id: entity.id,
      channel,
      template_name: templates.find(t => t.id === selectedTemplateId)?.name || 'Custom',
      message_text: messageText,
      phone_used: fullPhone,
      email_used: emailRaw,
      created_by: session?.email || 'admin'
    });
    setHistory([newLog, ...history]);
    setLastAction(`Acción registrada: ${channel.toUpperCase()}`);
    setTimeout(() => setLastAction(null), 3000);
  };

  const openWhatsApp = (mode: 'web' | 'app') => {
    if (!fullPhone) return;
    const link = getWhatsAppLink(fullPhone, messageText, mode);
    window.open(link, '_blank');
    logAction('whatsapp');
  };

  const handleCall = () => {
    if (!fullPhone) return;
    window.location.href = `tel:${fullPhone}`;
    logAction('call');
  };

  const handleEmail = () => {
    if (!emailRaw) return;
    const subject = encodeURIComponent("Contacto Wolters Recruitment");
    const body = encodeURIComponent(messageText);
    window.location.href = `mailto:${emailRaw}?subject=${subject}&body=${body}`;
    logAction('email');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center">
          <svg className="w-5 h-5 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Comunicación
        </h3>
        {lastAction && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded animate-pulse">
            {lastAction}
          </span>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Settings Row */}
        <div className="flex gap-4">
          <div className="w-1/3">
            <label className="block text-xs font-semibold text-slate-500 mb-1">DDI / País</label>
            <input 
              type="text" 
              value={ddi}
              onChange={handleDdiChange}
              className="w-full text-sm border-slate-300 rounded focus:ring-brand-500 focus:border-brand-500"
              placeholder="+34"
            />
          </div>
          <div className="w-2/3">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Usar Plantilla</label>
            <select 
              className="w-full text-sm border-slate-300 rounded focus:ring-brand-500 focus:border-brand-500"
              value={selectedTemplateId}
              onChange={handleTemplateChange}
            >
              <option value="">-- Escribir mensaje libre --</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Message Preview */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Mensaje</label>
          <textarea 
            rows={4}
            className="w-full text-sm border-slate-300 rounded focus:ring-brand-500 focus:border-brand-500 bg-slate-50"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => openWhatsApp('app')}
            disabled={!phoneRaw}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-3 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            title={phoneRaw ? `Enviar a ${fullPhone}` : 'Sin teléfono'}
          >
            WhatsApp (App)
          </button>
          <button 
            onClick={() => openWhatsApp('web')}
            disabled={!phoneRaw}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-3 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            WA Web
          </button>
          <button 
            onClick={handleCall}
            disabled={!phoneRaw}
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold py-2 px-3 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Llamar
          </button>
          <button 
            onClick={handleEmail}
            disabled={!emailRaw}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-3 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Email
          </button>
        </div>

        {/* History Log */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Historial Reciente</h4>
          <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Sin comunicaciones registradas.</p>
            ) : (
              history.slice(0, 10).map(log => (
                <div key={log.id} className="text-xs border-l-2 border-slate-200 pl-3 py-1">
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span className="font-semibold uppercase">{log.channel}</span>
                    <span>{new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="text-slate-700 truncate" title={log.message_text}>
                    {log.template_name ? `[${log.template_name}] ` : ''}{log.message_text}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPanel;
