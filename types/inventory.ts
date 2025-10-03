export interface InventoryItem {
  id: string;
  labId: string;
  reagentId: string;
  quantity: number;
  unit: string;
  expiryDate: string; // ISO date string
  reorderThreshold: number;
  batchNumber: string;
}

export interface ReagentDetails {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
}

export interface TestReagentRequirement {
  reagentId: string;
  quantity: number;
  unit: string;
}

export interface TestItem {
  id: string;
  name: string;
  category: string;
  duration: string;
  reagents: TestReagentRequirement[];
}
