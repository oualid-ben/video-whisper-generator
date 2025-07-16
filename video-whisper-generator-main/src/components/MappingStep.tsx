
import { useState, useEffect } from "react";
import { ArrowRight, User, Building, Globe } from "lucide-react";
import { MappingConfig } from "@/pages/Index";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type MappingStepProps = {
  csvHeaders: string[];
  mappingConfig: MappingConfig | null;
  onMappingChange: (config: MappingConfig | null) => void;
};

export const MappingStep = ({
  csvHeaders,
  mappingConfig,
  onMappingChange,
}: MappingStepProps) => {
  const [localConfig, setLocalConfig] = useState<Partial<MappingConfig>>({});

  useEffect(() => {
    // Auto-detect probable mappings
    const autoMapping: Partial<MappingConfig> = {};
    
    csvHeaders.forEach(header => {
      const lowerHeader = header.toLowerCase();
      if (lowerHeader.includes('prenom') || lowerHeader.includes('firstname') || lowerHeader.includes('first_name')) {
        autoMapping.firstName = header;
      } else if (lowerHeader.includes('nom') || lowerHeader.includes('lastname') || lowerHeader.includes('last_name')) {
        autoMapping.lastName = header;
      } else if (lowerHeader.includes('entreprise') || lowerHeader.includes('company') || lowerHeader.includes('societe')) {
        autoMapping.company = header;
      } else if (lowerHeader.includes('url') || lowerHeader.includes('site') || lowerHeader.includes('website')) {
        autoMapping.websiteUrl = header;
      }
    });
    
    setLocalConfig(autoMapping);
  }, [csvHeaders]);

  useEffect(() => {
    if (localConfig.firstName && localConfig.lastName && localConfig.company && localConfig.websiteUrl) {
      onMappingChange(localConfig as MappingConfig);
    } else {
      onMappingChange(null);
    }
  }, [localConfig, onMappingChange]);

  const mappingFields = [
    {
      key: 'firstName' as keyof MappingConfig,
      label: 'Prénom',
      icon: User,
      description: 'Le prénom du prospect'
    },
    {
      key: 'lastName' as keyof MappingConfig,
      label: 'Nom',
      icon: User,
      description: 'Le nom de famille du prospect'
    },
    {
      key: 'company' as keyof MappingConfig,
      label: 'Entreprise',
      icon: Building,
      description: 'Le nom de l\'entreprise'
    },
    {
      key: 'websiteUrl' as keyof MappingConfig,
      label: 'URL du site',
      icon: Globe,
      description: 'L\'URL du site web pour la capture d\'écran'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuration du mapping</h2>
        <p className="text-gray-600">
          Associez les colonnes de votre CSV aux champs requis
        </p>
      </div>

      <div className="grid gap-6">
        {mappingFields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{field.label}</h3>
                    <p className="text-sm text-gray-600">{field.description}</p>
                  </div>
                </div>
                
                <ArrowRight className="w-5 h-5 text-gray-400" />
                
                <div className="min-w-48">
                  <Select
                    value={localConfig[field.key] || ''}
                    onValueChange={(value) => {
                      setLocalConfig(prev => ({
                        ...prev,
                        [field.key]: value
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une colonne" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvHeaders.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {mappingConfig && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <h3 className="font-semibold text-green-800 mb-3">Configuration validée ✓</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {mappingFields.map((field) => (
              <div key={field.key} className="flex justify-between">
                <span className="text-green-700">{field.label}:</span>
                <span className="font-medium text-green-800">{mappingConfig[field.key]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
