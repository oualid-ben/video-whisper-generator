
import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { CSVData } from "@/pages/Index";

type CSVUploadStepProps = {
  csvData: CSVData | null;
  onCSVDataChange: (data: CSVData | null) => void;
};

export const CSVUploadStep = ({ csvData, onCSVDataChange }: CSVUploadStepProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): CSVData => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
    return { headers, data };
  };

  const handleFileSelect = async (file: File) => {
    if (file && file.name.endsWith('.csv')) {
      setIsLoading(true);
      try {
        const text = await file.text();
        const csvData = parseCSV(text);
        onCSVDataChange(csvData);
      } catch (error) {
        console.error('Erreur lors de la lecture du fichier CSV:', error);
      } finally {
        setIsLoading(false);
      }
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

  const removeCSV = () => {
    onCSVDataChange(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Import CSV</h2>
        <p className="text-gray-600">
          Uploadez votre fichier CSV contenant les données des prospects
        </p>
        <span className="text-red-500 text-sm">* Obligatoire</span>
      </div>

      {!csvData ? (
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
          {isLoading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600">Traitement du fichier CSV...</p>
            </div>
          ) : (
            <>
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Glissez votre fichier CSV ici
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
                Le CSV doit contenir: prénom, nom, entreprise, url_site
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
        </div>
      ) : (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold text-green-800">Fichier CSV chargé</h3>
                <p className="text-green-600">{csvData.data.length} prospects trouvés</p>
              </div>
            </div>
            <button
              onClick={removeCSV}
              className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-3">Colonnes détectées:</h4>
            <div className="flex flex-wrap gap-2">
              {csvData.headers.map((header, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {header}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-3">Aperçu des données:</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {csvData.headers.map((header, index) => (
                      <th key={index} className="text-left p-2 font-medium text-gray-700">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.data.slice(0, 3).map((row, index) => (
                    <tr key={index} className="border-b">
                      {csvData.headers.map((header, colIndex) => (
                        <td key={colIndex} className="p-2 text-gray-600">
                          {row[header] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {csvData.data.length > 3 && (
                <p className="text-sm text-gray-500 mt-2">
                  ... et {csvData.data.length - 3} autres lignes
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
