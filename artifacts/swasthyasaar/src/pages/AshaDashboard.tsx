import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { StatCard } from "@/components/StatCard";
import { PatientCard } from "@/components/PatientCard";
import { mockPatients } from "@/data/mockData";
import { Mic, Heart, Activity, User, Bell } from "lucide-react";
import { Link } from "wouter";

export default function AshaDashboard() {
  const recentPatients = mockPatients.slice(0, 5);

  return (
    <div className="min-h-screen bg-background flex flex-col fade-in pb-24 md:pb-8">
      <Navbar />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Overview</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Today's Patients" value={12} className="border-l-4 border-l-blue-500" />
          <StatCard title="High Risk Alerts" value={3} className="border-l-4 border-l-destructive relative" 
            valueClassName="text-destructive"
          >
          </StatCard>
          <StatCard title="Pending Referrals" value={2} className="border-l-4 border-l-secondary" />
          <StatCard title="Completed Visits" value={7} className="border-l-4 border-l-success" />
        </div>

        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/voice-assessment">
            <div className="bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover-lift cursor-pointer h-full transition-colors group">
              <div className="bg-primary text-primary-foreground p-3 rounded-full group-active:scale-95 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-primary">Voice Assessment</span>
            </div>
          </Link>
          <Link href="/maternal-check">
            <div className="bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover-lift cursor-pointer h-full transition-colors group dark:bg-rose-950/30 dark:border-rose-900">
              <div className="bg-rose-500 text-white p-3 rounded-full group-active:scale-95 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-rose-600 dark:text-rose-400">Maternal Check</span>
            </div>
          </Link>
          <Link href="/ncd-tracker">
            <div className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover-lift cursor-pointer h-full transition-colors group dark:bg-blue-950/30 dark:border-blue-900">
              <div className="bg-blue-500 text-white p-3 rounded-full group-active:scale-95 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-blue-600 dark:text-blue-400">NCD Check</span>
            </div>
          </Link>
          <Link href="/maternal-check?tab=newborn">
            <div className="bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover-lift cursor-pointer h-full transition-colors group dark:bg-amber-950/30 dark:border-amber-900">
              <div className="bg-amber-500 text-white p-3 rounded-full group-active:scale-95 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-amber-600 dark:text-amber-400">Newborn Check</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Patients</h2>
          <Link href="/patients" className="text-sm text-primary font-semibold hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
