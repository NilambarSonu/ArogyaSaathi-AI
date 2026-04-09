import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockReferrals, mockAshas } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { MapPin, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export default function SupervisorDashboard() {
  const criticalReferrals = mockReferrals.filter(r => r.urgency === "CRITICAL" || r.urgency === "HIGH");

  return (
    <div className="min-h-screen bg-background flex flex-col fade-in pb-24 md:pb-8">
      <Navbar role="Block Supervisor" userName="Rajesh Kumar" />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-heading">Block Health Supervisor</h1>
          <p className="text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4" /> Kalahandi District, Odisha
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 border-l-4 border-l-primary bg-card shadow-sm">
            <p className="text-sm text-muted-foreground font-medium">Total Patients</p>
            <p className="text-3xl font-mono font-bold mt-1">47</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-destructive bg-card shadow-sm">
            <p className="text-sm text-muted-foreground font-medium">High Risk Cases</p>
            <p className="text-3xl font-mono font-bold mt-1 text-destructive">12</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-secondary bg-card shadow-sm">
            <p className="text-sm text-muted-foreground font-medium">Active ASHAs</p>
            <p className="text-3xl font-mono font-bold mt-1">4</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-blue-500 bg-card shadow-sm">
            <p className="text-sm text-muted-foreground font-medium">Pending Referrals</p>
            <p className="text-3xl font-mono font-bold mt-1">6</p>
          </Card>
        </div>

        {criticalReferrals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Priority Alerts
            </h2>
            <div className="space-y-3">
              {criticalReferrals.map(referral => (
                <Card key={referral.id} className="p-4 border-l-4 border-destructive shadow-md hover-lift">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{referral.patientName}</h3>
                        <RiskBadge level={referral.urgency} />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">Reason: {referral.reason}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-secondary font-medium">
                          <MapPin className="w-3 h-3" /> {referral.to}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" /> {referral.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button className="flex-1 md:flex-none px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                        View Details
                      </button>
                      <button className="flex-1 md:flex-none px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Ack
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold font-heading mb-4">ASHA Performance (Today)</h2>
            <Card className="overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ASHA Worker</TableHead>
                      <TableHead>Village</TableHead>
                      <TableHead className="text-right">Patients</TableHead>
                      <TableHead className="text-right">High Risk</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAshas.map(asha => (
                      <TableRow key={asha.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{asha.name}</TableCell>
                        <TableCell>{asha.village}</TableCell>
                        <TableCell className="text-right font-mono">{asha.patientsToday}</TableCell>
                        <TableCell className="text-right font-mono">
                          {asha.highRisk > 0 ? (
                            <span className="text-destructive font-bold">{asha.highRisk}</span>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            asha.status === 'Active' 
                              ? 'bg-success/10 text-success' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {asha.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          <div>
            <h2 className="text-lg font-bold font-heading mb-4">District Heatmap</h2>
            <Card className="p-4 shadow-sm h-[calc(100%-2.5rem)] flex flex-col">
              <div className="flex-1 grid grid-cols-2 gap-2 mb-4">
                <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-bold text-destructive mb-1">Junagarh</span>
                  <span className="text-xs text-destructive/80">3 Critical</span>
                </div>
                <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-bold text-destructive mb-1">Phulbani</span>
                  <span className="text-xs text-destructive/80">2 Critical</span>
                </div>
                <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-3 flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-bold text-secondary mb-1">Bhawanipatna</span>
                  <span className="text-xs text-secondary/80">2 High</span>
                </div>
                <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-3 flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-bold text-secondary mb-1">Kesinga</span>
                  <span className="text-xs text-secondary/80">1 High</span>
                </div>
                <div className="bg-success/20 border border-success/30 rounded-lg p-3 flex flex-col justify-center items-center text-center col-span-2">
                  <span className="text-xs font-bold text-success mb-1">Ampani</span>
                  <span className="text-xs text-success/80">Stable</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground flex justify-between px-2 pt-2 border-t border-border">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-destructive"></div> Critical</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-secondary"></div> High</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-success"></div> Stable</span>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
