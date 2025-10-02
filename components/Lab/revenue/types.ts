export type Booking = {
  id: string;
  bookingId: string;
  date: string;
  totalAmount: number;
  status: string;
  patientId: string;
  labId: string;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  monthlySalary: number;
  department: string;
};

export type MonthlyFinancials = {
  month: string;
  year: number;
  revenue: number;
  operatingCosts: number;
  employeeCosts: number;
  equipmentCosts: number;
  inventoryCosts: number;
  netProfit: number;
  appointmentCount: number;
};

export type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};
