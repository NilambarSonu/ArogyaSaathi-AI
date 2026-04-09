import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { calculateNcdRisk, RiskLevel } from "@/utils/riskScoring";
import { RiskBadge } from "@/components/RiskBadge";
import { Save, AlertTriangle, ArrowRight, Activity, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function NcdTracker() {
  const [activeTab, setActiveTab] = useState("screen");
  const [result, setResult] = useState<{ score: number; level: RiskLevel } | null>(null);

  // Form State
  const [age, setAge] = useState(55);
  const [fastingSugar, setFastingSugar] = useState(130);
  const [bp, setBp] = useState(145);
  const [smoking, setSmoking] = useState(false);
  const [familyHistory, setFamilyHistory] = useState<string[]>(["Diabetes"]);
  const [physicalActivity, setPhysicalActivity] = useState("Low");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const riskResult = calculateNcdRisk({
      age,
      fastingSugar,
      systolicBp: bp,
      smoking,
      familyHistory,
      physicalActivity
    });
    setResult(riskResult);
  };

  const handleFamilyToggle = (item: string) => {
    setFamilyHistory(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    );
  };

  const handleSave = () => {
    toast({
      title: "Screening Saved",
      description: "Patient NCD risk profile updated.",
    });
    setActiveTab("pathway");
  };

  const steps = [
    { id: 1, title: "Initial Screening", status: "completed", icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success" },
    { id: 2, title: "Confirm Diagnosis", status: "in-progress", icon: RefreshCw, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", border: "border-amber-500", desc: "Awaiting PHC lab test results" },
    { id: 3, title: "Treatment Initiation", status: "upcoming", icon: Activity, color: "text-muted-foreground", bg: "bg-muted/50", border: "border-muted" },
    { id: 4, title: "Follow-up Schedule", status: "upcoming", icon: Activity, color: "text-muted-foreground", bg: "bg-muted/50", border: "border-muted" },
    { id: 5, title: "Long-term Management", status: "upcoming", icon: Activity, color: "text-muted-foreground", bg: "bg-muted/50", border: "border-muted" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col fade-in pb-24 md:pb-8">
      <Navbar />
      
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-heading">NCD Management</h1>
          <p className="text-muted-foreground text-sm">Non-Communicable Disease screening and tracking.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-muted/50 p-1">
            <TabsTrigger value="screen" className="rounded-lg text-sm font-semibold">Screen Patient</TabsTrigger>
            <TabsTrigger value="pathway" className="rounded-lg text-sm font-semibold">Care Pathway</TabsTrigger>
          </TabsList>

          <TabsContent value="screen">
            {!result ? (
              <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in">
                <Card className="p-5 shadow-sm border-border">
                  <h3 className="font-semibold text-lg mb-4">Patient Profile & Vitals</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" value={age} onChange={e => setAge(Number(e.target.value))} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sugar">Fasting Sugar (mg/dL)</Label>
                      <Input id="sugar" type="number" value={fastingSugar} onChange={e => setFastingSugar(Number(e.target.value))} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="bp">Systolic BP</Label>
                      <Input id="bp" type="number" value={bp} onChange={e => setBp(Number(e.target.value))} required />
                    </div>
                    <div className="space-y-2 flex flex-col justify-end pb-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="smoke" checked={smoking} onCheckedChange={(checked) => setSmoking(checked as boolean)} />
                        <Label htmlFor="smoke" className="font-medium cursor-pointer text-sm">Current Smoker</Label>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 shadow-sm border-border">
                  <h3 className="font-semibold text-lg mb-4">Risk Factors</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground mb-3 block">Family History</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Diabetes", "Heart Disease", "Stroke"].map(item => (
                          <div key={item} className="flex items-center space-x-2 bg-muted/30 p-2 rounded border border-border/50">
                            <Checkbox 
                              id={`fam-${item}`} 
                              checked={familyHistory.includes(item)}
                              onCheckedChange={() => handleFamilyToggle(item)}
                            />
                            <Label htmlFor={`fam-${item}`} className="text-sm font-medium cursor-pointer flex-1">{item}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground mb-3 block mt-4">Physical Activity</Label>
                      <RadioGroup value={physicalActivity} onValueChange={setPhysicalActivity} className="flex flex-col md:flex-row gap-3">
                        <div className="flex items-center space-x-2 p-3 rounded-md border border-border flex-1">
                          <RadioGroupItem value="Low" id="pa-low" />
                          <Label htmlFor="pa-low" className="font-medium cursor-pointer">Low / Sedentary</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-md border border-border flex-1">
                          <RadioGroupItem value="Medium" id="pa-med" />
                          <Label htmlFor="pa-med" className="font-medium cursor-pointer">Moderate</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-md border border-border flex-1">
                          <RadioGroupItem value="High" id="pa-high" />
                          <Label htmlFor="pa-high" className="font-medium cursor-pointer">Active</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </Card>

                <Button type="submit" className="w-full font-bold h-12 text-md shadow-md hover-lift bg-blue-600 hover:bg-blue-700 text-white">
                  Calculate NCD Risk <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            ) : (
              <Card className="p-6 border-t-4 shadow-lg animate-in slide-in-from-bottom-4"
                    style={{ borderTopColor: result.level === 'CRITICAL' ? 'var(--color-destructive)' : 
                                             result.level === 'HIGH' ? '#f97316' : 
                                             result.level === 'MEDIUM' ? 'var(--color-secondary)' : 
                                             'var(--color-success)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-heading">Screening Result</h3>
                  <RiskBadge level={result.level} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted/30 p-4 rounded-xl border border-border text-center">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Diabetes Risk</p>
                    <p className="text-2xl font-bold font-mono text-foreground">{fastingSugar > 125 ? 'HIGH' : 'ELEVATED'}</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border text-center">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">CVD Risk</p>
                    <p className="text-2xl font-bold font-mono text-foreground">{bp > 140 ? 'HIGH' : 'LOW'}</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-xl border border-border mb-6">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                    {result.level === 'CRITICAL' || result.level === 'HIGH' ? (
                      <><AlertTriangle className="w-4 h-4 text-destructive" /> Action Required</>
                    ) : (
                      <><Activity className="w-4 h-4 text-success" /> Recommendation</>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.level === 'CRITICAL' ? "Immediate referral required. Risk of severe complications." :
                     result.level === 'HIGH' ? "Refer to Medical Officer for diagnosis confirmation and medication initiation." :
                     result.level === 'MEDIUM' ? "Provide lifestyle counseling. Schedule repeat screening in 3 months." :
                     "Low risk. Encourage healthy lifestyle maintenance."}
                  </p>
                </div>

                <Button onClick={handleSave} className="w-full font-bold h-12" size="lg">
                  <Save className="w-4 h-4 mr-2" /> Save & View Pathway
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pathway">
            <Card className="p-5 shadow-sm border-border">
              <div className="mb-6 pb-4 border-b border-border">
                <h3 className="font-bold text-lg mb-1">Raman Babu</h3>
                <p className="text-sm text-muted-foreground">Type 2 Diabetes / Hypertension</p>
              </div>

              <div className="space-y-6">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isLast = idx === steps.length - 1;
                  
                  return (
                    <div key={step.id} className="relative flex items-start gap-4">
                      {!isLast && (
                        <div className={`absolute left-[19px] top-10 bottom-[-24px] w-0.5 ${
                          step.status === 'completed' ? 'bg-success' : 'bg-border'
                        }`}></div>
                      )}
                      
                      <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${step.bg} ${step.border} ${step.color}`}>
                        <Icon className={`w-5 h-5 ${step.status === 'in-progress' ? 'animate-spin-slow' : ''}`} />
                      </div>
                      
                      <div className="pt-2 pb-4 flex-1">
                        <h4 className={`font-bold ${step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {step.title}
                        </h4>
                        {step.desc && (
                          <p className="text-sm text-muted-foreground mt-1 bg-muted/30 p-2 rounded border border-border/50 inline-block">
                            {step.desc}
                          </p>
                        )}
                        {step.status === 'in-progress' && (
                          <Button size="sm" className="mt-3 font-semibold h-8 bg-amber-500 hover:bg-amber-600 text-white">
                            Mark Confirmed
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}
