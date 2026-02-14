import { CommunicationLog, CommChannel } from '../types';

const STORAGE_KEY = 'wolters_communication_logs';

const generateUUID = () => Math.random().toString(36).substring(2, 15);

export const commsRepo = {
  logCommunication: (data: Omit<CommunicationLog, 'id' | 'created_at'>): CommunicationLog => {
    const log: CommunicationLog = {
      id: generateUUID(),
      created_at: new Date().toISOString(),
      ...data
    };
    
    const existing = commsRepo.listLogs();
    const updated = [log, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return log;
  },

  listLogs: (): CommunicationLog[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  getLogsByEntity: (entityId: string): CommunicationLog[] => {
    const all = commsRepo.listLogs();
    return all.filter(l => l.entity_id === entityId).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
};
