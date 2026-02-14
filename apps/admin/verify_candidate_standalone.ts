
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xxzfaskfqtfnmormiabx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4emZhc2tmcXRmbm1vcm1pYWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTM3MzUsImV4cCI6MjA4NjU4OTczNX0.Izn_TRipX86uH-bOqYVv7eBWVKHqVmxBNDGdXFCp3Yg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifyCandidateCreation() {
    console.log('Starting standalone verification...');

    const testCandidate = {
        raw_name: "Test Script Candidate Standalone",
        raw_phone: "+34 699 999 999",
        raw_email: "test.script.standalone@example.com",
        payload: {
            location: "Madrid, Spain",
            documentation: "Permiso de trabajo válido",
            languages: ["Español", "Inglés"],
            offer: "TUBERO",
            observations: "Created via standalone verification script"
        },
        status: 'new',
        source: 'webform'
    };

    try {
        console.log('Creating candidate directly via Supabase client...');
        const { data: insertedData, error: insertError } = await supabase
            .from('candidates')
            .insert(testCandidate)
            .select()
            .single();

        if (insertError) {
            console.error('❌ Error inserting candidate:', insertError);
            return;
        }

        if (insertedData) {
            console.log('✅ Candidate created successfully!');
            console.log('ID:', insertedData.id);
            console.log('Name:', insertedData.raw_name);

            // Verify by reading back
            console.log('Verifying persistence...');
            const { data: fetchedData, error: fetchError } = await supabase
                .from('candidates')
                .select('*')
                .eq('id', insertedData.id)
                .single();

            if (fetchError) {
                console.error('❌ Failed to retrieve candidate:', fetchError);
            } else if (fetchedData) {
                console.log('✅ Persistence verified! Record found in DB.');
                console.log('DB Record:', fetchedData);

                // Cleanup
                console.log('Cleaning up test data...');
                const { error: deleteError } = await supabase.from('candidates').delete().eq('id', insertedData.id);
                if (deleteError) {
                    console.error('⚠️ Failed to clean up:', deleteError);
                } else {
                    console.log('✅ Test data cleaned up.');
                }

            }
        } else {
            console.error('❌ Failed to create candidate. No data returned.');
        }
    } catch (err) {
        console.error('❌ Exception during verification:', err);
    }
}

verifyCandidateCreation();
