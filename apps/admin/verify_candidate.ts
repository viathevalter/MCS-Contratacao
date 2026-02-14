
import { stagingRepo } from './lib/stagingRepo';
import { supabase } from './lib/supabase';

async function verifyCandidateCreation() {
    console.log('Starting verification...');

    const testCandidate = {
        name: "Test Script Candidate",
        phone: "+34 699 999 999",
        email: "test.script@example.com",
        payload: {
            location: "Madrid, Spain",
            documentation: "Permiso de trabajo válido",
            languages: ["Español", "Inglés"],
            offer: "TUBERO",
            observations: "Created via verification script"
        }
    };

    try {
        console.log('Creating candidate...');
        const result = await stagingRepo.createSubmission(
            testCandidate.name,
            testCandidate.phone,
            testCandidate.email,
            testCandidate.payload
        );

        if (result && result.id) {
            console.log('✅ Candidate created successfully!');
            console.log('ID:', result.id);
            console.log('Name:', result.raw_name);

            // Verify by reading back
            console.log('Verifying persistence...');
            const { data, error } = await supabase
                .from('candidates')
                .select('*')
                .eq('id', result.id)
                .single();

            if (error) {
                console.error('❌ Failed to retrieve candidate:', error);
            } else if (data) {
                console.log('✅ Persistence verified! Record found in DB.');
                console.log('DB Record:', data);

                // Cleanup
                console.log('Cleaning up test data...');
                await supabase.from('candidates').delete().eq('id', result.id);
                console.log('✅ Test data cleaned up.');
            }
        } else {
            console.error('❌ Failed to create candidate. Result was null or missing ID.');
        }
    } catch (err) {
        console.error('❌ Exception during verification:', err);
    }
}

verifyCandidateCreation();
