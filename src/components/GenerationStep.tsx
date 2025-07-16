
import { useState } from "react";
import { Play, Download, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { GenerationJob } from "@/pages/Index";
import { Progress } from "@/components/ui/progress";

type GenerationStepProps = {
  jobs: GenerationJob[];
  onStartGeneration: () => void;
  isReady: boolean;
};

export const GenerationStep = ({
  jobs,
  onStartGeneration,
  isReady,
}: GenerationStepProps) => {
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
    onStartGeneration();
  };

  const handleDownloadVideo = (job: GenerationJob) => {
    if (job.videoUrl) {
      const link = document.createElement('a');
      link.href = job.videoUrl;
      link.download = `video-${job.prospect.firstName}-${job.prospect.lastName}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenLandingPage = (job: GenerationJob) => {
    if (job.landingPageUrl) {
      window.open(job.landingPageUrl, '_blank');
    }
  };

  const handleDownloadAllVideos = () => {
    const completedJobsWithVideos = jobs.filter(job => job.status === 'completed' && job.videoUrl);
    completedJobsWithVideos.forEach((job, index) => {
      setTimeout(() => handleDownloadVideo(job), index * 100);
    });
  };

  const getStatusIcon = (status: GenerationJob['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-500" />;
      case 'processing':
        return <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (status: GenerationJob['status'], progress: number) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        if (progress < 20) return 'Capture du site web...';
        if (progress < 50) return 'Overlay vidéo bulle...';
        if (progress < 80) return 'Concaténation vidéo...';
        return 'Finalisation...';
      case 'completed':
        return 'Terminé';
      case 'error':
        return 'Erreur';
    }
  };

  const getStatusColor = (status: GenerationJob['status']) => {
    switch (status) {
      case 'pending':
        return 'text-gray-600';
      case 'processing':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  const totalJobs = jobs.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Génération des vidéos</h2>
        <p className="text-gray-600">
          {hasStarted 
            ? `Progression: ${completedJobs}/${totalJobs} vidéos générées`
            : "Lancez la génération pour créer vos vidéos personnalisées"
          }
        </p>
      </div>

      {!hasStarted ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Prêt à générer {totalJobs || 0} vidéos
          </h3>
          <p className="text-gray-600 mb-8">
            Chaque vidéo sera personnalisée avec le site web du prospect en arrière-plan
          </p>
          <button
            onClick={handleStart}
            disabled={!isReady}
            className="px-8 py-3 gradient-primary text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            Lancer la génération
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {totalJobs > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">
                  Progression globale
                </span>
                <span className="text-sm text-blue-700">
                  {completedJobs}/{totalJobs}
                </span>
              </div>
              <Progress 
                value={(completedJobs / totalJobs) * 100} 
                className="h-2"
              />
            </div>
          )}

          <div className="grid gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(job.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {job.prospect.firstName} {job.prospect.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {job.prospect.company} • {job.prospect.websiteUrl}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getStatusColor(job.status)}`}>
                        {getStatusText(job.status, job.progress)}
                      </div>
                      {job.status === 'processing' && (
                        <div className="w-24 mt-1">
                          <Progress value={job.progress} className="h-1" />
                        </div>
                      )}
                    </div>
                    
                    {job.status === 'completed' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleDownloadVideo(job)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Télécharger la vidéo"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenLandingPage(job)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Ouvrir la landing page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {job.status === 'error' && (
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600">
                          {job.error || 'Erreur inconnue'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {completedJobs === totalJobs && totalJobs > 0 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Génération terminée !
              </h3>
              <p className="text-green-600 mb-4">
                Toutes vos vidéos ont été générées avec succès
              </p>
              <button 
                onClick={handleDownloadAllVideos}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Télécharger toutes les vidéos
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
