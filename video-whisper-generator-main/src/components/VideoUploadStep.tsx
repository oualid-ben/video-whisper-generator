
import { useState, useRef } from "react";
import { Upload, X, Play, Pause } from "lucide-react";
import { VideoFile } from "@/pages/Index";

type VideoUploadStepProps = {
  title: string;
  description: string;
  video: VideoFile | null;
  onVideoChange: (video: VideoFile | null) => void;
  required: boolean;
};

export const VideoUploadStep = ({
  title,
  description,
  video,
  onVideoChange,
  required,
}: VideoUploadStepProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("video/")) {
      const preview = URL.createObjectURL(file);
      onVideoChange({ file, preview });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeVideo = () => {
    if(video) {
      URL.revokeObjectURL(video.preview);
    }
    onVideoChange(null);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
        {required && <span className="text-red-500 text-sm">* Obligatoire</span>}
      </div>

      {!video ? (
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary hover:bg-primary/5"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Glissez votre vidéo ici
          </h3>
          <p className="text-gray-500 mb-4">
            ou{" "}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-primary hover:underline font-medium"
            >
              parcourez vos fichiers
            </button>
          </p>
          <p className="text-sm text-gray-400">
            Formats supportés: MP4, MOV, AVI (max 100MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
        </div>
      ) : (
        <div className="relative bg-black rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            src={video.preview}
            className="w-full max-h-96 object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            controls={false}
          />
          
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-gray-900" />
              ) : (
                <Play className="w-8 h-8 text-gray-900 ml-1" />
              )}
            </button>
          </div>

          <button
            onClick={removeVideo}
            className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg px-3 py-2 text-white text-sm">
            {video.file.name}
          </div>
        </div>
      )}
    </div>
  );
};
