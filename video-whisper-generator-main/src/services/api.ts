
import { 
  ApiResponse, 
  GenerationJob, 
  UploadVideoResponse, 
  UploadCSVResponse,
  GenerateVideosRequest,
  GenerateVideosResponse,
  JobsStatsResponse
} from "@/types/api";

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api' 
  : 'http://localhost:3001/api';

class ApiService {
  private async fetchWithAuth<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Upload vidéo principale ou secondaire
  async uploadVideo(file: File, type: 'main' | 'secondary'): Promise<ApiResponse<UploadVideoResponse>> {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('type', type);

    try {
      const response = await fetch(`${API_BASE_URL}/upload/video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  // Upload fichier CSV
  async uploadCSV(file: File): Promise<ApiResponse<UploadCSVResponse>> {
    const formData = new FormData();
    formData.append('csv', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload/csv`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`CSV upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'CSV upload failed'
      };
    }
  }

  // Lancer la génération des vidéos
  async generateVideos(request: GenerateVideosRequest): Promise<ApiResponse<GenerateVideosResponse>> {
    return this.fetchWithAuth('/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Récupérer tous les jobs
  async getJobs(): Promise<ApiResponse<GenerationJob[]>> {
    return this.fetchWithAuth('/jobs');
  }

  // Récupérer un job spécifique
  async getJob(jobId: string): Promise<ApiResponse<GenerationJob>> {
    return this.fetchWithAuth(`/jobs/${jobId}`);
  }

  // Récupérer les statistiques
  async getJobsStats(): Promise<ApiResponse<JobsStatsResponse>> {
    return this.fetchWithAuth('/jobs/stats');
  }

  // Télécharger une vidéo
  getVideoDownloadUrl(jobId: string): string {
    return `${API_BASE_URL}/videos/${jobId}/download`;
  }

  // URL de la landing page
  getLandingPageUrl(jobId: string): string {
    return `${window.location.origin}/landing/${jobId}`;
  }

  // WebSocket pour les updates en temps réel
  connectToUpdates(onJobUpdate: (job: GenerationJob) => void): WebSocket | null {
    try {
      const wsUrl = API_BASE_URL.replace('http', 'ws').replace('/api', '/ws');
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'job_update') {
            onJobUpdate(data.job);
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return ws;
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      return null;
    }
  }
}

export const apiService = new ApiService();
