export const sampleTestCatalog = [
  {
    id: 'test1',
    name: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    duration: '30 min',
    reagents: [
      { reagentId: 'reagent1', quantity: 2, unit: 'ml' },
      { reagentId: 'reagent2', quantity: 1, unit: 'ml' },
    ],
  },
  {
    id: 'test2',
    name: 'COVID-19 PCR Test',
    category: 'Molecular',
    duration: '2 hours',
    reagents: [
      { reagentId: 'reagent3', quantity: 5, unit: 'ml' },
      { reagentId: 'reagent4', quantity: 3, unit: 'ml' },
    ],
  },
  {
    id: 'test3',
    name: 'Urine Analysis',
    category: 'Clinical Chemistry',
    duration: '15 min',
    reagents: [
      { reagentId: 'reagent5', quantity: 1, unit: 'ml' },
      { reagentId: 'reagent1', quantity: 0.5, unit: 'ml' },
    ],
  },
  {
    id: 'test4',
    name: 'Liver Function Test',
    category: 'Clinical Chemistry',
    duration: '45 min',
    reagents: [
      { reagentId: 'reagent2', quantity: 3, unit: 'ml' },
      { reagentId: 'reagent6', quantity: 2, unit: 'ml' },
    ],
  },
];

export const sampleReagentCatalog = [
  {
    id: 'reagent1',
    name: 'Hemoglobin Reagent',
    manufacturer: 'BioTech Labs',
    category: 'Hematology',
  },
  {
    id: 'reagent2',
    name: 'Buffer Solution pH 7.4',
    manufacturer: 'ChemCorp',
    category: 'General',
  },
  {
    id: 'reagent3',
    name: 'PCR Master Mix',
    manufacturer: 'MolecularTech',
    category: 'Molecular',
  },
  {
    id: 'reagent4',
    name: 'DNA Extraction Kit',
    manufacturer: 'GeneticSolutions',
    category: 'Molecular',
  },
  {
    id: 'reagent5',
    name: 'Urine Dipstick Solution',
    manufacturer: 'DiagnosticPlus',
    category: 'Clinical Chemistry',
  },
  {
    id: 'reagent6',
    name: 'Enzyme Substrate',
    manufacturer: 'BioEnzymes Inc',
    category: 'Clinical Chemistry',
  },
];

export const sampleLabInventory = [
  {
    id: 'inv1',
    labId: 'lab1',
    reagentId: 'reagent1',
    quantity: 150,
    unit: 'ml',
    expiryDate: '2024-12-15',
    reorderThreshold: 50,
    batchNumber: 'HB2024001',
  },
  {
    id: 'inv2',
    labId: 'lab1',
    reagentId: 'reagent2',
    quantity: 25,
    unit: 'ml',
    expiryDate: '2024-11-30',
    reorderThreshold: 100,
    batchNumber: 'BUF2024002',
  },
  {
    id: 'inv3',
    labId: 'lab1',
    reagentId: 'reagent3',
    quantity: 200,
    unit: 'ml',
    expiryDate: '2025-03-20',
    reorderThreshold: 75,
    batchNumber: 'PCR2024003',
  },
  {
    id: 'inv4',
    labId: 'lab1',
    reagentId: 'reagent4',
    quantity: 5,
    unit: 'kit',
    expiryDate: '2024-10-25',
    reorderThreshold: 10,
    batchNumber: 'DNA2024004',
  },
  {
    id: 'inv5',
    labId: 'lab1',
    reagentId: 'reagent5',
    quantity: 80,
    unit: 'ml',
    expiryDate: '2025-01-15',
    reorderThreshold: 30,
    batchNumber: 'UR2024005',
  },
  {
    id: 'inv6',
    labId: 'lab1',
    reagentId: 'reagent6',
    quantity: 45,
    unit: 'ml',
    expiryDate: '2024-11-10',
    reorderThreshold: 60,
    batchNumber: 'ENZ2024006',
  },
];

export const sampleCustomReagents = [
  {
    id: 'custom1',
    labId: 'lab1',
    name: 'Custom Antibody Solution',
    description: 'Lab-specific antibody for research',
    quantity: 30,
    unit: 'ml',
    expiryDate: '2024-12-01',
    reorderThreshold: 15,
  },
];
