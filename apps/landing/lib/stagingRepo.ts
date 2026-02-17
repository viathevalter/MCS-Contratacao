import { supabase } from './supabase';
import { CandidateSubmission, StagingFilter } from './types';

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
    async uploadFile(file: File): Promise<string | null> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage
            .from('applications')
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading file:', error);
            return null;
        }

        return filePath;
    }
};
