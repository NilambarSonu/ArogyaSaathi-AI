import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "odia" | "hindi";

interface Translations {
  voicePrompt: string;
  scenarioLabel: string;
  greeting: string;
  tapMic: string;
  listening: string;
  analyzing: string;
  triageStep1: string;
  triageListen: string;
  analyzingRisk: string;
  disclaimer: string;
  riskSupport: string;
}

const translationsMap: Record<Language, Translations> = {
  en: {
    voicePrompt: "Tap mic and speak patient symptoms",
    scenarioLabel: "Example scenarios:",
    greeting: "Good morning",
    tapMic: "Tap mic",
    listening: "Listening...",
    analyzing: "Analyzing clinical markers...",
    triageStep1: "What is the main issue today?",
    triageListen: "Listen",
    analyzingRisk: "Identifying danger signs...",
    disclaimer: "AI is assisting ASHA worker based on standard maternal / newborn danger sign protocols. Final action should follow PHC / government protocol.",
    riskSupport: "Clinical Support Risk Assessment",
  },
  odia: {
    voicePrompt: "ମାଇକ୍ ଟ୍ୟାପ୍ କରି ରୋଗୀ ଲକ୍ଷଣ କୁହନ୍ତୁ",
    scenarioLabel: "ଉଦାହରଣ ଦୃଶ୍ୟ:",
    greeting: "ଶୁଭ ସକାଳ",
    tapMic: "ମାଇକ୍ ଟ୍ୟାପ୍ କରନ୍ତୁ",
    listening: "ଶୁଣୁଛି...",
    analyzing: "ଚିକିତ୍ସା ଚିହ୍ନ ବିଶ୍ଳେଷଣ...",
    triageStep1: "ଆଜିର ମୁଖ୍ୟ ସମସ୍ୟା କଣ?",
    triageListen: "ଶୁଣନ୍ତୁ",
    analyzingRisk: "ବିପଦ ଚିହ୍ନ ଚିହ୍ନଟ ହେଉଛି...",
    disclaimer: "ଏଆଇ ଆଶା କର୍ମୀଙ୍କୁ ମାର୍ଗଦର୍ଶନ କରୁଛି। ଚୂଡ଼ାନ୍ତ ନିଷ୍ପତ୍ତି ଡାକ୍ତରୀ ପରାମର୍ଶ ଉପରେ ଆଧାରିତ ହେବା ଉଚିତ।",
    riskSupport: "ଚିକିତ୍ସା ସହାୟତା",
  },
  hindi: {
    voicePrompt: "माइक टैप करें और मरीज के लक्षण बोलें",
    scenarioLabel: "उदाहरण परिदृश्य:",
    greeting: "शुभ प्रभात",
    tapMic: "माइक टैप करें",
    listening: "सुन रहा है...",
    analyzing: "नैदानिक संकेतों का विश्लेषण...",
    triageStep1: "आज मुख्य समस्या क्या है?",
    triageListen: "सुनें",
    analyzingRisk: "खतरे के संकेतों की पहचान...",
    disclaimer: "एआई एएनएम/आशा की मदद कर रहा है। अंतिम निर्णय सरकारी प्रोटोकॉल के अनुसार होना चाहिए।",
    riskSupport: "नैदानिक ​​​​सहायता",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translationsMap.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translationsMap[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
