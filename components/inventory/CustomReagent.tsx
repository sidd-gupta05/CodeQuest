'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

interface CustomReagentSample {
  id: string;
  labId: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  reorderThreshold: number;
}

interface CustomReagentsProps {
  reagents: CustomReagentSample[];
  selectedLab: string;
  getStockStatus: (
    qty: number,
    threshold: number,
    expiry: string
  ) => { status: string; color: string; icon: React.ElementType };
}

export function CustomReagents({
  reagents,
  selectedLab,
  getStockStatus,
}: CustomReagentsProps) {
  const filtered = reagents.filter((r) => r.labId === selectedLab);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-2xl font-semibold">
            Custom Reagents
          </CardTitle>
          <CardDescription className="font-medium text-[#64748B]">
            Lab-specific reagents and solutions
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((r) => {
              const status = getStockStatus(
                r.quantity,
                r.reorderThreshold,
                r.expiryDate
              );
              const StatusIcon = status.icon;
              return (
                <Card
                  key={r.id}
                  className="border-l-4 border-gray-300 border-l-purple-500"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold">
                        {r.name}
                      </CardTitle>
                      <Badge
                        variant={
                          status.color as
                            | 'default'
                            | 'secondary'
                            | 'destructive'
                            | 'outline'
                        }
                        className="flex items-center"
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <CardDescription className="font-medium text-[#64748B]">
                      {r.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Stock:</span>
                        <p>
                          {r.quantity} {r.unit}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Expiry:</span>
                        <p>{r.expiryDate}</p>
                      </div>
                      <div>
                        <span className="font-medium">Threshold:</span>
                        <p>
                          {r.reorderThreshold} {r.unit}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No custom reagents added yet</p>
              <p className="text-sm">
                Add lab-specific reagents using the button above
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
