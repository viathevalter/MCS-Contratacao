import { supabase } from './supabase';
import { AppConfig } from '../types';

const DEFAULT_CONFIG: AppConfig = {
    job_profiles: [],
    social_security_countries: [],
    previous_companies: [],
    document_types: [],
    languages: []
};

export const configRepo = {
    async getConfig(): Promise<AppConfig> {
        const { data, error } = await supabase
            .from('app_config')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('Error fetching config:', error);
            return DEFAULT_CONFIG;
        }

        return data as AppConfig;
    },

    // Synchronous fallback for basic usage (mocks/initial render) - BEWARE: This returns default/empty immediately
    // Ideally components should use useEffect to fetch.
    getConfigSync(): AppConfig {
        return DEFAULT_CONFIG;
    },

    async updateConfig(updates: Partial<AppConfig>): Promise<AppConfig | null> {
        const { data, error } = await supabase
            .from('app_config')
            .update(updates)
            .eq('id', 1)
            .select()
            .single();

        if (error) {
            console.error('Error updating config:', error);
            return null;
        }

        return data as AppConfig;
    },

    async addItem(key: keyof AppConfig, item: string): Promise<AppConfig | null> {
        const current = await this.getConfig();
        const list = current[key] || [];
        if (!list.includes(item)) {
            return this.updateConfig({
                [key]: [...list, item]
            });
        }
        return current;
    },

    async removeItem(key: keyof AppConfig, item: string): Promise<AppConfig | null> {
        const current = await this.getConfig();
        const list = current[key] || [];
        return this.updateConfig({
            [key]: list.filter(i => i !== item)
        });
    }
};
