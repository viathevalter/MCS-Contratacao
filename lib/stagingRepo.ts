import { supabase } from './supabase';
import { CandidateSubmission, StagingFilter, CandidateStatus } from '../types';

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
  }
};