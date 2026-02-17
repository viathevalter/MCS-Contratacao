export interface FileMetadata {
    name: string;
    size: number;
    type: string;
    path?: string;
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
    ddi?: string;
}

export interface StagingFilter {
    limit?: number;
}
