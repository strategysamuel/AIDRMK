import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { tPage } from "@/translations/all-pages";
import { KeyRound, Phone } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { pinLoginSchema } from "@/lib/validation";
import { logoPath } from "@/lib/assets";

const PINLogin = () => {
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input using zod schema
    try {
      pinLoginSchema.parse({ mobile, pin });
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          toast.error(err.message);
        });
      }
      return;
    }

    setLoading(true);

    // Hardcoded demo credentials
    if (mobile === '6302912969' && pin === '1234') {
      const demoUser = {
        id: '00000000-0000-0000-0000-000000000000',
        email: '6302912969@demo.com',
        phone: '6302912969',
        user_metadata: { name: 'Demo Driver' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      };
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      toast.success(tPage("pinLogin.loginSuccess", language) || 'Login successful! Welcome back.');
      // Redirect to home page after login
      window.location.href = "/";
      return;
    }

    // Real login flow

    try {
      const tempEmail = `${mobile}@driverapp.com`;
      const deterministicPassword = `${pin}Dbx!9`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password: deterministicPassword,
      });

      if (error) {
        throw new Error("Invalid mobile number or PIN");
      }

      toast.success(tPage("pinLogin.loginSuccess", language));
      navigate("/");
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || tPage("pinLogin.loginFailed", language));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-1 py-8 px-4 flex items-center justify-center bg-secondary/30 overflow-hidden">
        <Card className="w-full max-w-[400px] rounded-2xl shadow-2xl border border-border bg-card animate-in fade-in zoom-in duration-300">
          <CardHeader className="space-y-2 pt-8 pb-4 px-8">
            <div className="flex justify-center mb-1">
              <div className="h-20 w-20 border-2 border-primary/20 flex items-center justify-center bg-background rounded-xl shadow-inner overflow-hidden p-1">
                <img 
                  src={logoPath} 
                  alt="Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <CardTitle className="text-2xl font-serif font-bold text-center text-foreground tracking-tight">
              {language === 'ta' ? 'உறுப்பினர் உள்நுழைவு' : language === 'hi' ? 'सदस्य लॉगिन' : 'Member Login'}
            </CardTitle>
            <CardDescription className="text-center font-sans text-foreground/70 text-sm">
              {language === 'ta' ? 'உங்கள் மொபைல் எண் மற்றும் 4 இலக்க PIN ஐ உள்ளிடவும்' :
                language === 'hi' ? 'अपना मोबाइल नंबर और 4-अंकीय पिन दर्ज करें' :
                  'Enter your mobile number and 4-digit PIN'}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile" className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {language === 'ta' ? 'மொபைல் எண்' : language === 'hi' ? 'मोबाइल नंबर' : 'MOBILE NUMBER'}
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Login"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  maxLength={10}
                  required
                  className="rounded-lg border-border bg-muted/20 focus-visible:ring-primary h-12 text-base transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin" className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                  <KeyRound className="h-3 w-3" />
                  {language === 'ta' ? 'PIN' : language === 'hi' ? 'पिन' : 'PIN'}
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={4}
                    value={pin}
                    onChange={(value) => setPin(value)}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="rounded-lg border border-border h-12 w-11 text-xl bg-muted/20 focus-visible:ring-primary" />
                      <InputOTPSlot index={1} className="rounded-lg border border-border h-12 w-11 text-xl bg-muted/20 focus-visible:ring-primary" />
                      <InputOTPSlot index={2} className="rounded-lg border border-border h-12 w-11 text-xl bg-muted/20 focus-visible:ring-primary" />
                      <InputOTPSlot index={3} className="rounded-lg border border-border h-12 w-11 text-xl bg-muted/20 focus-visible:ring-primary" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button type="submit" className="w-full custom-gradient-btn py-6 mt-4 rounded-full text-base shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200" disabled={loading}>
                {loading ? (language === 'ta' ? 'உள்நுழைகிறது...' : 'LOGIN') : 'LOGIN'}
              </Button>

              <div className="pt-4 text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-primary font-bold uppercase tracking-widest text-[10px] hover:text-primary/80 h-auto p-0"
                  onClick={() => navigate("/forgot-pin")}
                >
                  {language === 'ta' ? 'PIN ஐ மறந்துவிட்டீர்களா?' : language === 'hi' ? 'पिन भूल गए' : 'FORGOT PIN'}
                </Button>
              </div>

              <div className="mt-4 text-center border-t border-border pt-4">
                <span className="text-foreground/60 font-sans text-xs">
                  {language === 'ta' ? 'கணக்கு இல்லையா?' : language === 'hi' ? 'खाता नहीं है?' : "Don't have an account?"}{" "}
                </span>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-primary font-bold uppercase tracking-widest text-xs ml-1"
                  onClick={() => navigate("/register")}
                >
                  {language === 'ta' ? 'பதிவு செய்க' : language === 'hi' ? 'पंजीकरण करें' : 'Sign Up'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PINLogin;
