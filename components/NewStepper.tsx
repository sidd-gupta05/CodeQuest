// import { Stepper, Step, StepLabel } from "@mui/material";
// import { Check, Clock, Circle, FileText } from "lucide-react";

// export type ReportStatus =
//   | "TEST_BOOKED"
//   | "SAMPLE_COLLECTED"
//   | "IN_LAB"
//   | "UNDER_REVIEW"
//   | "REPORT_READY";

// const steps: { key: ReportStatus; label: string }[] = [
//   { key: "TEST_BOOKED", label: "Test Booked" },
//   { key: "SAMPLE_COLLECTED", label: "Sample Collected" },
//   { key: "IN_LAB", label: "In Lab" },
//   { key: "UNDER_REVIEW", label: "Under Review" },
//   { key: "REPORT_READY", label: "Report Ready" },
// ];

// export function NewStepper({ status }: { status: ReportStatus | String }) {
//   const currentStepIndex = steps.findIndex((s) => s.key === status);

//   return (
//     <Stepper
//       activeStep={currentStepIndex}
//       alternativeLabel
//       sx={{
//         "& .MuiStepConnector-line": {
//           borderColor: "#e5e7eb",
//         },
//         "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line, & .MuiStepConnector-root.Mui-completed .MuiStepConnector-line":
//         {
//           borderColor: "#178087",
//         },
//       }}
//     >
//       {steps.map((step, idx) => (
//         <Step key={step.key}>
//           <StepLabel
//             StepIconComponent={(props) => {
//               if (step.key === "REPORT_READY" && props.active) {
//                 return <FileText className="w-5 h-5 text-green-600" />;
//               }
//               if (props.completed)
//                 return <Check className="w-5 h-5 text-[#178087]" />;
//               if (props.active)
//                 return (
//                   <Clock className="w-5 h-5 text-[#178087] animate-pulse" />
//                 );
//               return <Circle className="w-5 h-5 text-gray-400" />;
//             }}
//           >
//             {step.label}
//           </StepLabel>
//         </Step>
//       ))}
//     </Stepper>
//   );
// }






//Stepper with real-time updates & animations
"use client";

import { Stepper, Step, StepLabel } from "@mui/material";
import { Check, Clock, Circle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export function NewStepper({ status }: { status: ReportStatus | string }) {
  const currentStepIndex = steps.findIndex((s) => s.key === status);

  return (
    <Stepper
      activeStep={currentStepIndex}
      alternativeLabel
      sx={{
        "& .MuiStepConnector-line": {
          borderColor: "#e5e7eb",
          transition: "border-color 0.4s ease",
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
              return (
                <AnimatePresence mode="wait">
                  {props.completed ? (
                    <motion.div
                      key="completed"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="w-5 h-5 text-[#178087]" />
                    </motion.div>
                  ) : props.active ? (
                    <motion.div
                      key="active"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {step.key === "REPORT_READY" ? (
                        <FileText className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-[#178087]" />
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="inactive"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Circle className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            }}
          >
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
