
// Types partagés entre frontend et backend

export interface Prospect {
  firstName: string;
  lastName: string;
  company: string;
  websiteUrl: string;
}

export interface VideoFile {
  file: File;
  preview: string;
}

export interface CSVData {
  headers: string[];
  data: Record<string, string>[];
}

export interface MappingConfig {
  firstName: string;
  lastName: string;
  company: string;
  websiteUrl: string;
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface GenerationJob {
  id: string;
  prospect: Prospect;
  status: JobStatus;
  progress: number;
  videoUrl?: string;
  landingPageUrl?: string;
  error?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API Endpoints Types
export interface UploadVideoResponse {
  videoId: string;
  url: string;
  duration: number;
  size: number;
}

export interface UploadCSVResponse {
  csvId: string;
  headers: string[];
  rowCount: number;
  preview: Record<string, string>[];
}

export interface GenerateVideosRequest {
  mainVideoId: string;
  secondaryVideoId?: string;
  csvId: string;
  mapping: MappingConfig;
}

export interface GenerateVideosResponse {
  batchId: string;
  jobIds: string[];
  estimatedTime: number;
}

export interface JobsStatsResponse {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  errors: number;
}
