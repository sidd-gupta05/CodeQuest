import React from 'react';

interface StepperProps {
  currentStep: number;
}

const Stepper = ({ currentStep }: StepperProps) => {
  const steps = [
    { number: 1, title: 'Date & Time' },
    { number: 2, title: 'Test Selection' },
    { number: 3, title: 'Add ons' },
    { number: 4, title: 'Payment' },
    { number: 5, title: 'Confirmation' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-0">
      {/* Small screens: show only active step */}
      <div className="flex items-center justify-center my-8 sm:hidden">
        {steps.map(
          (step) =>
            step.number === currentStep && (
              <div key={step.number} className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-[#37AFA2] text-white">
                  {step.number}
                </div>
                <p className="mt-2 text-xs text-center font-semibold text-white">
                  {step.title}
                </p>
              </div>
            )
        )}
      </div>

      {/* Large screens: full stepper */}
      <div className="hidden sm:flex items-center my-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  step.number <= currentStep
                    ? 'bg-[#37AFA2] text-white'
                    : 'border-2 border-gray-300 text-gray-300'
                }`}
              >
                {step.number}
              </div>
              <p
                className={`mt-2 text-xs sm:text-sm text-center font-semibold transition-all duration-300 ${
                  step.number <= currentStep ? 'text-white' : 'text-gray-300'
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 border-t-2 border-dashed mx-2 sm:mx-4 transition-colors duration-300 ${
                  step.number < currentStep ? 'border-white' : 'border-gray-300'
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
