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
import { KeyRound, Phone, Lock } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { sendOTPSchema, verifyOTPSchema, resetPINSchema } from "@/lib/validation";

const ForgotPIN = () => {
  const [step, setStep] = useState<'mobile' | 'otp' | 'newpin'>('mobile');
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate mobile number using zod schema
    try {
      sendOTPSchema.parse({ mobile });
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          toast.error(err.message);
        });
      }
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-pin-reset-otp', {
        body: { mobile }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success(tPage("forgotPin.otpSent", language));
      
      // In development, show OTP in toast
      if (data.otp_dev) {
        toast.info(`Development OTP: ${data.otp_dev}`, { duration: 10000 });
      }
      
      setStep('otp');
    } catch (error: any) {
      console.error('Send OTP error:', error);
      toast.error(error.message || tPage("forgotPin.otpFailed", language));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate OTP using zod schema
    try {
      verifyOTPSchema.parse({ otp });
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          toast.error(err.message);
        });
      }
      return;
    }

    setStep('newpin');
  };

  const handleResetPIN = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate PIN reset using zod schema
    try {
      resetPINSchema.parse({ newPin, confirmPin });
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          toast.error(err.message);
        });
      }
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-and-reset-pin', {
        body: { mobile, otp, new_pin: newPin }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success(tPage("forgotPin.pinResetSuccess", language));
      navigate("/pin-login");
    } catch (error: any) {
      console.error('Reset PIN error:', error);
      toast.error(error.message || tPage("forgotPin.pinResetFailed", language));
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
              <div className="h-14 w-14 border-2 border-primary flex items-center justify-center bg-background rounded-xl shadow-inner">
                <Lock className="h-7 w-7 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-serif font-bold text-center text-foreground tracking-tight">
              {tPage("forgotPin.title", language)}
            </CardTitle>
            <CardDescription className="text-center font-sans text-foreground/70 text-sm">
              {tPage("forgotPin.subtitle", language)}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {step === 'mobile' && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {tPage("forgotPin.mobileNumber", language)}
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder={tPage("forgotPin.enterMobile", language)}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    maxLength={10}
                    required
                    className="rounded-lg border-border bg-muted/20 focus-visible:ring-primary h-12 text-base transition-all duration-200"
                  />
                </div>

                <Button type="submit" className="w-full custom-gradient-btn py-6 mt-4 rounded-full text-base shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200" disabled={loading}>
                  {loading ? tPage("forgotPin.sendingOtp", language) : tPage("forgotPin.sendOtpButton", language)}
                </Button>

                <div className="text-center text-sm">
                  <Button
                    type="button"
                    variant="link"
                    className="text-primary font-bold uppercase tracking-widest text-[10px] hover:text-primary/80 h-auto p-0"
                    onClick={() => navigate("/pin-login")}
                  >
                    {tPage("forgotPin.backToLogin", language)}
                  </Button>
                </div>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-center block font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                    {tPage("forgotPin.enterOtp", language)}
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot index={0} className="rounded-lg border border-border h-12 w-10 text-xl bg-muted/20 focus-visible:ring-primary" />
                        <InputOTPSlot index={1} className="rounded-lg border border-border h-12 w-10 text-xl bg-muted/20 focus-visible:ring-primary" />
                        <InputOTPSlot index={2} className="rounded-lg border border-border h-12 w-10 text-xl bg-muted/20 focus-visible:ring-primary" />
                        <InputOTPSlot index={3} className="rounded-lg border border-border h-12 w-10 text-xl bg-muted/20 focus-visible:ring-primary" />
                        <InputOTPSlot index={4} className="rounded-lg border border-border h-12 w-10 text-xl bg-muted/20 focus-visible:ring-primary" />
                        <InputOTPSlot index={5} className="rounded-lg border border-border h-12 w-10 text-xl bg-muted/20 focus-visible:ring-primary" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button type="submit" className="w-full custom-gradient-btn py-6 mt-4 rounded-full text-base shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200">
                  {tPage("forgotPin.verifyOtpButton", language)}
                </Button>

                <div className="text-center text-sm space-y-2">
                  <Button
                    type="button"
                    variant="link"
                    className="text-primary font-bold uppercase tracking-widest text-[10px] hover:text-primary/80 h-auto p-0"
                    onClick={() => setStep('mobile')}
                  >
                    {tPage("forgotPin.resendOtp", language)}
                  </Button>
                </div>
              </form>
            )}

            {step === 'newpin' && (
              <form onSubmit={handleResetPIN} className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                    <KeyRound className="h-3 w-3" />
                    {tPage("forgotPin.newPin", language)}
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={4}
                      value={newPin}
                      onChange={(value) => setNewPin(value)}
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

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                    <KeyRound className="h-3 w-3" />
                    {tPage("forgotPin.confirmPin", language)}
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={4}
                      value={confirmPin}
                      onChange={(value) => setConfirmPin(value)}
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
                  {loading ? tPage("forgotPin.resettingPin", language) : tPage("forgotPin.resetPinButton", language)}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPIN;
