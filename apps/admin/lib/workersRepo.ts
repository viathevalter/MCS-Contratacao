import { supabase } from './supabase';
import { Worker, WorkerNote, WorkerFilter, WorkerStatus } from '../types';

export const workersRepo = {
  async createWorker(data: Omit<Worker, 'id' | 'created_at' | 'worker_code'>): Promise<Worker | null> {
    // Generate worker_code (E0001) - simple approach using count + 1
    // Race condition possible but okay for now. Better to use a DB function.
    const { count } = await supabase.from('workers').select('*', { count: 'exact', head: true });
    const nextCode = `E${((count || 0) + 1).toString().padStart(4, '0')}`;

    const { data: worker, error } = await supabase
      .from('workers')
      .insert({
        ...data,
        worker_code: nextCode
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating worker:', error);
      return null;
    }

    return worker as Worker;
  },

  async listWorkers(filters: WorkerFilter = {}): Promise<Worker[]> {
    let query = supabase
      .from('workers')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      const term = `%${filters.search}%`;
      query = query.or(`full_name.ilike.${term},worker_code.ilike.${term},phone.ilike.${term},profession_primary.ilike.${term}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error listing workers:', error);
      return [];
    }

    return data as Worker[];
  },

  async getWorker(id: string): Promise<Worker | null> {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting worker:', error);
      return null;
    }

    return data as Worker;
  },

  async getWorkerBySubmissionId(submissionId: string): Promise<Worker | null> {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('source_submission_id', submissionId)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore no rows found
      console.error('Error getting worker by submission:', error);
    }

    return data as Worker | null;
  },

  async findWorkerByContact(phone: string, email?: string): Promise<Worker | null> {
    let query = supabase
      .from('workers')
      .select('*');

    if (email) {
      query = query.or(`phone.eq.${phone},email.eq.${email}`);
    } else {
      query = query.eq('phone', phone);
    }

    const { data, error } = await query.limit(1).maybeSingle();

    if (error) {
      console.error('Error finding worker by contact:', error);
      return null;
    }

    return data as Worker | null;
  },

  async updateWorker(id: string, updates: Partial<Worker>): Promise<Worker | null> {
    const { data, error } = await supabase
      .from('workers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating worker:', error);
      return null;
    }

    return data as Worker;
  },

  async deleteWorker(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting worker:', error);
      return false;
    }

    return true;
  },

  // Notes
  async addNote(workerId: string, author: string, content: string): Promise<WorkerNote | null> {
    const { data, error } = await supabase
      .from('worker_notes')
      .insert({
        worker_id: workerId,
        author,
        content
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding note:', error);
      return null;
    }

    return data as WorkerNote;
  },

  async getNotes(workerId: string): Promise<WorkerNote[]> {
    const { data, error } = await supabase
      .from('worker_notes')
      .select('*')
      .eq('worker_id', workerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting notes:', error);
      return [];
    }

    return data as WorkerNote[];
  },

  async getAllNotes(): Promise<WorkerNote[]> {
    const { data, error } = await supabase
      .from('worker_notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data as WorkerNote[];
  },

  async clearStorage() {
    console.warn('clearStorage called on Supabase repo - doing nothing safely');
  }
};
