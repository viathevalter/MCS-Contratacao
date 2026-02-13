import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { stagingRepo } from '../lib/stagingRepo';
import { CandidateSubmission } from '../types';

const DebugList: React.FC = () => {
  const [submissions, setSubmissions] = useState<CandidateSubmission[]>([]);

  const loadData = () => {
    const data = stagingRepo.listSubmissions({ limit: 50 });
    setSubmissions(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClear = () => {
    if (confirm("¿Estás seguro de borrar todos los datos locales?")) {
      stagingRepo.clearStorage();
      loadData();
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-slate-800">Debug: Envíos Locales</h1>
        <button 
          onClick={handleClear}
          className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200"
        >
          Limpiar Storage
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {submissions.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            No hay registros en LocalStorage
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oferta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(sub.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sub.raw_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sub.raw_phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sub.raw_payload.offer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-400">
                      {sub.id.substring(0, 6)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        Key: <code>wolters_candidate_submissions</code>
      </div>
    </Layout>
  );
};

export default DebugList;