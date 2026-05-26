import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Smartphone, Building, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";

interface PaymentStepProps {
  amount: number;
  onPaymentSuccess: () => void;
  onBack: () => void;
  language: string;
}

export const PaymentStep = ({ amount, onPaymentSuccess, onBack, language }: PaymentStepProps) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    const options = {
      key: "rzp_test_placeholder", // Replace with real key
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "AIDRMK",
      description: "Membership Registration",
      image: "/src/assets/gallery/flag-logo.jpeg",
      handler: function (response: any) {
        onPaymentSuccess();
        setLoading(false);
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#1e3a8a",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  const t = (en: string, ta: string, hi: string) => {
    if (language === 'ta') return ta;
    if (language === 'hi') return hi;
    return en;
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <ShieldCheck className="h-6 w-6 text-green-500" />
            {t("Secure Payment", "பாதுகாப்பான கட்டணம்", "सुरक्षित भुगतान")}
          </CardTitle>
          <CardDescription>
            {t("Choose your preferred payment method", "உங்களுக்கு விருப்பமான கட்டண முறையைத் தேர்வுசெய்க", "अपनी पसंदीदा भुगतान विधि चुनें")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="bg-primary/5 rounded-xl p-6 text-center border border-primary/10">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
              {t("Total Amount to Pay", "செலுத்த வேண்டிய மொத்த தொகை", "कुल भुगतान राशि")}
            </p>
            <h3 className="text-4xl font-black text-primary">₹{amount}</h3>
          </div>

          <div className="grid gap-3">
            <Button variant="outline" className="h-16 justify-between px-6 text-lg hover:border-primary hover:bg-primary/5 transition-all group" onClick={handlePayment}>
              <div className="flex items-center gap-4">
                <div className="bg-muted p-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <span className="font-semibold">UPI (GPay, PhonePe, Paytm)</span>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </Button>

            <Button variant="outline" className="h-16 justify-between px-6 text-lg hover:border-primary hover:bg-primary/5 transition-all group" onClick={handlePayment}>
              <div className="flex items-center gap-4">
                <div className="bg-muted p-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <span className="font-semibold">{t("Debit / Credit Card", "டெபிட் / கிரெடிட் கார்டு", "डेबिट / क्रेडिट कार्ड")}</span>
              </div>
            </Button>

            <Button variant="outline" className="h-16 justify-between px-6 text-lg hover:border-primary hover:bg-primary/5 transition-all group" onClick={handlePayment}>
              <div className="flex items-center gap-4">
                <div className="bg-muted p-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <span className="font-semibold">{t("Net Banking", "நெட் பேங்கிங்", "नेट बैंकिंग")}</span>
              </div>
            </Button>
          </div>

          <div className="pt-4 flex gap-4">
            <Button variant="ghost" onClick={onBack} className="flex-1 h-12">
              {t("Back", "பின்னால்", "पीछे")}
            </Button>
            <Button className="flex-1 h-12 gradient-primary text-lg font-bold" onClick={handlePayment} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t("Processing...", "செயலாக்கப்படுகிறது...", "प्रसंस्करण...")}
                </>
              ) : (
                t("Pay Now", "இப்போது செலுத்துங்கள்", "अभी भुगतान करें")
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 opacity-50 grayscale pt-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/640px-UPI-Logo.png" alt="UPI" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4" />
          </div>
        </CardContent>
      </Card>
      
      <p className="text-center text-xs text-muted-foreground px-8">
        {t(
          "By clicking 'Pay Now', you agree to our terms of service and membership policy. Your payment is secured with 256-bit encryption.",
          "'இப்போது செலுத்துங்கள்' என்பதைக் கிளிக் செய்வதன் மூலம், எங்கள் சேவை விதிமுறைகள் மற்றும் உறுப்பினர் கொள்கையை ஒப்புக்கொள்கிறீர்கள். உங்கள் கட்டணம் 256-பிட் குறியாக்கத்துடன் பாதுகாக்கப்படுகிறது.",
          "'अभी भुगतान करें' पर क्लिक करके, आप हमारी सेवा की शर्तों और सदस्यता नीति से सहमत होते हैं। आपका भुगतान 256-बिट एन्क्रिप्शन के साथ सुरक्षित है।"
        )}
      </p>
    </div>
  );
};
