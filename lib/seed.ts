import { stagingRepo } from './stagingRepo';
import { workersRepo } from './workersRepo';
import { jobsRepo } from './jobsRepo';
import { shortlistsRepo } from './shortlistsRepo';
import { matchEngine } from './matchEngine';
import { CandidateStatus, Worker } from '../types';

const NAMES = [
  "Juan Pérez", "María García", "Carlos López", "Ana Martínez",
  "Luis Rodríguez", "Elena Fernández", "Miguel Sánchez", "Lucía Díaz",
  "David Romero", "Carmen Ruiz", "Javier Torres", "Paula Muñoz",
  "Alejandro Gil", "Sofia Navarro", "Manuel Serrano"
];

const LOCATIONS = [
  "Madrid, España", "Barcelona, España", "Valencia, España",
  "Sevilla, España", "Bilbao, España", "Lisboa, Portugal", "Porto, Portugal"
];

const OFFERS = [
  "SOLDADOR MIG MAG/GMAW/FCAW",
  "TUBERO",
  "ELECTRICISTA",
  "MECÁNICO MONTADOR",
  "PINTOR INDUSTRIAL"
];

const DOCUMENTATION = [
  "Pasaporte de la UE (Europeo)",
  "Permiso de trabajo válido",
  "En trámite / Sin documentos"
];

const STATUSES: CandidateStatus[] = ['new', 'needs_review', 'processed', 'rejected'];

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const seedSubmissions = async (count: number = 15) => {
  for (let i = 0; i < count; i++) {
    const name = getRandom(NAMES);
    const offer = getRandom(OFFERS);
    const status = getRandom(STATUSES);

    // Create base submission
    const submission = await stagingRepo.createSubmission(
      name,
      `+34 600 ${Math.floor(100000 + Math.random() * 900000)}`,
      `${name.toLowerCase().replace(' ', '.')}@example.com`,
      {
        location: getRandom(LOCATIONS),
        documentation: getRandom(DOCUMENTATION),
        languages: ["Español"],
        offer: offer,
        observations: Math.random() > 0.7 ? "Candidato con experiencia previa en sector naval." : undefined
      }
    );

    if (submission) {
      // Update status and date
      const date = randomDate(new Date(2023, 0, 1), new Date());
      // We can't easily force created_at on Supabase unless we use specific admin calls or column is not default now()
      // For now we just update status
      await stagingRepo.updateSubmission(submission.id, {
        status: status,
        // created_at: date.toISOString() // Supabase typically manages created_at, might be immutable
      });
    }
  }
  console.log(`Seeded ${count} submissions`);
};

export const seedWorkers = async (count: number = 10) => {
  for (let i = 0; i < count; i++) {
    const name = getRandom(NAMES);
    const profession = getRandom(OFFERS);

    await workersRepo.createWorker({
      full_name: name,
      phone: `+34 600 ${Math.floor(100000 + Math.random() * 900000)}`,
      location: getRandom(LOCATIONS),
      documentation_type: getRandom(DOCUMENTATION),
      languages: ["Español", Math.random() > 0.5 ? "Inglés B1" : "Portugués"],
      profession_primary: profession,
      tags: ["Demo", "Seeded", profession.split(' ')[0]],
      status: Math.random() > 0.8 ? 'standby' : 'active'
    });
  }
  console.log(`Seeded ${count} workers`);
};

export const seedJobs = async () => {
  // 1. Create Workers first to match against
  await seedWorkers(10);

  // 2. Create Jobs
  for (let i = 0; i < 3; i++) {
    const title = getRandom(OFFERS) + " para proyecto industrial";
    await jobsRepo.createJob({
      title: title,
      profession_required: getRandom(OFFERS),
      quantity: Math.floor(Math.random() * 5) + 1,
      location_country: "España",
      location_city: getRandom(LOCATIONS).split(',')[0],
      documentation_required: [DOCUMENTATION[0]],
      languages_required: ["Español"],
      priority: Math.random() > 0.5 ? 'high' : 'medium',
      status: 'open',
      notes: "Seeded job for testing"
    });
  }

  console.log("Seeded Jobs and Workers");
};

export const seedDatabase = async () => {
  await seedSubmissions(10);
  await seedJobs();
};
