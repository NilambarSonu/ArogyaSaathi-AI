import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { calculateMaternalRisk, calculateNewbornRisk, RiskLevel } from "@/utils/riskScoring";
import { RiskBadge } from "@/components/RiskBadge";
import { Save, AlertTriangle, ArrowRight, Activity, Thermometer, Droplet, HeartPulse } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function MaternalCheck() {
  const [activeTab, setActiveTab] = useState("maternal");
  const [maternalResult, setMaternalResult] = useState<{ score: number; level: RiskLevel } | null>(null);
  const [newbornResult, setNewbornResult] = useState<{ score: number; level: RiskLevel } | null>(null);

  // Maternal Form State
  const [mPregWeeks, setMPregWeeks] = useState([20]);
  const [mAge, setMAge] = useState(25);
  const [mHb, setMHb] = useState(11);
  const [mBp, setMBp] = useState(120);
  const [mAnc, setMAnc] = useState("2");
  const [mSymptoms, setMSymptoms] = useState<string[]>([]);
  const [mPrevComp, setMPrevComp] = useState(false);
  const [mDist, setMDist] = useState([5]);

  // Newborn Form State
  const [nAgeDays, setNAgeDays] = useState(3);
  const [nWeight, setNWeight] = useState(2.8);
  const [nFeeding, setNFeeding] = useState("Normal");
  const [nTemp, setNTemp] = useState(37);
  const [nBreath, setNBreath] = useState(40);
  const [nColor, setNColor] = useState("Normal");

  const handleMaternalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateMaternalRisk({
      age: mAge,
      hemoglobin: mHb,
      systolicBp: mBp,
      ancVisits: parseInt(mAnc),
      dangerSigns: mSymptoms,
      previousComplications: mPrevComp,
      distanceToPhc: mDist[0]
    });
    setMaternalResult(result);
  };

  const handleNewbornSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateNewbornRisk({
      ageDays: nAgeDays,
      weight: nWeight,
      feeding: nFeeding,
      temperature: nTemp,
      abnormalBreathing: nBreath > 60 || nBreath < 30,
      skinColor: nColor
    });
    setNewbornResult(result);
  };

  const handleSave = () => {
    toast({
      title: "Record Saved",
      description: "The assessment has been successfully logged.",
    });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMaternalResult(null);
      setNewbornResult(null);
    }, 1000);
  };

  const handleSymptomToggle = (symptom: string) => {
    setMSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const ResultCard = ({ result, type }: { result: { score: number; level: RiskLevel }, type: 'maternal' | 'newborn' }) => (
    <Card className="mt-6 p-6 border-t-4 shadow-lg animate-in slide-in-from-bottom-4"
          style={{ borderTopColor: result.level === 'CRITICAL' ? 'var(--color-destructive)' : 
                                   result.level === 'HIGH' ? '#f97316' : 
                                   result.level === 'MEDIUM' ? 'var(--color-secondary)' : 
                                   'var(--color-success)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold font-heading">Assessment Result</h3>
        <RiskBadge level={result.level} />
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2 text-muted-foreground font-medium">
          <span>Risk Score</span>
          <span className="font-mono">{result.score}/100</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000" 
               style={{ 
                 width: `${Math.min(100, result.score)}%`,
                 backgroundColor: result.level === 'CRITICAL' ? 'var(--color-destructive)' : 
                                  result.level === 'HIGH' ? '#f97316' : 
                                  result.level === 'MEDIUM' ? 'var(--color-secondary)' : 
                                  'var(--color-success)'
               }} />
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
          {result.level === 'CRITICAL' ? "Immediate emergency referral to closest FRU/District Hospital. Do not delay." :
           result.level === 'HIGH' ? "Refer to PHC within 24-48 hours for medical evaluation." :
           result.level === 'MEDIUM' ? "Schedule follow-up visit in 3 days. Monitor symptoms closely." :
           "Continue routine care schedule. Educate on danger signs."}
        </p>
      </div>

      <Button onClick={handleSave} className="w-full font-bold h-12" size="lg">
        <Save className="w-4 h-4 mr-2" /> Save to Patient Record
      </Button>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col fade-in pb-24 md:pb-8">
      <Navbar />
      
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-heading">Health Assessment</h1>
          <p className="text-muted-foreground text-sm">Standard protocol for maternal and neonatal care.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-muted/50 p-1">
            <TabsTrigger value="maternal" className="rounded-lg text-sm font-semibold">Maternal Check</TabsTrigger>
            <TabsTrigger value="newborn" className="rounded-lg text-sm font-semibold">Newborn Check</TabsTrigger>
          </TabsList>

          <TabsContent value="maternal">
            {!maternalResult ? (
              <form onSubmit={handleMaternalSubmit} className="space-y-6 animate-in fade-in">
                <Card className="p-5 shadow-sm border-border">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><HeartPulse className="w-5 h-5 text-rose-500" /> Vitals & Basics</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="m-age">Mother's Age</Label>
                      <Input id="m-age" type="number" value={mAge} onChange={e => setMAge(Number(e.target.value))} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="m-bp">Systolic BP</Label>
                      <Input id="m-bp" type="number" value={mBp} onChange={e => setMBp(Number(e.target.value))} required />
                    </div>
                  </div>

                  <div className="space-y-4 mb-4">
                    <div className="flex justify-between">
                      <Label>Weeks of Pregnancy</Label>
                      <span className="font-mono text-sm text-primary font-bold">{mPregWeeks[0]} wks</span>
                    </div>
                    <Slider value={mPregWeeks} onValueChange={setMPregWeeks} max={42} min={1} step={1} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="m-hb">Hemoglobin (g/dL)</Label>
                      <div className="relative">
                        <Input id="m-hb" type="number" step="0.1" value={mHb} onChange={e => setMHb(Number(e.target.value))} className="pl-8" required />
                        <Droplet className="w-4 h-4 text-red-500 absolute left-3 top-3" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>ANC Visits</Label>
                      <select 
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={mAnc}
                        onChange={e => setMAnc(e.target.value)}
                      >
                        <option value="0">0 visits</option>
                        <option value="1">1 visit</option>
                        <option value="2">2 visits</option>
                        <option value="3">3 visits</option>
                        <option value="4+">4+ visits</option>
                      </select>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 shadow-sm border-border">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-destructive"><AlertTriangle className="w-5 h-5" /> Danger Signs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["Severe Headache", "Swelling (Edema)", "Blurred Vision", "Abdominal Pain", "Vaginal Bleeding", "Reduced Fetal Movement"].map(symptom => (
                      <div key={symptom} className="flex items-center space-x-2 bg-muted/30 p-2 rounded border border-border/50">
                        <Checkbox 
                          id={`sym-${symptom}`} 
                          checked={mSymptoms.includes(symptom)}
                          onCheckedChange={() => handleSymptomToggle(symptom)}
                        />
                        <Label htmlFor={`sym-${symptom}`} className="text-sm font-medium cursor-pointer flex-1">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </Card>

                <Button type="submit" className="w-full font-bold h-12 text-md shadow-md hover-lift">
                  Calculate Maternal Risk <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            ) : (
              <ResultCard result={maternalResult} type="maternal" />
            )}
          </TabsContent>

          <TabsContent value="newborn">
            {!newbornResult ? (
              <form onSubmit={handleNewbornSubmit} className="space-y-6 animate-in fade-in">
                <Card className="p-5 shadow-sm border-border">
                  <h3 className="font-semibold text-lg mb-4">Newborn Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="n-age">Age (Days)</Label>
                      <Input id="n-age" type="number" value={nAgeDays} onChange={e => setNAgeDays(Number(e.target.value))} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="n-weight">Weight (kg)</Label>
                      <Input id="n-weight" type="number" step="0.1" value={nWeight} onChange={e => setNWeight(Number(e.target.value))} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="n-temp">Temperature (°C)</Label>
                      <div className="relative">
                        <Input id="n-temp" type="number" step="0.1" value={nTemp} onChange={e => setNTemp(Number(e.target.value))} className="pl-8" required />
                        <Thermometer className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="n-breath">Breathing Rate (/min)</Label>
                      <Input id="n-breath" type="number" value={nBreath} onChange={e => setNBreath(Number(e.target.value))} required />
                    </div>
                  </div>
                </Card>

                <Card className="p-5 shadow-sm border-border">
                  <h3 className="font-semibold text-lg mb-4 text-primary">Clinical Observations</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground mb-2 block">Feeding Status</Label>
                      <RadioGroup value={nFeeding} onValueChange={setNFeeding} className="flex gap-4">
                        <div className="flex items-center space-x-2 bg-success/10 text-success-foreground p-2 rounded-md border border-success/20 flex-1">
                          <RadioGroupItem value="Normal" id="f-normal" />
                          <Label htmlFor="f-normal" className="font-medium cursor-pointer">Normal</Label>
                        </div>
                        <div className="flex items-center space-x-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 p-2 rounded-md border border-amber-200 dark:border-amber-800 flex-1">
                          <RadioGroupItem value="Reduced" id="f-reduced" />
                          <Label htmlFor="f-reduced" className="font-medium cursor-pointer">Reduced</Label>
                        </div>
                        <div className="flex items-center space-x-2 bg-destructive/10 text-destructive p-2 rounded-md border border-destructive/20 flex-1">
                          <RadioGroupItem value="Not feeding" id="f-none" />
                          <Label htmlFor="f-none" className="font-medium cursor-pointer">Not feeding</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-muted-foreground mb-2 block">Skin Color</Label>
                      <RadioGroup value={nColor} onValueChange={setNColor} className="flex gap-4">
                        <div className="flex items-center space-x-2 p-2 rounded-md border border-border flex-1">
                          <RadioGroupItem value="Normal" id="c-normal" />
                          <Label htmlFor="c-normal" className="font-medium cursor-pointer">Normal (Pink)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-md border border-border flex-1">
                          <RadioGroupItem value="Pale" id="c-pale" />
                          <Label htmlFor="c-pale" className="font-medium cursor-pointer">Pale/Yellow</Label>
                        </div>
                        <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-2 rounded-md border border-blue-200 dark:border-blue-800 flex-1">
                          <RadioGroupItem value="Blue/Cyanotic" id="c-blue" />
                          <Label htmlFor="c-blue" className="font-medium cursor-pointer">Blue/Cyanotic</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </Card>

                <Button type="submit" className="w-full font-bold h-12 text-md shadow-md hover-lift bg-amber-500 hover:bg-amber-600 text-white">
                  Calculate Newborn Risk <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            ) : (
              <ResultCard result={newbornResult} type="newborn" />
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}
