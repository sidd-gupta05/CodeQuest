export interface Lab {
  id: string;
  nextAvailable: string;
  timeSlots?: Record<string, string[]>;
  // Add any other properties your lab object might have
}

export interface RouterQuery {
  labId: string;
}
