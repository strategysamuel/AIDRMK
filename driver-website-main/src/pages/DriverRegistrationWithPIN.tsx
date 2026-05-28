import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TermsModal } from "@/components/TermsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { tPage } from "@/translations/all-pages";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Camera, X, Check, Star, Crown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { RegionalKeyboard } from "@/components/RegionalKeyboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransliterationInput } from "@/components/TransliterationInput";
import { KYCDocumentUpload } from "@/components/KYCDocumentUpload";
import MembershipCardPreview from "@/components/MembershipCardPreview";
import { PaymentStep } from "@/components/PaymentStep";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { driverRegistrationSchema } from "@/lib/validation";
import { logoPath } from "@/lib/assets";

const DriverRegistrationWithPIN = () => {
  const [formData, setFormData] = useState({
    name: "", mobile: "", whatsapp: "",
    dob: undefined as Date | undefined,
    address: "", district: "", state: "Tamil Nadu", pincode: "",
    license_no: "",
    license_valid_till: undefined as Date | undefined,
    vehicle_types: [] as string[],
    aadhaar_no: "", blood_group: "", gender: "Male",
    pin: "", confirm_pin: "", has_accepted_terms: false,
    emergency_mobile: "7397641027",
  });

  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string>("");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string>("");
  const [dlFile, setDlFile] = useState<File | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeField, setActiveField] = useState<'name' | 'address' | 'district' | null>(null);
  const [processingAadhaar, setProcessingAadhaar] = useState(false);
  const [processingDL, setProcessingDL] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'BASIC' | 'STANDARD' | 'PREMIUM' | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [generatedMembershipId] = useState(`AIDRMK${Math.floor(100000 + Math.random() * 900000)}`);

  const navigate = useNavigate();
  const { language } = useLanguage();

  const getTranslitLanguage = (): 'tamil' | 'hindi' | 'english' => {
    if (language === 'ta') return 'tamil';
    if (language === 'hi') return 'hindi';
    return 'english';
  };

  useEffect(() => {
    const termsAccepted = localStorage.getItem('terms_accepted') === 'true';
    if (termsAccepted) setFormData(prev => ({ ...prev, has_accepted_terms: true }));
  }, []);

  const handleVehicleTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      vehicle_types: prev.vehicle_types.includes(type)
        ? prev.vehicle_types.filter(t => t !== type)
        : [...prev.vehicle_types, type],
    }));
  };

  const handleKeyboardInput = (value: string) => {
    if (!activeField) return;
    setFormData(prev => ({ ...prev, [activeField]: prev[activeField] + value }));
  };
  const handleKeyboardDelete = () => {
    if (!activeField) return;
    setFormData(prev => ({ ...prev, [activeField]: prev[activeField].slice(0, -1) }));
  };
  const handleKeyboardSpace = () => {
    if (!activeField) return;
    setFormData(prev => ({ ...prev, [activeField]: prev[activeField] + " " }));
  };

  // KYC extraction — edge functions not deployed, skip silently
  const extractKYCData = async (_file: File, _documentType: 'AADHAAR' | 'DRIVING_LICENSE') => { return; };

  const validateDocument = (file: File, name: string): boolean => {
    const isImage = file.type ? file.type.startsWith("image/") : /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    if (!isImage && !isPdf) {
      toast.error(`Invalid ${name} file type. Please upload JPG, PNG, or PDF.`);
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`${name} file size must be less than 10MB.`);
      return false;
    }
    return true;
  };

  const handleAadhaarFileSelect = async (file: File | null) => {
    if (!file) { setAadhaarFile(null); return; }
    if (!validateDocument(file, 'Aadhaar Card')) return;
    setAadhaarFile(file);
    setProcessingAadhaar(true);
    extractKYCData(file, 'AADHAAR').finally(() => setProcessingAadhaar(false));
  };

  const handleDLFileSelect = async (file: File | null) => {
    if (!file) { setDlFile(null); return; }
    if (!validateDocument(file, 'Driving License')) return;
    setDlFile(file);
    setProcessingDL(true);
    extractKYCData(file, 'DRIVING_LICENSE').finally(() => setProcessingDL(false));
  };

  const isSupportedImageFile = (file: File) => {
    if (file.type) return file.type.startsWith("image/");
    return /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
  };

  const handleSelfieSelect = (file: File) => {
    if (!isSupportedImageFile(file)) { toast.error("Please upload or capture an image file."); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Photo must be less than 10MB."); return; }
    setSelfieFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setSelfiePreview(reader.result as string);
    reader.readAsDataURL(file);
  };
  const clearSelfie = () => { setSelfieFile(null); setSelfiePreview(""); };

  const handleSignatureSelect = (file: File) => {
    if (!isSupportedImageFile(file)) { toast.error("Please upload or capture an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Signature must be less than 5MB."); return; }
    setSignatureFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setSignaturePreview(reader.result as string);
    reader.readAsDataURL(file);
  };
  const clearSignature = () => { setSignatureFile(null); setSignaturePreview(""); };

  const validateLicenseExpiry = () => {
    if (formData.license_valid_till && formData.license_valid_till < new Date()) {
      setShowExpiredDialog(true);
      return false;
    }
    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfieFile) { toast.error(tPage("registration.uploadSelfieFirst", language)); return; }
    if (!signatureFile) { toast.error("Please upload your signature"); return; }
    if (!dlFile || !aadhaarFile) { toast.error(tPage("registration.uploadKycDocs", language)); return; }
    if (!validateLicenseExpiry()) return;
    try {
      driverRegistrationSchema.parse(formData);
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Please check all fields and try again");
      return;
    }
    setShowPlanSelection(true);
  };

  const handlePlanSelection = () => {
    if (!selectedPlan) { toast.error(tPage("membershipPlanSelection.selectPlan", language)); return; }
    setShowPlanSelection(false);
    setShowPreview(true);
  };

  const handleAcceptPreview = () => {
    setShowPreview(false);
    if (selectedPlan === 'BASIC') handlePaymentSuccess();
    else setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    setLoading(true);
    try { await handleFinalSubmit(); }
    catch (error: any) { toast.error(error.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const tempEmail = `${formData.mobile}@driverapp.com`;
      const deterministicPassword = `${formData.pin}Dbx!9`;
      const { hashPIN } = await import('@/lib/utils');
      const pinHash = await hashPIN(formData.pin);

      let userId = '';

      // Try sign in first (user may already exist)
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: tempEmail, password: deterministicPassword,
      });

      if (!loginError && loginData?.user) {
        userId = loginData.user.id;
      } else {
        // Create new account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: tempEmail, password: deterministicPassword,
          options: { data: { mobile: formData.mobile, name: formData.name } },
        });
        if (signUpError) throw new Error(`Sign up failed: ${signUpError.message}`);
        if (!signUpData.user) throw new Error('User creation failed');
        userId = signUpData.user.id;

        // Activate session
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: tempEmail, password: deterministicPassword,
        });
        if (signInError) throw new Error(`Sign in failed: ${signInError.message}. Ensure "Confirm email" is OFF in Supabase Auth.`);
      }

      // Check if driver already registered
      const { data: existingDriver } = await supabase
        .from('drivers').select('id').eq('mobile', formData.mobile).maybeSingle();
      if (existingDriver) throw new Error('A driver with this mobile number is already registered.');

      // Insert driver record once
      const { data: driverData, error: driverError } = await supabase
        .from('drivers')
        .insert({
          user_id: userId,
          mobile: formData.mobile,
          name: formData.name,
          dob: formData.dob?.toISOString().split('T')[0],
          address: formData.address,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
          license_no: formData.license_no,
          license_valid_till: formData.license_valid_till?.toISOString().split('T')[0],
          vehicle_types: formData.vehicle_types as ("auto"|"taxi"|"lorry"|"bus"|"van"|"other")[],
          aadhaar_no: formData.aadhaar_no || null,
          whatsapp: formData.whatsapp || formData.mobile,
          pin_hash: pinHash,
          membership_plan: selectedPlan || 'BASIC',
          membership_id: generatedMembershipId,
          blood_group: formData.blood_group || null,
          status: 'pending',
          kyc_status: 'pending',
          has_accepted_terms: true,
          accepted_at: new Date().toISOString(),
        } as any)
        .select().single();

      if (driverError) throw new Error(`Database error: ${driverError.message}`);

      // Record payment
      const planAmounts: Record<string, number> = { BASIC: 0, STANDARD: 2999, PREMIUM: 9999 };
      const planAmount = planAmounts[selectedPlan || 'BASIC'] ?? 0;
      await supabase.from('payments').insert({
        driver_id: driverData.id,
        amount: planAmount,
        currency: 'INR',
        status: planAmount === 0 ? 'completed' : 'pending',
        payment_type: `membership_${selectedPlan || 'BASIC'}`,
        paid_at: planAmount === 0 ? new Date().toISOString() : null,
      });

      // Upload documents (non-fatal)
      try { await uploadDocuments(driverData.id); }
      catch (uploadErr: any) {
        console.warn('Document upload error:', uploadErr.message);
        toast.info('Registration successful! Upload documents from your dashboard.');
      }

      toast.success(tPage("registration.success", language));
      navigate("/driver/dashboard");
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || tPage("registration.failed", language));
    } finally {
      setLoading(false);
    }
  };

  const uploadDocuments = async (driverId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const TTL = 60 * 60 * 24 * 365;
    const uploadAndSign = async (path: string, file: File): Promise<string> => {
      const { error: upErr } = await supabase.storage.from('driver-documents').upload(path, file);
      if (upErr) throw upErr;
      const { data: signed, error: signErr } = await supabase.storage.from('driver-documents').createSignedUrl(path, TTL);
      if (signErr || !signed) throw signErr ?? new Error('Failed to sign URL');
      return signed.signedUrl;
    };
    const dlExt = dlFile!.name.split('.').pop();
    const dlUrl = await uploadAndSign(`${user.id}/DRIVING_LICENSE_${Date.now()}.${dlExt}`, dlFile!);
    const aadhaarExt = aadhaarFile!.name.split('.').pop();
    const aadhaarUrl = await uploadAndSign(`${user.id}/AADHAAR_${Date.now()}.${aadhaarExt}`, aadhaarFile!);
    let selfieUrl = "";
    if (selfieFile) {
      const ext = selfieFile.name.split('.').pop();
      selfieUrl = await uploadAndSign(`profile_photos/${user.id}/SELFIE_${Date.now()}.${ext}`, selfieFile);
    }
    let signatureUrl = "";
    if (signatureFile) {
      const ext = signatureFile.name.split('.').pop();
      signatureUrl = await uploadAndSign(`signatures/${user.id}/SIGNATURE_${Date.now()}.${ext}`, signatureFile);
    }
    await supabase.from('documents').insert([
      { driver_id: driverId, type: 'DRIVING_LICENSE', file_url: dlUrl },
      { driver_id: driverId, type: 'AADHAAR', file_url: aadhaarUrl },
    ]);
    await supabase.from('drivers').update({
      selfie_photo_url: selfieUrl || null,
      signature_url: signatureUrl || null,
      kyc_status: 'submitted',
      accepted_at: new Date().toISOString(),
    } as any).eq('id', driverId);
  };

  // ── Membership card preview ──────────────────────────────────────────────
  if (showPreview && !showPlanSelection) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 py-6 px-4">
          <Card className="max-w-2xl mx-auto shadow-2xl border-none overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-2xl text-center">{tPage("registration.membershipCardPreview", language)}</CardTitle>
              <CardDescription className="text-center">{tPage("registration.reviewDetails", language)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              <MembershipCardPreview
                formData={{
                  fullName: formData.name, fatherOrHusband: "",
                  dob: formData.dob ? format(formData.dob, "dd/MM/yyyy") : "",
                  dlNo: formData.license_no, address: formData.address,
                  bloodGroup: formData.blood_group, mobileNo: formData.mobile,
                  emergencyMobile: formData.emergency_mobile,
                  membershipPlan: selectedPlan || "BASIC",
                  membershipId: generatedMembershipId,
                }}
                photoUrl={selfiePreview}
              />
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button variant="outline" className="flex-1 h-12 text-lg font-semibold"
                  onClick={() => { setShowPreview(false); setShowPlanSelection(true); }}>
                  {language === 'ta' ? 'திரும்பிச் செல்' : language === 'hi' ? 'वापस जाएं' : 'Go Back'}
                </Button>
                <Button className="flex-1 h-12 text-lg font-semibold gradient-primary shadow-lg"
                  onClick={handleAcceptPreview} disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</> :
                    (language === 'ta' ? 'உறுதிப்படுத்து' : language === 'hi' ? 'पुष्टि करें' : 'Confirm & Register')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── Payment step ─────────────────────────────────────────────────────────
  if (showPayment) {
    const planAmounts = { BASIC: 0, STANDARD: 2999, PREMIUM: 9999 };
    return (
      <div className="min-h-screen flex flex-col bg-background py-12 px-4">
        <PaymentStep
          amount={selectedPlan ? planAmounts[selectedPlan] : 0}
          onPaymentSuccess={handlePaymentSuccess}
          onBack={() => { setShowPayment(false); setShowPlanSelection(true); }}
          language={language}
        />
      </div>
    );
  }

  // ── Plan selection ───────────────────────────────────────────────────────
  if (showPlanSelection) {
    const plans = [
      { key: 'BASIC' as const, amount: 0, dur: '/year', icon: <Star className="h-12 w-12 mx-auto mb-4 text-primary" />,
        label: language === 'ta' ? 'இலவச உறுப்பினர்' : language === 'hi' ? 'मुफ्त सदस्यता' : 'Free Membership',
        features: ['Basic legal consultation','Welfare scheme information','Community support access','Member ID card','Monthly newsletters'] },
      { key: 'STANDARD' as const, amount: 2999, dur: '/5 years', icon: <Crown className="h-12 w-12 mx-auto mb-4 text-primary" />,
        label: tPage("membership.standard", language),
        features: ['Priority legal support','Welfare scheme assistance','Free workshops (2/year)','24/7 helpline','Document verification','Exclusive events'] },
      { key: 'PREMIUM' as const, amount: 9999, dur: '/lifetime', icon: <Crown className="h-12 w-12 mx-auto mb-4 text-primary fill-primary" />,
        label: tPage("membership.premium", language),
        features: ['Unlimited legal consultations','Court representation','All workshops free','Priority case handling','Dedicated manager','Family coverage','VIP events'] },
    ];
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{tPage("membershipPlanSelection.title", language)}</h2>
              <p className="text-muted-foreground">{tPage("membershipPlanSelection.subtitle", language)}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {plans.map(plan => (
                <Card key={plan.key}
                  className={`hover:shadow-xl transition-all cursor-pointer h-full flex flex-col ${selectedPlan === plan.key ? 'border-2 border-primary ring-2 ring-primary/20 shadow-lg' : ''}`}
                  onClick={() => setSelectedPlan(plan.key)}>
                  <CardContent className="p-8 flex-1 flex flex-col">
                    <div className="text-center mb-6">
                      {plan.icon}
                      <h3 className="text-2xl font-bold mb-2">{plan.label}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">₹{plan.amount}</span>
                        <span className="text-muted-foreground">{plan.dur}</span>
                      </div>
                    </div>
                    <div className="space-y-3 mb-8 flex-1">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span>{f}</span>
                        </div>
                      ))}
                    </div>
                    {selectedPlan === plan.key && (
                      <div className="flex items-center justify-center gap-2 text-primary font-bold mt-auto pt-4 border-t">
                        <Check className="h-5 w-5" />{tPage("membershipPlanSelection.selected", language)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex gap-4 max-w-2xl mx-auto">
              <Button variant="outline" className="flex-1"
                onClick={() => { setShowPlanSelection(false); }}>
                {language === 'ta' ? 'திரும்பிச் செல்' : language === 'hi' ? 'वापस जाएं' : 'Go Back'}
              </Button>
              <Button className="flex-1 gradient-primary" disabled={!selectedPlan || loading} onClick={handlePlanSelection}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> :
                  (language === 'ta' ? 'கட்டணம் செலுத்த செல்லவும்' : language === 'hi' ? 'भुगतान के लिए आगे बढ़ें' : 'Proceed to Payment')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main registration form ───────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="h-24 w-24 border-2 border-primary/20 flex items-center justify-center bg-background rounded-2xl shadow-xl overflow-hidden p-1">
                <img src={logoPath} alt="Logo" className="h-full w-full object-contain" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center">{tPage("registration.title", language)}</CardTitle>
            <CardDescription className="text-center text-lg">{tPage("registration.subtitle", language)}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-8">

              {/* Selfie */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-semibold text-lg">{tPage("registration.selfiePhoto", language)}</h3>
                  <p className="text-sm text-muted-foreground">{tPage("registration.selfiePhotoDesc", language)}</p>
                </div>
                {selfiePreview ? (
                  <div className="flex justify-center relative w-max mx-auto">
                    <img src={selfiePreview} alt="Selfie" className="h-32 w-32 object-cover rounded-lg border-2 border-primary" />
                    <Button type="button" variant="destructive" size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={clearSelfie}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                 <div className="flex flex-col gap-2">

  {/* Upload Photo */}
  <input
    id="selfie-upload-input"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {

      const file = e.target.files?.[0];

      if (file) {
        handleSelfieSelect(file);
      }

      e.currentTarget.value = "";
    }}
  />

  {/* Camera Capture */}
  <input
    id="selfie-camera-input"
    type="file"
    accept="image/*"
    capture="user"
    className="hidden"
    onChange={(e) => {

      const file = e.target.files?.[0];

      if (file) {
        handleSelfieSelect(file);
      }

      e.currentTarget.value = "";
    }}
  />

  {/* Upload Button */}
  <Button
    type="button"
    variant="outline"
    className="flex-1"
    onClick={() => {

      const uploadInput =
        document.getElementById(
          "selfie-upload-input"
        ) as HTMLInputElement;

      uploadInput?.click();
    }}
  >
    <Upload className="h-4 w-4 mr-2" />
    Upload Photo
  </Button>

  {/* Camera Button */}
  <Button
    type="button"
    variant="outline"
    className="w-full h-12 border-primary text-primary"
    onClick={() => {

      const cameraInput =
        document.getElementById(
          "selfie-camera-input"
        ) as HTMLInputElement;

      if (cameraInput) {

        // Mobile camera trigger
        cameraInput.removeAttribute("capture");

        setTimeout(() => {

          cameraInput.setAttribute(
            "capture",
            "user"
          );

                          cameraInput.click();

                        }, 100);
                      }
                    }}
                  >
                    <Camera className="h-5 w-5 mr-2" />
                  {language === 'ta' ? 'செல்பி எடுக்கவும்' : language === 'hi' ? 'सेल्फी लें' : 'Take Selfie Photo'}
                  </Button>

                </div>
                )}
              </div>

              {/* KYC Documents */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-semibold text-lg">{tPage("registration.kycDocuments", language)} (Required)</h3>
                </div>
                <div className="space-y-2">
                  <Label>{tPage("registration.aadhaarCard", language)}</Label>
                  <KYCDocumentUpload label="" onFileSelect={handleAadhaarFileSelect}
                    selectedFile={aadhaarFile} isProcessing={processingAadhaar} />
                </div>
                <div className="space-y-2">
                  <Label>{tPage("registration.drivingLicense", language)}</Label>
                  <KYCDocumentUpload label="" onFileSelect={handleDLFileSelect}
                    selectedFile={dlFile} isProcessing={processingDL} />
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-semibold text-lg">{tPage("registration.personalDetails", language)}</h3>
                </div>
                <div className="space-y-2">
                  <Label>{tPage("registration.fullName", language)}</Label>
                  <TransliterationInput value={formData.name}
                    onChange={v => setFormData({ ...formData, name: v })}
                    language={getTranslitLanguage()} placeholder="" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{tPage("registration.mobile", language)}</Label>
                    <Input id="mobile" type="tel" maxLength={10} required value={formData.mobile}
                      onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{tPage("registration.whatsapp", language)}</Label>
                    <Input id="whatsapp" type="tel" maxLength={10} value={formData.whatsapp}
                      placeholder={formData.mobile}
                      onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{language === 'ta' ? 'இரத்த வகை' : language === 'hi' ? 'रक्त समूह' : 'Blood Group'}</Label>
                  <Input id="blood_group" required value={formData.blood_group} placeholder="Ex: O+ve, A+ve"
                    onChange={e => setFormData({ ...formData, blood_group: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{tPage("registration.dob", language)}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.dob && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dob ? format(formData.dob, "PPP") : tPage("registration.selectDate", language)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={formData.dob}
                          onSelect={date => setFormData({ ...formData, dob: date })}
                          disabled={date => date > new Date() || date < new Date("1900-01-01")}
                          captionLayout="dropdown-buttons" fromYear={1950} toYear={new Date().getFullYear()} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'பாலினம்' : language === 'hi' ? 'लिंग' : 'Gender'}</Label>
                    <div className="flex gap-4 pt-2">
                      {['Male','Female','Other'].map(g => (
                        <div key={g} className="flex items-center space-x-2">
                          <input type="radio" id={`gender-${g}`} name="gender" value={g}
                            checked={formData.gender === g}
                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                            className="w-4 h-4 accent-primary" />
                          <Label htmlFor={`gender-${g}`} className="cursor-pointer">
                            {language === 'ta' ? (g==='Male'?'ஆண்':g==='Female'?'பெண்':'மற்றவை') :
                             language === 'hi' ? (g==='Male'?'पुरुष':g==='Female'?'महिला':'अन्य') : g}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{tPage("registration.address", language)}</Label>
                  <Textarea id="address" required rows={3} value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{tPage("registration.district", language)}</Label>
                    <TransliterationInput value={formData.district}
                      onChange={v => setFormData({ ...formData, district: v })}
                      language={getTranslitLanguage()} placeholder="" required />
                  </div>
                  <div className="space-y-2">
                    <Label>{tPage("registration.state", language)}</Label>
                    <Input id="state" required value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{tPage("registration.pincode", language)}</Label>
                    <Input id="pincode" maxLength={6} required value={formData.pincode}
                      onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{tPage("registration.aadhaarCard", language)} Number</Label>
                  <Input id="aadhaar_no" maxLength={12} value={formData.aadhaar_no}
                    placeholder="Enter 12-digit Aadhaar number"
                    onChange={e => setFormData({ ...formData, aadhaar_no: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{tPage("registration.drivingLicense", language)} Number</Label>
                    <Input id="license_no" required value={formData.license_no}
                      placeholder="Enter Driving License Number"
                      onChange={e => setFormData({ ...formData, license_no: e.target.value.toUpperCase() })} />
                  </div>
                  <div className="space-y-2">
                    <Label>License Expiry Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.license_valid_till && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.license_valid_till ? format(formData.license_valid_till, "PPP") : "Select expiry date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={formData.license_valid_till}
                          onSelect={date => setFormData({ ...formData, license_valid_till: date })}
                          disabled={date => date < new Date()}
                          captionLayout="dropdown-buttons"
                          fromYear={new Date().getFullYear()} toYear={new Date().getFullYear() + 20} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{tPage("registration.vehicleTypes", language)}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['auto','taxi','lorry','bus','van','other'].map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={type} checked={formData.vehicle_types.includes(type)}
                          onCheckedChange={() => handleVehicleTypeChange(type)} />
                        <label htmlFor={type} className="text-sm capitalize cursor-pointer">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PIN Setup */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{tPage("registration.setupPin", language)}</h3>
                <div className="space-y-2">
                  <Label>{tPage("registration.create4DigitPin", language)}</Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={4} value={formData.pin} onChange={v => setFormData({ ...formData, pin: v })}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} /><InputOTPSlot index={1} />
                        <InputOTPSlot index={2} /><InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{tPage("registration.confirmPin", language)}</Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={4} value={formData.confirm_pin} onChange={v => setFormData({ ...formData, confirm_pin: v })}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} /><InputOTPSlot index={1} />
                        <InputOTPSlot index={2} /><InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {language === 'ta' ? 'கையொப்பம்' : language === 'hi' ? 'हस्ताक्षर' : 'Signature'}
                </h3>
                {signaturePreview ? (
                  <div className="relative max-w-[200px]">
                    <img src={signaturePreview} alt="Signature" className="w-full h-auto object-contain border rounded-lg" />
                    <Button type="button" variant="destructive" size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={clearSignature}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input id="signature-upload-input" type="file" accept="image/*" className="sr-only" title="Upload signature"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleSignatureSelect(f); e.currentTarget.value = ""; }} />
                    <input id="signature-camera-input" type="file" accept="image/*" capture="environment" className="sr-only" title="Take signature photo"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleSignatureSelect(f); e.currentTarget.value = ""; }} />
                    <Button type="button" variant="outline" className="flex-1"
                      onClick={() => document.getElementById("signature-upload-input")?.click()}>
                      <Upload className="h-4 w-4 mr-2" />{language === 'ta' ? 'பதிவேற்றவும்' : language === 'hi' ? 'अपलोड करें' : 'Upload'}
                    </Button>
                    <Button type="button" variant="outline" className="flex-1"
                      onClick={() => document.getElementById("signature-camera-input")?.click()}>
                      <Camera className="h-4 w-4 mr-2" />{language === 'ta' ? 'படம் எடுக்கவும்' : language === 'hi' ? 'फोटो लें' : 'Take Photo'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">{tPage("registration.termsAndConditions", language)}</h3>
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" checked={formData.has_accepted_terms} onCheckedChange={() => {}} className="pointer-events-none" />
                  <label htmlFor="terms" className="text-sm leading-none cursor-pointer" onClick={() => setShowTermsModal(true)}>
                    {tPage("termsModal.clickToView", language)}{' '}
                    <span className="text-primary underline font-medium">{tPage("termsModal.termsAndConditions", language)}</span>
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full custom-gradient-btn h-12 text-lg" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</> : tPage("registration.reviewConfirm", language)}
              </Button>
              <div className="text-center text-sm">
                <span>{tPage("registration.alreadyMember", language)} </span>
                <Button variant="link" className="p-0" onClick={() => navigate("/pin-login")}>
                  {tPage("registration.loginHere", language)}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Regional Keyboard Dialog */}
      <Dialog open={showKeyboard} onOpenChange={setShowKeyboard}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === 'ta' ? 'மொழி விசைப்பலகை உதவி' : language === 'hi' ? 'भाषा कीबोर्ड सहायक' : 'Language Keyboard Helper'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-lg font-mono bg-background p-3 rounded border min-h-[60px] break-words">
                {activeField ? formData[activeField] : ''}
              </p>
            </div>
            <RegionalKeyboard onInput={handleKeyboardInput} onDelete={handleKeyboardDelete}
              onSpace={handleKeyboardSpace} currentValue={activeField ? formData[activeField] : ''} />
          </div>
        </DialogContent>
      </Dialog>

      {/* License Expired Dialog */}
      <AlertDialog open={showExpiredDialog} onOpenChange={setShowExpiredDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === 'ta' ? 'உரிமம் காலாவதியானது' : language === 'hi' ? 'लाइसेंस समाप्त हो गया' : 'License Expired'}</AlertDialogTitle>
            <AlertDialogDescription>{tPage("registration.licenseExpiredBlocking", language)}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => {
              setShowExpiredDialog(false);
              setDlFile(null);
              setFormData(prev => ({ ...prev, license_valid_till: undefined }));
            }}>
              {language === 'ta' ? 'சரி' : language === 'hi' ? 'ठीक है' : 'OK'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Terms Modal */}
      <TermsModal
        open={showTermsModal}
        onAccept={() => {
          setFormData({ ...formData, has_accepted_terms: true });
          setShowTermsModal(false);
          localStorage.setItem('terms_accepted', 'true');
          toast.success(language === 'ta' ? 'விதிமுறைகள் ஏற்றுக்கொள்ளப்பட்டன' : language === 'hi' ? 'नियम स्वीकार किए गए' : 'Terms accepted successfully');
        }}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
};

export default DriverRegistrationWithPIN;
