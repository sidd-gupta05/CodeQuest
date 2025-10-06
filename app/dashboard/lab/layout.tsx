// app/dashboard/lab/layout.tsx
import { InventoryContext, InventoryProvider } from '@/app/context/InventoryContext';
import { useContext } from 'react';

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ContextData = useContext(InventoryContext);
  console.log("Inventory Context Data in LabLayout:", ContextData);
  const loading = ContextData?.loading;

  if (loading) {
    //same for now
    return (
      <InventoryProvider>
        {children}
      </InventoryProvider>
    );
  }

  return (
    <InventoryProvider>
      {children}
    </InventoryProvider>
  );
}