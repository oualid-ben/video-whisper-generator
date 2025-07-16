
import { Check } from "lucide-react";

type Step = {
  number: number;
  title: string;
  description: string;
};

type StepIndicatorProps = {
  steps: Step[];
  currentStep: number;
};

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step.number < currentStep
                  ? "bg-green-500 text-white"
                  : step.number === currentStep
                  ? "gradient-primary text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.number < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            <div className="text-center mt-2">
              <div className={`text-sm font-medium ${
                step.number <= currentStep ? "text-gray-900" : "text-gray-500"
              }`}>
                {step.title}
              </div>
              <div className="text-xs text-gray-500 mt-1 max-w-24">
                {step.description}
              </div>
            </div>
          </div>
          
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-4 transition-colors ${
                step.number < currentStep ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
