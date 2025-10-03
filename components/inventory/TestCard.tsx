"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";

interface TestCardProps {
  name: string;
  description?: string;
  status: "available" | "unavailable" | "custom";
}

const statusColors: Record<TestCardProps["status"], string> = {
  available: "bg-green-100 text-green-700",
  unavailable: "bg-red-100 text-red-700",
  custom: "bg-blue-100 text-blue-700",
};

export function TestCard({ name, description, status }: TestCardProps) {
  return (
    <Card className="w-full hover:shadow-md transition">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <FlaskConical className="w-5 h-5 text-primary" />
          {name}
        </CardTitle>
        <Badge className={statusColors[status]}>{status}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description || "No description"}</p>
      </CardContent>
    </Card>
  );
}
