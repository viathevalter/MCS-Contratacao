import { supabase } from './supabase';
import { Shortlist, ShortlistItem, ShortlistItemStatus } from '../types';

export const shortlistsRepo = {
  async createShortlist(data: Omit<Shortlist, 'id' | 'created_at' | 'status'>): Promise<Shortlist | null> {
    const { data: shortlist, error } = await supabase
      .from('shortlists')
      .insert({
        ...data,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating shortlist:', error);
      return null;
    }

    return shortlist as Shortlist;
  },

  async getShortlistByJobId(jobId: string): Promise<Shortlist | null> {
    const { data, error } = await supabase
      .from('shortlists')
      .select('*')
      .eq('job_id', jobId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting shortlist:', error);
      return null;
    }

    return data as Shortlist || null;
  },

  async getShortlist(id: string): Promise<Shortlist | null> {
    const { data, error } = await supabase
      .from('shortlists')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting shortlist by id:', error);
      return null;
    }
    return data as Shortlist;
  },

  async updateItemStatus(shortlistId: string, workerId: string, status: ShortlistItemStatus): Promise<boolean> {
    // 1. Get current shortlist
    const shortlist = await shortlistsRepo.getShortlist(shortlistId);
    if (!shortlist) return false;

    // 2. Find and update item locally
    const items = shortlist.items.map(item => {
      if (item.worker_id === workerId) {
        return { ...item, status: status, updated_at: new Date().toISOString() };
      }
      return item;
    });

    // 3. Update DB
    const { error } = await supabase
      .from('shortlists')
      .update({ items: items })
      .eq('id', shortlistId);

    if (error) {
      console.error('Error updating item status:', error);
      return false;
    }
    return true;
  }
};
