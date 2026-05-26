import { Language } from "@/contexts/LanguageContext";

// Comprehensive translations for all pages
export const t = (key: string, language: Language): string => {
  const keys = key.split('.');
  let value: any = allTranslations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};

const allTranslations = {
  en: {
    common: {
      learnMore: "Learn More →",
      readMore: "Read More →",
      getStarted: "Get Started",
      becomeMember: "Become a Member",
      joinCommunity: "Join the Community",
      submitIssue: "Submit Your Issue",
      callHelpline: "Call Legal Helpline",
      required: "*",
    },
  },
  ta: {
    common: {
      learnMore: "மேலும் அறிக →",
      readMore: "மேலும் படிக்க →",
      getStarted: "தொடங்குங்கள்",
      becomeMember: "உறுப்பினராகுங்கள்",
      joinCommunity: "சமூகத்தில் சேருங்கள்",
      submitIssue: "உங்கள் சிக்கலை சமர்ப்பிக்கவும்",
      callHelpline: "சட்ட உதவி எண்ணை அழைக்கவும்",
      required: "*",
    },
  },
  hi: {
    common: {
      learnMore: "और जानें →",
      readMore: "और पढ़ें →",
      getStarted: "शुरू करें",
      becomeMember: "सदस्य बनें",
      joinCommunity: "समुदाय में शामिल हों",
      submitIssue: "अपनी समस्या जमा करें",
      callHelpline: "कानूनी हेल्पलाइन कॉल करें",
      required: "*",
    },
  },
};

export { allTranslations };
