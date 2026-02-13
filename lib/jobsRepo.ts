import { supabase } from './supabase';
import { Job } from '../types';

export const jobsRepo = {
  async createJob(data: Omit<Job, 'id' | 'job_code' | 'created_at'>): Promise<Job | null> {
    // Generate job_code (J0001) using a simple count query
    const { count } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
    const nextCode = `J${((count || 0) + 1).toString().padStart(4, '0')}`;

    const { data: job, error } = await supabase
      .from('jobs')
      .insert({
        ...data,
        job_code: nextCode
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating job:', error);
      return null;
    }

    return job as Job;
  },

  async listJobs(): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error listing jobs:', error);
      return [];
    }

    return data as Job[];
  },

  async getJob(id: string): Promise<Job | null> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting job:', error);
      return null;
    }

    return data as Job;
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating job:', error);
      return null;
    }

    return data as Job;
  },

  async deleteJob(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting job:', error);
      return false;
    }
    return true;
  }
};
