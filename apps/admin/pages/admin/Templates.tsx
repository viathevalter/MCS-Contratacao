import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { templatesRepo } from '../../lib/templatesRepo';
import { MessageTemplate } from '../../types';

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<MessageTemplate>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTemplates(templatesRepo.listTemplates());
  };

  const handleEdit = (t: MessageTemplate) => {
    setEditForm(t);
    setIsEditing(true);
  };

  const handleNew = () => {
    setEditForm({ name: '', text: '' });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Borrar esta plantilla?')) {
      templatesRepo.deleteTemplate(id);
      loadData();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editForm.text) return;

    if (editForm.id) {
      templatesRepo.updateTemplate(editForm.id, editForm);
    } else {
      templatesRepo.createTemplate(editForm.name, editForm.text);
    }
    setIsEditing(false);
    loadData();
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Plantillas de Mensajes</h1>
          <p className="text-sm text-slate-500">Gestión de respuestas predefinidas para WhatsApp y Email</p>
        </div>
        <button 
          onClick={handleNew}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700"
        >
          + Nueva Plantilla
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {templates.map(t => (
            <div key={t.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800">{t.name}</h3>
                <pre className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded whitespace-pre-wrap font-sans border border-slate-100">
                  {t.text}
                </pre>
                <div className="mt-2 text-xs text-slate-400 flex gap-2">
                    <span>Variables disponibles:</span>
                    <code className="bg-slate-100 px-1 rounded">{'{nombre}'}</code>
                    <code className="bg-slate-100 px-1 rounded">{'{profesion}'}</code>
                    <code className="bg-slate-100 px-1 rounded">{'{ubicacion}'}</code>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button onClick={() => handleEdit(t)} className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Editor */}
        {isEditing && (
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-xl shadow-lg border border-brand-200 sticky top-24">
                <h3 className="font-bold text-slate-800 mb-4">{editForm.id ? 'Editar Plantilla' : 'Nueva Plantilla'}</h3>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Nombre</label>
                    <input 
                      type="text" 
                      className="w-full text-sm border-slate-300 rounded p-2"
                      value={editForm.name || ''}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Contenido</label>
                    <textarea 
                      rows={8}
                      className="w-full text-sm border-slate-300 rounded p-2"
                      value={editForm.text || ''}
                      onChange={e => setEditForm({...editForm, text: e.target.value})}
                      required
                      placeholder="Hola {nombre}, ..."
                    />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
                    <button type="submit" className="flex-1 py-2 text-sm bg-brand-600 text-white rounded font-bold hover:bg-brand-700">Guardar</button>
                  </div>
                </form>
             </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Templates;
