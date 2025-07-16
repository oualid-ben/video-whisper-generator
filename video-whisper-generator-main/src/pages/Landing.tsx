
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Play, Download, Share2, User, Building, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getJob } from "@/services/jobStorage";
import { GenerationJob } from "@/pages/Index";

const Landing = () => {
  const { jobId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [jobData, setJobData] = useState<GenerationJob | null>(null);

  useEffect(() => {
    if (jobId) {
      const job = getJob(jobId);
      setJobData(job);
    }
  }, [jobId]);

  if (!jobData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vidéo non trouvée</h1>
          <p className="text-gray-600">Cette vidéo n'existe pas ou a été supprimée.</p>
        </div>
      </div>
    );
  }

  const prospectData = {
    firstName: jobData.prospect.firstName,
    lastName: jobData.prospect.lastName,
    company: jobData.prospect.company,
    websiteUrl: jobData.prospect.websiteUrl,
    videoUrl: jobData.videoUrl || '',
    generatedAt: new Date().toLocaleDateString('fr-FR'),
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Vidéo personnalisée pour ${prospectData.firstName} ${prospectData.lastName}`,
          text: `Découvrez cette vidéo personnalisée créée spécialement pour ${prospectData.company}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Vidéo personnalisée
            </h1>
            <p className="text-lg text-gray-600">
              Créée spécialement pour {prospectData.firstName} {prospectData.lastName}
            </p>
          </div>

          {/* Video Player */}
          <Card className="p-8 mb-8 shadow-lg">
            <div className="relative bg-black rounded-xl overflow-hidden mb-6">
              {!isPlaying ? (
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <button
                      onClick={handlePlay}
                      className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all transform hover:scale-110"
                    >
                      <Play className="w-10 h-10 text-gray-900 ml-1" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg px-4 py-2 text-white">
                    <p className="text-sm">Cliquez pour lire la vidéo</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <video
                    src={prospectData.videoUrl}
                    controls
                    autoPlay
                    className="w-full aspect-video"
                    onPlay={() => setIsPlaying(true)}
                  />
                  {/* Simulation de l'overlay info */}
                  <div className="absolute top-4 left-4 bg-black/70 rounded-lg px-3 py-1 text-white text-sm">
                    🎬 Vidéo avec fond {prospectData.company}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = prospectData.videoUrl;
                  link.download = `video-${prospectData.firstName}-${prospectData.lastName}.mp4`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center space-x-2 px-6 py-3 gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="w-5 h-5" />
                <span>Télécharger</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Partager</span>
              </button>
            </div>
          </Card>

          {/* Prospect Info */}
          <Card className="p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Informations du prospect
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium text-gray-900">
                    {prospectData.firstName} {prospectData.lastName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Entreprise</p>
                  <p className="font-medium text-gray-900">{prospectData.company}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Site web</p>
                  <a
                    href={prospectData.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {prospectData.websiteUrl}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-sm text-gray-500 mb-2">
                Vidéo générée le {prospectData.generatedAt} par VideoGen Pro
              </p>
              {jobData.generationInfo && (
                <div className="text-xs text-gray-400">
                  ✓ Fond personnalisé: {jobData.generationInfo.websiteScreenshot}<br/>
                  ✓ Vidéo principale: Overlay bulle<br/>
                  {jobData.generationInfo.secondaryVideoUsed && "✓ Vidéo secondaire: Concaténée"}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;
