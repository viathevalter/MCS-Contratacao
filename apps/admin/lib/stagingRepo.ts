import { supabase } from './supabase';
import { CandidateSubmission, StagingFilter, CandidateStatus, KanbanStage } from '../types';

export const stagingRepo = {
  async createSubmission(
    name: string,
    phone: string,
    email: string | undefined,
    payload: CandidateSubmission['raw_payload']
  ): Promise<CandidateSubmission | null> {
    const { data, error } = await supabase
      .from('candidates')
      .insert({
        raw_name: name,
        raw_phone: phone,
        raw_email: email,
        payload: payload,
        status: 'new',
        source: 'webform'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating submission:', error);
      return null;
    }

    return {
      ...data,
      raw_payload: data.payload // Map payload to raw_payload matching types
    } as CandidateSubmission;
  },

  async listSubmissions(filters: StagingFilter = {}): Promise<CandidateSubmission[]> {
    let query = supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error listing submissions:', error);
      return [];
    }

    return data.map(item => ({
      ...item,
      raw_payload: item.payload
    })) as CandidateSubmission[];
  },

  async getSubmission(id: string): Promise<CandidateSubmission | null> {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting submission:', error);
      return null;
    }

    return {
      ...data,
      raw_payload: data.payload
    } as CandidateSubmission;
  },

  async updateSubmission(id: string, updates: Partial<CandidateSubmission>): Promise<CandidateSubmission | null> {
    const dbUpdates: any = { ...updates };

    // Map raw_payload back to payload for DB
    if (updates.raw_payload) {
      dbUpdates.payload = updates.raw_payload;
      delete dbUpdates.raw_payload;
    }

    const { data, error } = await supabase
      .from('candidates')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating submission:', error);
      return null;
    }

    return {
      ...data,
      raw_payload: data.payload
    } as CandidateSubmission;
  },

  async clearStorage() {
    // No-op for Supabase or maybe delete all rows (dangerous)
    console.warn('clearStorage called on Supabase repo - doing nothing safely');
  },

  // --- KANBAN STAGES ---

  async listStages(): Promise<KanbanStage[]> {
    const { data, error } = await supabase
      .from('kanban_stages')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error listing stages:', error);
      // Fallback to defaults if table doesn't exist yet
      return [
        { id: 'new', title: 'Nuevos', color: 'bg-yellow-400', position: 0 },
        { id: 'needs_review', title: 'En Revisión', color: 'bg-blue-400', position: 1 },
        { id: 'processed', title: 'Procesados', color: 'bg-green-400', position: 2 },
        { id: 'rejected', title: 'Rechazados', color: 'bg-red-400', position: 3 },
      ];
    }

    return data as KanbanStage[];
  },

  async createStage(stage: KanbanStage): Promise<KanbanStage | null> {
    const { data, error } = await supabase
      .from('kanban_stages')
      .insert(stage)
      .select()
      .single();

    if (error) {
      console.error('Error creating stage:', error);
      return null;
    }
    return data as KanbanStage;
  },

  async updateStage(id: string, updates: Partial<KanbanStage>): Promise<KanbanStage | null> {
    const { data, error } = await supabase
      .from('kanban_stages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating stage:', error);
      return null;
    }
    return data as KanbanStage;
  },

  async deleteStage(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('kanban_stages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting stage:', error);
      return false;
    }
    return true;
  }
};