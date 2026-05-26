import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TermsAndConditions = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check if already accepted
    const hasAccepted = localStorage.getItem('terms_accepted') === 'true';
    setAccepted(hasAccepted);
  }, []);

  const handleAcceptance = async (checked: boolean) => {
    if (!checked) {
      setAccepted(false);
      localStorage.removeItem('terms_accepted');
      return;
    }

    setSaving(true);
    setAccepted(true);

    try {
      // Save to localStorage
      localStorage.setItem('terms_accepted', 'true');

      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Update driver record with acceptance
        const { error: updateError } = await supabase
          .from('drivers')
          .update({
            has_accepted_terms: true,
            accepted_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error saving terms acceptance:', updateError);
        }
      }

      // Show success message
      toast.success(
        language === 'ta' ? 'விதிமுறைகள் ஏற்றுக்கொள்ளப்பட்டன' :
        language === 'hi' ? 'नियम स्वीकार किए गए' :
        'Terms accepted successfully'
      );

      // Close window after a short delay (if opened in popup)
      setTimeout(() => {
        if (window.opener) {
          // If opened in popup, close it
          window.close();
        } else {
          // Otherwise navigate back
          navigate(-1);
        }
      }, 1000);

    } catch (error) {
      console.error('Error handling acceptance:', error);
      toast.error(
        language === 'ta' ? 'பிழை ஏற்பட்டது' :
        language === 'hi' ? 'त्रुटि हुई' :
        'An error occurred'
      );
    } finally {
      setSaving(false);
    }
  };

  const content = {
    en: {
      title: "Terms & Conditions – All India Drivers Munetra Kazhagam (AIDriversMK)",
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
          content: "मैं आधिकारिक संचार के लिए SMS, WhatsApp संदेश, फोन कॉल और ईमेल प्राप्त करने के लिए सहमत हूं।"
        },
        {
          title: "9. कानूनी स्वीकृति",
          content: "इस फॉर्म को जमा करके, मैं पुष्टि करता हूं कि मैंने सभी नियम और शर्तों को पढ़ लिया है, समझ लिया है और स्वेच्छा से स्वीकार करता हूं।"
        }
      ]
    }
  };

  const selectedContent = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 py-12 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{selectedContent.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedContent.sections.map((section, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-bold text-lg text-primary">{section.title}</h3>
                <p className="text-muted-foreground whitespace-pre-line">{section.content}</p>
              </div>
            ))}
            
            {/* I read and accept checkbox */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                <Checkbox
                  id="accept-terms"
                  checked={accepted}
                  onCheckedChange={(checked) => handleAcceptance(checked as boolean)}
                  disabled={saving}
                />
                <label htmlFor="accept-terms" className="text-sm font-medium cursor-pointer">
                  {language === 'ta' ? 'நான் படித்து ஏற்றுக்கொள்கிறேன்' : 
                   language === 'hi' ? 'मैंने पढ़ लिया और स्वीकार करता हूं' : 
                   'I read and accept'}
                </label>
              </div>

              {accepted && (
                <div className="text-center text-sm text-muted-foreground">
                  {saving ? (
                    language === 'ta' ? 'சேமிக்கிறது...' :
                    language === 'hi' ? 'सहेजा जा रहा है...' :
                    'Saving...'
                  ) : (
                    <>
                      {language === 'ta' ? 'விதிமுறைகள் சேமிக்கப்பட்டன. இந்த சாளரம் மூடப்படும்...' :
                       language === 'hi' ? 'नियम सहेजे गए। यह विंडो बंद हो रही है...' :
                       'Terms saved. This window will close...'}
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsAndConditions;
