import { Language } from "@/contexts/LanguageContext";

export const pagesTranslations = {
  home: {
    heroTitle: {
      en: "Take Control of Your Driving Journey",
      ta: "உங்கள் ஓட்டுநர் பயணத்தை கட்டுப்படுத்துங்கள்",
      hi: "अपनी ड्राइविंग यात्रा पर नियं त्रण रखें"
    },
    heroSubtitle: {
      en: "Join the movement to uplift the lives of India's driving force.",
      ta: "இந்தியாவின் ஓட்டுநர் சக்தியின் வாழ்க்கையை உயர்த்தும் இயக்கத்தில் சேருங்கள்.",
      hi: "भारत की ड्राइविंग शक्ति के जीवन को उन्नत करने के आंदोलन में शामिल हों।"
    },
    heroTagline: {
      en: "Legal Help. Welfare Benefits. Community Support.",
      ta: "சட்ட உதவி. நலன்புரி நன்மைகள். சமூக ஆதரவு.",
      hi: "कानूनी सहायता। कल्याण लाभ। सामुदायिक सहायता।"
    },
    joinCommunity: {
      en: "Join the Community",
      ta: "சமூகத்தில் சேருங்கள்",
      hi: "समुदाय में शामिल हों"
    }
  }
};

export const pt = (key: string, language: Language): string => {
  const keys = key.split('.');
  let value: any = pagesTranslations;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value?.[language] || value?.en || key;
};