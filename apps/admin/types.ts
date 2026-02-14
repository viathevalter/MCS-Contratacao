
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
}

export interface CandidatePayload {
  location: string;
  documentation: string;
  languages: string[];
  offer: string;
  observations?: string;
  file_meta?: FileMetadata;
  nationality?: string;
  has_driver_license?: boolean;
  european_residence?: string;
  social_security_countries?: string[];
  previous_companies?: string[];
}

export type CandidateStatus = 'new' | 'needs_review' | 'processed' | 'rejected';

export interface CandidateSubmission {
  id: string;
  created_at: string;
  source: 'webform';
  status: CandidateStatus;
  raw_name: string;
  raw_phone: string;
  raw_email?: string;
  raw_payload: CandidatePayload;
  internal_notes?: string;
  ddi?: string; // New field
}

export interface StagingFilter {
  limit?: number;
}

// --- WORKER TYPES ---

export type WorkerStatus = 'active' | 'standby' | 'blocked';

export interface Worker {
  id: string;
  worker_code: string; // E0001
  full_name: string;
  phone: string;
  email?: string;
  location: string;
  documentation_type: string;
  languages: string[];
  profession_primary: string;
  profession_secondary?: string;
  created_at: string;
  source_submission_id?: string;
  tags: string[];
  status: WorkerStatus;
  ddi?: string; // New field
  nationality?: string;
  has_driver_license?: boolean;
  european_residence?: string;
  social_security_countries?: string[];
  previous_companies?: string[];
  job_profiles?: string[];
}

export interface WorkerNote {
  id: string;
  worker_id: string;
  author: string;
  content: string;
  created_at: string;
}

export interface WorkerFilter {
  search?: string;
  status?: WorkerStatus | 'all';
  profession?: string;
}

// --- JOB TYPES ---

export type JobStatus = 'open' | 'paused' | 'closed';
export type JobPriority = 'low' | 'medium' | 'high';

export interface Job {
  id: string;
  job_code: string; // J0001
  title: string;
  profession_required: string;
  quantity: number;
  location_country: string;
  location_city?: string;
  documentation_required: string[];
  languages_required: string[];
  priority: JobPriority;
  status: JobStatus;
  notes?: string;
  created_at: string;
}

// --- SHORTLIST TYPES ---

export type ShortlistItemStatus = 'suggested' | 'contacted' | 'approved' | 'rejected';

export interface ShortlistItem {
  worker_id: string;
  score: number;
  reasons: string[];
  status: ShortlistItemStatus;
  updated_at?: string;
}

export interface Shortlist {
  id: string;
  job_id: string;
  created_at: string;
  created_by: string;
  items: ShortlistItem[];
}

// --- COMMUNICATION TYPES ---

export type CommChannel = 'whatsapp' | 'call' | 'email';

export interface MessageTemplate {
  id: string;
  name: string;
  text: string;
  created_at: string;
}

export interface CommunicationLog {
  id: string;
  entity_type: 'candidate' | 'worker';
  entity_id: string;
  channel: CommChannel;
  template_name?: string;
  message_text: string;
  phone_used?: string;
  email_used?: string;
  created_at: string;
  created_by: string;
}
// Config Types
export interface AppConfig {
  job_profiles: string[];
  social_security_countries: string[];
  previous_companies: string[];
  document_types: string[];
  languages: string[];
}
