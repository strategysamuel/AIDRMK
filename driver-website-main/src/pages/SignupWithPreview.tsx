import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Smartphone, Lock, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { logoPath } from "@/lib/assets";

const SignupWithPreview = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/register');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-20">
      <div className="w-full max-w-3xl">
        <div className="text-center pb-12">
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <img src={logoPath} alt="AIDRMK Logo" className="h-12 w-auto" />
            <span className="text-3xl font-serif font-bold text-primary uppercase tracking-wider">AIDRMK</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            {language === 'ta' ? 'எளிய பதிவு செய்முறை' : 
             language === 'hi' ? 'आसान पंजीकरण प्रक्रिया' : 
             'Simplified Registration'}
          </h1>
          <p className="text-lg text-foreground/70 font-light max-w-xl mx-auto">
            {language === 'ta' ? 'மொபைல் மற்றும் PIN உடன் பதிவு செய்யுங்கள் - மின்னஞ்சல் தேவையில்லை' :
             language === 'hi' ? 'मोबाइल और PIN के साथ पंजीकरण करें - ईमेल की आवश्यकता नहीं' :
             'Register with Mobile & PIN - No Email Required'}
          </p>
        </div>
        
        <Card className="rounded-none shadow-none border border-border bg-background">
          <CardContent className="p-10 space-y-10">
            {/* Info Section */}
            <div className="bg-secondary/50 p-8 border-l-4 border-primary">
              <h3 className="text-xl font-serif font-bold mb-6 text-foreground uppercase tracking-wider text-sm">
                {language === 'ta' ? 'ஏன் மொபைல் + PIN?' :
                 language === 'hi' ? 'मोबाइल + PIN क्यों?' :
                 'Why Mobile + PIN?'}
              </h3>
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1 text-foreground">
                      {language === 'ta' ? 'மின்னஞ்சல் தேவையில்லை' :
                       language === 'hi' ? 'कोई ईमेल की आवश्यकता नहीं' :
                       'No Email Required'}
                    </h4>
                    <p className="text-sm text-foreground/70 font-light">
                      {language === 'ta' ? 'உங்கள் மொபைல் எண் மட்டுமே போதும்' :
                       language === 'hi' ? 'केवल आपका मोबाइल नंबर पर्याप्त है' :
                       'Only your mobile number is needed'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Lock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1 text-foreground">
                      {language === 'ta' ? 'எளிய 4-இலக்க PIN' :
                       language === 'hi' ? 'आसान 4-अंकीय PIN' :
                       'Simple 4-Digit PIN'}
                    </h4>
                    <p className="text-sm text-foreground/70 font-light">
                      {language === 'ta' ? 'நீண்ட கடவுச்சொற்களை நினைவில் வைக்க தேவையில்லை' :
                       language === 'hi' ? 'लंबे पासवर्ड याद रखने की जरूरत नहीं' :
                       'No need to remember complex passwords'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Smartphone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1 text-foreground">
                      {language === 'ta' ? 'OTP மூலம் PIN மீட்டமை' :
                       language === 'hi' ? 'OTP से PIN रीसेट करें' :
                       'PIN Reset with OTP'}
                    </h4>
                    <p className="text-sm text-foreground/70 font-light">
                      {language === 'ta' ? 'உங்கள் PIN ஐ மறந்துவிட்டால், OTP மூலம் மீட்டமைக்கலாம்' :
                       language === 'hi' ? 'अगर आप PIN भूल जाते हैं तो OTP से रीसेट करें' :
                       'Forgot PIN? Reset it easily with OTP'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-6 pt-4">
              <Button 
                onClick={() => navigate('/register')}
                className="w-full bg-primary text-primary-foreground hover:bg-primary-dark rounded-none uppercase text-xs tracking-wider font-semibold py-7"
                size="lg"
              >
                <Smartphone className="h-5 w-5 mr-3" />
                {language === 'ta' ? 'மொபைல் + PIN உடன் பதிவு செய்யுங்கள்' :
                 language === 'hi' ? 'मोबाइल + PIN के साथ पंजीकरण करें' :
                 'Register with Mobile + PIN'}
              </Button>

              <div className="text-center text-sm font-sans uppercase tracking-widest text-primary font-bold">
                {language === 'ta' ? 'சுமார் 5 வினாடிகளில் தானாகவே திருப்பிவிடப்படும்...' :
                 language === 'hi' ? 'लगभग 5 सेकंड में स्वचालित रूप से रीडायरेक्ट हो रहा है...' :
                 'Redirecting automatically in 5 seconds...'}
              </div>
            </div>

            {/* Links */}
            <div className="space-y-6 pt-8 border-t border-border">
              <div className="text-center text-sm font-sans text-foreground/70">
                <p>
                  {language === 'ta' ? 'ஏற்கனவே கணக்கு உள்ளதா?' :
                   language === 'hi' ? 'पहले से खाता है?' :
                   'Already have an account?'}{" "}
                  <Link to="/pin-login" className="text-primary font-bold uppercase tracking-wider hover:underline ml-2">
                    {language === 'ta' ? 'PIN உடன் உள்நுழையுங்கள்' :
                     language === 'hi' ? 'PIN से लॉगिन करें' :
                     'Login with PIN'}
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <Link to="/" className="inline-block border-b-2 border-primary/30 hover:border-primary text-sm uppercase tracking-wider font-semibold pb-1 transition-colors">
                  {language === 'ta' ? 'முகப்புக்கு திரும்பு' :
                   language === 'hi' ? 'होम पर वापस जाएं' :
                   'Back to Home'}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupWithPreview;
