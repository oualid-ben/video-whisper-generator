
import { useState } from "react";
import { VideoUploadStep } from "@/components/VideoUploadStep";
import { CSVUploadStep } from "@/components/CSVUploadStep";
import { MappingStep } from "@/components/MappingStep";
import { GenerationStep } from "@/components/GenerationStep";
import { Header } from "@/components/Header";
import { StepIndicator } from "@/components/StepIndicator";
import { Card } from "@/components/ui/card";
import { saveJob } from "@/services/jobStorage";

export type VideoFile = {
  file: File;
  preview: string;
};

export type CSVData = {
  headers: string[];
  data: any[];
};

export type MappingConfig = {
  firstName: string;
  lastName: string;
  company: string;
  websiteUrl: string;
};

export type GenerationJob = {
  id: string;
  prospect: {
    firstName: string;
    lastName: string;
    company: string;
    websiteUrl: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  videoUrl?: string;
  landingPageUrl?: string;
  error?: string;
  generationInfo?: {
    mainVideoUsed: boolean;
    secondaryVideoUsed: boolean;
    websiteScreenshot: string;
    generatedAt: string;
  };
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [mainVideo, setMainVideo] = useState<VideoFile | null>(null);
  const [secondaryVideo, setSecondaryVideo] = useState<VideoFile | null>(null);
  const [csvData, setCSVData] = useState<CSVData | null>(null);
  const [mappingConfig, setMappingConfig] = useState<MappingConfig | null>(null);
  const [generationJobs, setGenerationJobs] = useState<GenerationJob[]>([]);

  const steps = [
    { number: 1, title: "Vidéo principale", description: "Votre présentation personnalisée" },
    { number: 2, title: "Vidéo secondaire", description: "Contenu complémentaire (optionnel)" },
    { number: 3, title: "Import CSV", description: "Données des prospects" },
    { number: 4, title: "Configuration", description: "Mapping des colonnes" },
    { number: 5, title: "Génération", description: "Création des vidéos" }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 1: return mainVideo !== null;
      case 2: return true; // Optional step
      case 3: return csvData !== null;
      case 4: return mappingConfig !== null;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startGeneration = () => {
    if (!csvData || !mappingConfig || !mainVideo) return;

    const jobs: GenerationJob[] = csvData.data.map((row, index) => ({
      id: `job-${index}`,
      prospect: {
        firstName: row[mappingConfig.firstName] || '',
        lastName: row[mappingConfig.lastName] || '',
        company: row[mappingConfig.company] || '',
        websiteUrl: row[mappingConfig.websiteUrl] || '',
      },
      status: 'pending',
      progress: 0,
    }));

    setGenerationJobs(jobs);
    
    // Simulate video generation process
    jobs.forEach((job, index) => {
      setTimeout(() => {
        // Étape 1: Capture du site web
        setGenerationJobs(prev => 
          prev.map(j => j.id === job.id ? { 
            ...j, 
            status: 'processing', 
            progress: 15 
          } : j)
        );
        
        setTimeout(() => {
          // Étape 2: Overlay de la vidéo bulle
          setGenerationJobs(prev => 
            prev.map(j => j.id === job.id ? { 
              ...j, 
              progress: 40 
            } : j)
          );
          
          setTimeout(() => {
            // Étape 3: Concaténation vidéo secondaire (si elle existe)
            const hasSecondaryVideo = secondaryVideo !== null;
            const progressStep = hasSecondaryVideo ? 70 : 90;
            
            setGenerationJobs(prev => 
              prev.map(j => j.id === job.id ? { 
                ...j, 
                progress: progressStep 
              } : j)
            );
            
            setTimeout(() => {
              // Étape finale: Génération terminée
              const completedJob = {
                ...job,
                status: 'completed' as const,
                progress: 100,
                // Simuler une vidéo générée avec overlay + fond du site
                videoUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
                landingPageUrl: `/landing/${job.id}`
              };
              
              setGenerationJobs(prev => 
                prev.map(prevJob => prevJob.id === job.id ? completedJob : prevJob)
              );
              
              // Sauvegarder le job avec les infos de génération
              saveJob({
                ...completedJob,
                generationInfo: {
                  mainVideoUsed: true,
                  secondaryVideoUsed: secondaryVideo !== null,
                  websiteScreenshot: job.prospect.websiteUrl,
                  generatedAt: new Date().toISOString()
                }
              });
            }, hasSecondaryVideo ? 2000 : 1000);
          }, 1500);
        }, 1000);
      }, index * 500);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Générateur de Vidéos Personnalisées
            </h1>
            <p className="text-lg text-gray-600">
              Créez des vidéos uniques pour chaque prospect en quelques clics
            </p>
          </div>

          <StepIndicator steps={steps} currentStep={currentStep} />

          <Card className="p-8 mt-8 shadow-lg">
            {currentStep === 1 && (
              <VideoUploadStep
                title="Vidéo principale"
                description="Uploadez votre vidéo de présentation qui sera superposée sur le site du prospect"
                video={mainVideo}
                onVideoChange={setMainVideo}
                required
              />
            )}

            {currentStep === 2 && (
              <VideoUploadStep
                title="Vidéo secondaire (optionnelle)"
                description="Ajoutez une vidéo complémentaire qui sera concaténée après la première"
                video={secondaryVideo}
                onVideoChange={setSecondaryVideo}
                required={false}
              />
            )}

            {currentStep === 3 && (
              <CSVUploadStep
                csvData={csvData}
                onCSVDataChange={setCSVData}
              />
            )}

            {currentStep === 4 && csvData && (
              <MappingStep
                csvHeaders={csvData.headers}
                mappingConfig={mappingConfig}
                onMappingChange={setMappingConfig}
              />
            )}

            {currentStep === 5 && (
              <GenerationStep
                jobs={generationJobs}
                onStartGeneration={startGeneration}
                isReady={!!mappingConfig && !!csvData && !!mainVideo}
              />
            )}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Précédent
              </button>
              
              {currentStep < 5 && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="px-8 py-2 gradient-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  Suivant →
                </button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
