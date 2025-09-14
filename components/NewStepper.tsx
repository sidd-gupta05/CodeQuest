import { Stepper, Step, StepLabel } from "@mui/material";
import { Check, Clock, Circle, FileText } from "lucide-react";

export type ReportStatus =
  | "TEST_BOOKED"
  | "SAMPLE_COLLECTED"
  | "IN_LAB"
  | "UNDER_REVIEW"
  | "REPORT_READY";

const steps: { key: ReportStatus; label: string }[] = [
  { key: "TEST_BOOKED", label: "Test Booked" },
  { key: "SAMPLE_COLLECTED", label: "Sample Collected" },
  { key: "IN_LAB", label: "In Lab" },
  { key: "UNDER_REVIEW", label: "Under Review" },
  { key: "REPORT_READY", label: "Report Ready" },
];

export function NewStepper({ status }: { status: ReportStatus | String }) {
  const currentStepIndex = steps.findIndex((s) => s.key === status);

  return (
    <Stepper
      activeStep={currentStepIndex}
      alternativeLabel
      sx={{
        "& .MuiStepConnector-line": {
          borderColor: "#e5e7eb",
        },
        "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line, & .MuiStepConnector-root.Mui-completed .MuiStepConnector-line":
        {
          borderColor: "#178087",
        },
      }}
    >
      {steps.map((step, idx) => (
        <Step key={step.key}>
          <StepLabel
            StepIconComponent={(props) => {
              if (step.key === "REPORT_READY" && props.active) {
                return <FileText className="w-5 h-5 text-green-600" />;
              }
              if (props.completed)
                return <Check className="w-5 h-5 text-[#178087]" />;
              if (props.active)
                return (
                  <Clock className="w-5 h-5 text-[#178087] animate-pulse" />
                );
              return <Circle className="w-5 h-5 text-gray-400" />;
            }}
          >
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
