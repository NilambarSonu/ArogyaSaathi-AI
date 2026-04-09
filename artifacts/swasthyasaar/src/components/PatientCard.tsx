import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RiskBadge } from "./RiskBadge";
import { Link } from "wouter";

interface PatientCardProps {
  patient: {
    id: number;
    name: string;
    age: number;
    condition: string;
    village: string;
    riskLevel: string;
    lastVisit: string;
  };
}

export function PatientCard({ patient }: PatientCardProps) {
  return (
    <Link href={`/patient/${patient.id}`}>
      <Card className="p-4 hover-lift cursor-pointer active-scale bg-card hover:bg-muted/50 transition-colors border-border shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{patient.name}</h3>
              <p className="text-xs text-muted-foreground">
                {patient.age} yrs • {patient.village}
              </p>
            </div>
          </div>
          <RiskBadge level={patient.riskLevel} />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-foreground font-medium bg-primary/5 px-2 py-1 rounded-md">
            {patient.condition}
          </span>
          <span className="text-muted-foreground">
            {patient.lastVisit}
          </span>
        </div>
      </Card>
    </Link>
  );
}
