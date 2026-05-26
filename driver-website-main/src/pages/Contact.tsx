import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { tPage } from "@/translations/all-pages";
import { contactFormSchema } from "@/lib/validation";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

// ─── Web3Forms setup ──────────────────────────────────────────────────────────
// 1. Go to https://web3forms.com/
// 2. Enter "allindiadriversmunetrakazhagam@driverwelfare.com" and click "Create Access Key"
// 3. They will email the key to that address — copy it and paste it below.
const WEB3FORMS_ACCESS_KEY = "317454c1-593f-46a4-a8f5-2ac4c7ad8910";

const ADMIN_EMAIL = "allindiadriversmunetrakazhagam@driverwelfare.com";

const Contact = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDistricts, setShowDistricts] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
    const consent = document.getElementById("consent") as HTMLInputElement | null;
    if (consent) consent.checked = false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── Validate ────────────────────────────────────────────────────────────
    try {
      contactFormSchema.parse({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        mobile: formData.phone,
        message: formData.message,
      });
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => toast.error(err.message));
      } else {
        toast.error("Please check your input and try again.");
      }
      return;
    }

    setIsSubmitting(true);

    // ── Send via Web3Forms ──────────────────────────────────────────────────
    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `[AIDRMK Contact] ${formData.subject}`,
        from_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,          // sender's email (Web3Forms uses this as reply-to)
        phone: formData.phone,
        message: `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`,
        // tell Web3Forms to deliver to this address (must match the key's registered email)
        to: ADMIN_EMAIL,
        botcheck: "",                   // honeypot — leave empty
      };

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          "✅ Message sent successfully! We'll get back to you within 24 hours.",
          { duration: 5000 }
        );
        resetForm();
      } else {
        console.error("Web3Forms error:", data);
        throw new Error(data.message || "Unknown error from Web3Forms");
      }
    } catch (err: any) {
      console.error("Send error:", err);
      toast.error(
        `Failed to send: ${err.message ?? "Please try again or call us directly."}`,
        { duration: 6000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif uppercase tracking-widest text-primary">
              {tPage("contact.title", language)}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground uppercase tracking-widest text-sm">
              {tPage("contact.subtitle", language)}
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact Info & Form ───────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

            {/* Info cards */}
            <div className="space-y-6">
              <Card className="rounded-none border-border shadow-none">
                <CardContent className="p-6">
                  <Phone className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">
                    {tPage("contact.phone", language)}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {tPage("contact.phoneDesc", language)}
                  </p>
                  <a href="tel:7397641027" className="text-primary font-medium text-sm">
                    7397641027
                  </a>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                    {tPage("contact.support247", language)}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-none border-border shadow-none">
                <CardContent className="p-6">
                  <Mail className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">
                    {tPage("contact.email", language)}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {tPage("contact.emailDesc", language)}
                  </p>
                  <a
                    href={`mailto:${ADMIN_EMAIL}`}
                    className="text-primary font-medium text-sm break-all"
                  >
                    {ADMIN_EMAIL}
                  </a>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                    {tPage("contact.response24h", language)}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-none border-border shadow-none">
                <CardContent className="p-6">
                  <MapPin className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">
                    {tPage("contact.headOffice", language)}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {tPage("contact.officeAddress", language)}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-none border-border shadow-none">
                <CardContent className="p-6">
                  <Clock className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">
                    {tPage("contact.officeHours", language)}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {tPage("contact.hoursDesc", language)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* ── Contact Form ──────────────────────────────────────────────── */}
            <div className="lg:col-span-2">
              <Card className="rounded-none border-border shadow-none bg-secondary">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-2 font-serif uppercase tracking-wider text-primary">
                    {tPage("contact.sendMessage", language)}
                  </h2>

                  {user ? (
                    <form onSubmit={handleSubmit} className="space-y-6">

                      {/* Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="firstName" className="font-bold uppercase tracking-wider text-xs">
                            {tPage("contact.firstName", language)}
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder={tPage("contact.firstNamePlaceholder", language)}
                            value={formData.firstName}
                            onChange={handleChange}
                            maxLength={50}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="font-bold uppercase tracking-wider text-xs">
                            {tPage("contact.lastName", language)}
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder={tPage("contact.lastNamePlaceholder", language)}
                            value={formData.lastName}
                            onChange={handleChange}
                            maxLength={50}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      {/* Email & Phone */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="email" className="font-bold uppercase tracking-wider text-xs">
                            {tPage("contact.emailLabel", language)}
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={tPage("contact.emailPlaceholder", language)}
                            value={formData.email}
                            onChange={handleChange}
                            maxLength={255}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="font-bold uppercase tracking-wider text-xs">
                            {tPage("contact.phoneLabel", language)}
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder={tPage("contact.phonePlaceholder", language)}
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength={10}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <Label htmlFor="subject" className="font-bold uppercase tracking-wider text-xs">
                          {tPage("contact.subject", language)}
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder={tPage("contact.subjectPlaceholder", language)}
                          value={formData.subject}
                          onChange={handleChange}
                          maxLength={200}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <Label htmlFor="message" className="font-bold uppercase tracking-wider text-xs">
                          {tPage("contact.message", language)}
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder={tPage("contact.messagePlaceholder", language)}
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          maxLength={1000}
                          className="rounded-none border-border"
                          required
                          disabled={isSubmitting}
                        />
                        <p className="text-[10px] text-muted-foreground mt-1 text-right">
                          {formData.message.length} / 1000
                        </p>
                      </div>

                      {/* Consent */}
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="consent"
                          required
                          className="mt-1 accent-primary"
                          disabled={isSubmitting}
                        />
                        <label htmlFor="consent" className="text-xs text-muted-foreground">
                          {tPage("contact.consent", language)}
                        </label>
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full uppercase tracking-widest font-bold gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            {tPage("contact.sendMessageBtn", language)}
                          </>
                        )}
                      </Button>

                      <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
                        Delivers to: <span className="text-primary">{ADMIN_EMAIL}</span>
                      </p>
                    </form>
                  ) : (
                    <div className="py-12 text-center bg-background border border-border rounded-xl">
                      <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-bold mb-2">Login to Send Feedback</h3>
                      <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                        To send a message or feedback directly to our admin team, please log in as a registered member. You can still view our contact details above.
                      </p>
                      <Button 
                        onClick={() => navigate('/pin-login', { state: { from: location } })}
                        className="uppercase tracking-widest font-bold"
                      >
                        Login to Send Message
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── Regional Offices ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif uppercase tracking-wider text-primary">
              {tPage("contact.regionalOffices", language)}
            </h2>
            <p className="text-muted-foreground uppercase tracking-widest text-xs">
              {tPage("contact.regionalDesc", language)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {[
              { key: "northZone", states: "northZoneStates" },
              { key: "southZone", states: "southZoneStates" },
              { key: "eastZone", states: "eastZoneStates" },
              { key: "westZone", states: "westZoneStates" },
            ].map(({ key, states }) => (
              <Card key={key} className="rounded-none border-border shadow-none">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">
                    {tPage(`contact.${key}`, language)}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {tPage(`contact.${states}`, language)}
                  </p>
                  <p className="text-xs font-bold text-primary">+91 XXXXX XXXXX</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-serif uppercase tracking-wider text-primary">
              {tPage("contact.tnDistricts", language)}
            </h3>
            <p className="text-muted-foreground uppercase tracking-widest text-xs mb-5">
              {tPage("contact.districtDesc", language)}
            </p>
            <Button
              variant="outline"
              onClick={() => setShowDistricts(!showDistricts)}
              className="uppercase tracking-widest font-bold text-xs gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
            >
              {showDistricts ? (
                <><ChevronUp className="h-4 w-4" /> Hide District Offices</>
              ) : (
                <><ChevronDown className="h-4 w-4" /> Show District Offices</>
              )}
            </Button>
          </div>

          {showDistricts && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto animate-in fade-in slide-in-from-top-2 duration-300">
              {[
                "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli",
                "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Dindigul", "Thanjavur",
                "Kanchipuram", "Cuddalore", "Karur", "Rajapalayam", "Nagercoil", "Tiruvannamalai",
                "Pollachi", "Kumbakonam", "Pudukkottai", "Sivakasi", "Namakkal", "Ooty",
                "Dharmapuri", "Krishnagiri", "Hosur", "Ambur", "Arakkonam", "Chengalpattu",
                "Kanyakumari", "Virudhunagar",
              ].map((district) => (
                <Card key={district} className="rounded-none border-border shadow-none hover:bg-background transition-colors">
                  <CardContent className="p-4 flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider">{district}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                        {tPage("contact.districtOffice", language)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Contact;
