import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { X } from "lucide-react";

interface TermsModalProps {
  open: boolean;
  onAccept: () => void;
  onClose: () => void;
}

const termsContent = {
  en: {
    title: "Terms & Conditions – All India Drivers Munetra Kazhagam (AIDriversMK)",
    acceptButton: "I read and accept",
    sections: [
      {
        title: "1. Voluntary Membership",
        content: "I am joining AIDriversMK of my own free will, with full consciousness and sound mind."
      },
      {
        title: "2. Accuracy of Information",
        content: "All information and documents (photo, Driving License, Aadhaar card, address proof, etc.) submitted by me are true, correct, and complete. False or misleading details may result in rejection, suspension, or termination."
      },
      {
        title: "3. Document Submission",
        content: "I willingly upload my photograph, Aadhaar card, and Driving License for verification. I authorize AIDriversMK to verify documents with Government authorities when required."
      },
      {
        title: "4. Consent for Data Processing",
        content: "I give full consent for AIDriversMK to collect, store, process, and use my data for membership registration, identity verification, welfare scheme guidance, communication, and compliance."
      },
      {
        title: "5. No Guarantee of Government Benefits",
        content: "AIDriversMK is not a Government authority and does not guarantee approval of any welfare scheme, subsidy, or benefit."
      },
      {
        title: "6. Limitation of Liability",
        content: "AIDriversMK shall not be responsible for:\n- Government rejections\n- Errors in schemes or delays\n- Damages caused by incorrect information provided by me\n- Technical failures beyond its control"
      },
      {
        title: "7. Membership Suspension",
        content: "AIDriversMK may suspend or terminate membership for false information, forged documents, misuse, or misconduct."
      },
      {
        title: "8. Communication Consent",
        content: "I agree to receive SMS, WhatsApp messages, phone calls, and emails for official communication."
      },
      {
        title: "9. Legal Acceptance",
        content: "By submitting this form, I confirm I have read, understood, and voluntarily accept all Terms & Conditions."
      }
    ]
  },
  ta: {
    title: "உறுப்பினர் நிபந்தனைகள் – All India Drivers Munetra Kazhagam (AIDriversMK)",
    acceptButton: "நான் படித்து ஏற்றுக்கொள்கிறேன்",
    sections: [
      {
        title: "1. தன்னார்வ உறுப்பினர்",
        content: "நான் முழு உணர்வுடனும் நல்ல மனநிலையுடனும் என் சொந்த விருப்பத்தின் பேரில் AIDriversMK இல் சேர்கிறேன்."
      },
      {
        title: "2. தகவல் துல்லியம்",
        content: "நான் சமர்ப்பித்த அனைத்து தகவல்கள் மற்றும் ஆவணங்கள் (புகைப்படம், ஓட்டுநர் உரிமம், ஆதார் அட்டை, முகவரி சான்று போன்றவை) உண்மையானவை, சரியானவை மற்றும் முழுமையானவை. தவறான அல்லது தவறான விவரங்கள் நிராகரிப்பு, இடைநிறுத்தம் அல்லது நிறுத்தத்திற்கு வழிவகுக்கும்."
      },
      {
        title: "3. ஆவண சமர்ப்பிப்பு",
        content: "சரிபார்ப்புக்காக என் புகைப்படம், ஆதார் அட்டை மற்றும் ஓட்டுநர் உரிமத்தை தானாக பதிவேற்றுகிறேன். தேவைப்படும்போது அரசாங்க அதிகாரிகளுடன் ஆவணங்களை சரிபார்க்க AIDriversMK க்கு நான் அனுமதி அளிக்கிறேன்."
      },
      {
        title: "4. தரவு செயலாக்கத்திற்கான ஒப்புதல்",
        content: "உறுப்பினர் பதிவு, அடையாள சரிபார்ப்பு, நலன்புரி திட்ட வழிகாட்டுதல், தொடர்பு மற்றும் இணக்கத்திற்காக என் தரவை சேகரிக்க, சேமிக்க, செயலாக்க மற்றும் பயன்படுத்த AIDriversMK க்கு முழு ஒப்புதல் அளிக்கிறேன்."
      },
      {
        title: "5. அரசாங்க நன்மைகளுக்கு உத்தரவாதம் இல்லை",
        content: "AIDriversMK ஒரு அரசாங்க அதிகாரம் அல்ல மற்றும் எந்த நலன்புரி திட்டம், மானியம் அல்லது நன்மையின் அங்கீகாரத்திற்கு உத்தரவாதம் அளிக்காது."
      },
      {
        title: "6. பொறுப்பு வரம்பு",
        content: "AIDriversMK பொறுப்பாகாது:\n- அரசாங்க நிராகரிப்புகள்\n- திட்டங்களில் பிழைகள் அல்லது தாமதங்கள்\n- நான் வழங்கிய தவறான தகவல் காரணமாக ஏற்படும் சேதங்கள்\n- அதன் கட்டுப்பாட்டிற்கு அப்பாற்பட்ட தொழில்நுட்ப தோல்விகள்"
      },
      {
        title: "7. உறுப்பினர் இடைநிறுத்தம்",
        content: "தவறான தகவல், போலி ஆவணங்கள், தவறான பயன்பாடு அல்லது தவறான நடத்தைக்காக AIDriversMK உறுப்பினரை இடைநிறுத்தலாம் அல்லது நிறுத்தலாம்."
      },
      {
        title: "8. தொடர்பு ஒப்புதல்",
        content: "அதிகாரப்பூர்வ தொடர்புக்காக SMS, WhatsApp செய்திகள், தொலைபேசி அழைப்புகள் மற்றும் மின்னஞ்சல்களை பெற ஒப்புக்கொள்கிறேன்."
      },
      {
        title: "9. சட்ட ஏற்புதல்",
        content: "இந்த படிவத்தை சமர்ப்பிப்பதன் மூலம், நான் அனைத்து விதிமுறைகள் மற்றும் நிபந்தனைகளையும் படித்து, புரிந்துகொண்டு, தானாக ஏற்றுக்கொள்கிறேன் என்பதை உறுதிப்படுத்துகிறேன்."
      }
    ]
  },
  hi: {
    title: "नियम एवं शर्तें – All India Drivers Munetra Kazhagam (AIDriversMK)",
    acceptButton: "मैं पढ़ता हूं और स्वीकार करता हूं",
    sections: [
      {
        title: "1. स्वैच्छिक सदस्यता",
        content: "मैं पूर्ण चेतना और स्वस्थ मन के साथ अपनी स्वतंत्र इच्छा से AIDriversMK में शामिल हो रहा हूं।"
      },
      {
        title: "2. जानकारी की सटीकता",
        content: "मेरे द्वारा प्रस्तुत सभी जानकारी और दस्तावेज़ (फोटो, ड्राइविंग लाइसेंस, आधार कार्ड, पता प्रमाण आदि) सत्य, सही और पूर्ण हैं। गलत या भ्रामक विवरण अस्वीकृति, निलंबन या समाप्ति का परिणाम हो सकता है।"
      },
      {
        title: "3. दस्तावेज़ प्रस्तुतीकरण",
        content: "मैं स्वेच्छा से सत्यापन के लिए अपनी तस्वीर, आधार कार्ड और ड्राइविंग लाइसेंस अपलोड करता हूं। आवश्यकता पड़ने पर सरकारी अधिकारियों के साथ दस्तावेजों को सत्यापित करने के लिए मैं AIDriversMK को अधिकृत करता हूं।"
      },
      {
        title: "4. डेटा प्रसंस्करण के लिए सहमति",
        content: "मैं सदस्यता पंजीकरण, पहचान सत्यापन, कल्याण योजना मार्गदर्शन, संचार और अनुपालन के लिए AIDriversMK को अपने डेटा को एकत्र करने, संग्रहीत करने, संसाधित करने और उपयोग करने के लिए पूर्ण सहमति देता हूं।"
      },
      {
        title: "5. सरकारी लाभों की कोई गारंटी नहीं",
        content: "AIDriversMK एक सरकारी प्राधिकरण नहीं है और किसी भी कल्याण योजना, सब्सिडी या लाभ की स्वीकृति की गारंटी नहीं देता है।"
      },
      {
        title: "6. दायित्व की सीमा",
        content: "AIDriversMK जिम्मेदार नहीं होगा:\n- सरकारी अस्वीकृति\n- योजनाओं में त्रुटियां या देरी\n- मेरे द्वारा प्रदान की गई गलत जानकारी के कारण होने वाली क्षति\n- इसके नियंत्रण से परे तकनीकी विफलताएं"
      },
      {
        title: "7. सदस्यता निलंबन",
        content: "AIDriversMK गलत जानकारी, जाली दस्तावेज़ों, दुरुपयोग या दुर्व्यवहार के लिए सदस्यता को निलंबित या समाप्त कर सकता है।"
      },
      {
        title: "8. संचार सहमति",
        content: "मैं आधिकारिक संचार के लिए एसएमएस, व्हाट्सएप संदेश, फोन कॉल और ईमेल प्राप्त करने के लिए सहमत हूं।"
      },
      {
        title: "9. कानूनी स्वीकृति",
        content: "इस फॉर्म को जमा करके, मैं पुष्टि करता हूं कि मैंने सभी नियम और शर्तों को पढ़ा है, समझा है और स्वेच्छा से स्वीकार करता हूं।"
      }
    ]
  }
};

export const TermsModal = ({ open, onAccept, onClose }: TermsModalProps) => {
  const { language } = useLanguage();
  const content = termsContent[language as Language];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold pr-8">{content.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Terms and Conditions for membership
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {content.sections.map((section, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold text-base">{section.title}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            <X className="mr-2 h-4 w-4" />
            {language === 'ta' ? 'மூடு' : language === 'hi' ? 'बंद करें' : 'Close'}
          </Button>
          <Button
            onClick={onAccept}
            className="flex-1 gradient-primary"
          >
            {content.acceptButton}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
