import { GenerationJob } from "@/pages/Index";

const STORAGE_KEY = 'videogen_jobs';

export const saveJob = (job: GenerationJob) => {
  const jobs = getAllJobs();
  const existingIndex = jobs.findIndex(j => j.id === job.id);
  
  if (existingIndex >= 0) {
    jobs[existingIndex] = job;
  } else {
    jobs.push(job);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
};

export const getJob = (jobId: string): GenerationJob | null => {
  const jobs = getAllJobs();
  return jobs.find(job => job.id === jobId) || null;
};

export const getAllJobs = (): GenerationJob[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const clearJobs = () => {
  localStorage.removeItem(STORAGE_KEY);
};