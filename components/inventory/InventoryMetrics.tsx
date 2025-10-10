//components/inventory/InventoryMetrics.tsx
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import {
  Package,
  AlertTriangle,
  Clock,
  TestTube,
  TrendingUp,
} from 'lucide-react';

export function InventoryMetrics({
  total,
  lowStock,
  expiring,
  tests,
  averageStock,
}: {
  total: number;
  lowStock: number;
  expiring: number;
  tests: number;
  averageStock?: number;
}) {
  const metrics = [
    {
      title: 'Total Reagents',
      value: total,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      subtitle: 'Active inventory items',
      trend: '+12%',
    },
    {
      title: 'Low Stock Alerts',
      value: lowStock,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      subtitle: 'Require reordering',
      trend: lowStock > 0 ? 'Attention needed' : 'All good',
    },
    {
      title: 'Expiring Soon',
      value: expiring,
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      subtitle: 'Within 7 days',
      trend: expiring > 0 ? 'Urgent' : 'No expiring',
    },
    {
      title: 'Tests Available',
      value: tests,
      icon: TestTube,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      subtitle: 'Ready to execute',
      trend: '+5%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((m, idx) => (
        <Card
          key={idx}
          className={`bg-white border ${m.borderColor} shadow-sm hover:shadow-md transition-all duration-200 rounded-xl`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">
              {m.title}
            </CardTitle>
            <div className={`${m.bgColor} rounded-lg p-2`}>
              <m.icon className={`h-5 w-5 ${m.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
              <div
                className={`text-xs font-medium ${
                  m.value > 0 &&
                  (m.title === 'Low Stock Alerts' ||
                    m.title === 'Expiring Soon')
                    ? 'text-red-500'
                    : 'text-emerald-500'
                }`}
              >
                {m.trend}
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 mt-2">
              {m.subtitle}
            </p>
            {m.title === 'Total Reagents' && averageStock && (
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                Avg: {averageStock} units/item
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
