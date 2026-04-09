import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "odia" | "hindi";

interface Translations {
  voicePrompt: string;
  scenarioLabel: string;
  greeting: string;
  tapMic: string;
  listening: string;
  analyzing: string;
}

const translationsMap: Record<Language, Translations> = {
  en: {
    voicePrompt: "Tap mic and speak patient symptoms",
    scenarioLabel: "Example scenarios:",
    greeting: "Good morning",
    tapMic: "Tap mic",
    listening: "Listening...",
    analyzing: "Analyzing clinical markers...",
  },
  odia: {
    voicePrompt: "ମାଇକ୍ ଟ୍ୟାପ୍ କରି ରୋଗୀ ଲକ୍ଷଣ କୁହନ୍ତୁ",
    scenarioLabel: "ଉଦାହରଣ ଦୃଶ୍ୟ:",
    greeting: "ଶୁଭ ସକାଳ",
    tapMic: "ମାଇକ୍ ଟ୍ୟାପ୍ କରନ୍ତୁ",
    listening: "ଶୁଣୁଛି...",
    analyzing: "ଚିକିତ୍ସା ଚିହ୍ନ ବିଶ୍ଳେଷଣ...",
  },
  hindi: {
    voicePrompt: "माइक टैप करें और मरीज के लक्षण बोलें",
    scenarioLabel: "उदाहरण परिदृश्य:",
    greeting: "शुभ प्रभात",
    tapMic: "माइक टैप करें",
    listening: "सुन रहा है...",
    analyzing: "नैदानिक संकेतों का विश्लेषण...",
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
