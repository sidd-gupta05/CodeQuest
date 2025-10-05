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
      bgColor: 'bg-gray-100',
      subtitle: 'Active inventory items',
    },
    {
      title: 'Low Stock Alerts',
      value: lowStock,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      subtitle: 'Require reordering',
    },
    {
      title: 'Expiring Soon',
      value: expiring,
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      subtitle: 'Within 7 days',
    },
    {
      title: 'Tests Available',
      value: tests,
      icon: TestTube,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      subtitle: 'Ready to execute',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {metrics.map((m, idx) => (
        <Card key={idx} className="bg-white border-[#F7F8F9]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-[550px]">{m.title}</CardTitle>
            <div className={`${m.bgColor} rounded-full p-2`}>
              <m.icon className="h-6 w-6 ${m.color}" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-light ${m.color}`}>{m.value}</div>
            <p className="text-xs font-medium text-[#64748B] text-muted-foreground">
              {m.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
