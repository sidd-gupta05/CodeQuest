import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, Clock, TestTube } from 'lucide-react';

export function InventoryMetrics({
  total,
  lowStock,
  expiring,
  tests,
}: {
  total: number;
  lowStock: number;
  expiring: number;
  tests: number;
}) {
  const metrics = [
    {
      title: 'Total Reagents',
      value: total,
      icon: Package,
      color: 'text-gray-800',
      subtitle: 'Active inventory items',
    },
    {
      title: 'Low Stock Alerts',
      value: lowStock,
      icon: AlertTriangle,
      color: 'text-orange-600',
      subtitle: 'Require reordering',
    },
    {
      title: 'Expiring Soon',
      value: expiring,
      icon: Clock,
      color: 'text-red-600',
      subtitle: 'Within 7 days',
    },
    {
      title: 'Tests Available',
      value: tests,
      icon: TestTube,
      color: 'text-green-600',
      subtitle: 'Ready to execute',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {metrics.map((m, idx) => (
        <Card key={idx} className="bg-white border-[#F7F8F9]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-md font-[550px]">{m.title}</CardTitle>
            <m.icon className="h-4 w-4 text-muted-foreground font-[#F7F8F9]" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-light ${m.color}`}>{m.value}</div>
            <p className="text-xs font-medium text-[#64748B] text-muted-foreground font-[#F7F8F9]">
              {m.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
