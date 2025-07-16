
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Download, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  Users,
  PlayCircle
} from "lucide-react";
import { GenerationJob } from "@/pages/Index";

const Dashboard = () => {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    processing: 0,
    pending: 0,
    errors: 0
  });

  useEffect(() => {
    // Simuler des données - en réalité, ces données viendraient de l'API
    const mockJobs: GenerationJob[] = [
      {
        id: "job-1",
        prospect: {
          firstName: "Jean",
          lastName: "Dupont",
          company: "TechCorp Solutions",
          websiteUrl: "https://techcorp-solutions.com"
        },
        status: "completed",
        progress: 100,
        videoUrl: "/api/videos/job-1.mp4",
        landingPageUrl: "/landing/job-1"
      },
      {
        id: "job-2",
        prospect: {
          firstName: "Marie",
          lastName: "Martin",
          company: "InnovateLab",
          websiteUrl: "https://innovatelab.fr"
        },
        status: "processing",
        progress: 65
      },
      {
        id: "job-3",
        prospect: {
          firstName: "Pierre",
          lastName: "Bernard",
          company: "DigitalFlow",
          websiteUrl: "https://digitalflow.com"
        },
        status: "pending",
        progress: 0
      },
      {
        id: "job-4",
        prospect: {
          firstName: "Sophie",
          lastName: "Dubois",
          company: "WebStudio",
          websiteUrl: "https://webstudio.net"
        },
        status: "error",
        progress: 0,
        error: "Site web inaccessible"
      }
    ];

    setJobs(mockJobs);

    // Calculer les statistiques
    const newStats = {
      total: mockJobs.length,
      completed: mockJobs.filter(j => j.status === 'completed').length,
      processing: mockJobs.filter(j => j.status === 'processing').length,
      pending: mockJobs.filter(j => j.status === 'pending').length,
      errors: mockJobs.filter(j => j.status === 'error').length
    };
    setStats(newStats);
  }, []);

  const getStatusBadge = (status: GenerationJob['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">En attente</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">En cours</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Terminé</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
    }
  };

  const getStatusIcon = (status: GenerationJob['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'processing':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
          <p className="text-gray-600">Suivez vos générations de vidéos en temps réel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Terminées</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En cours</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <PlayCircle className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Erreurs</p>
                <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </div>

        {/* Jobs List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Générations récentes</h2>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(job.status)}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {job.prospect.firstName} {job.prospect.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {job.prospect.company} • {job.prospect.websiteUrl}
                    </p>
                    {job.error && (
                      <p className="text-sm text-red-600 mt-1">{job.error}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {getStatusBadge(job.status)}
                  
                  {job.status === 'processing' && (
                    <div className="w-24">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{job.progress}%</p>
                    </div>
                  )}

                  {job.status === 'completed' && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={job.videoUrl} download>
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={job.landingPageUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
