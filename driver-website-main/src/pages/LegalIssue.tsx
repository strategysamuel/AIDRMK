import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Scale, FileText, Car, AlertCircle, CheckCircle, MapPin, Upload } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { tPage } from "@/translations/all-pages";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { assetPath } from "@/lib/assets";

const WEB3FORMS_ACCESS_KEY = "317454c1-593f-46a4-a8f5-2ac4c7ad8910";
const ADMIN_EMAIL = "allindiadriversmunetrakazhagam@driverwelfare.com";
const carLegal = assetPath("car-legal.png");

const LegalIssue = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [driverPlan, setDriverPlan] = useState<string>("basic");
  const [prefilled, setPrefilled] = useState({ name: false, mobile: false });
  
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    membershipId: "",
    districtCity: "",
    incidentType: "",
    location: "",
    description: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchDriverData = async () => {
        try {
          const { data, error } = await supabase
            .from("drivers")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (error) throw error;
          
          if (data) {
            const driverInfo = data as any;
            setPrefilled({ 
              name: !!driverInfo.name, 
              mobile: !!driverInfo.mobile 
            });
            setDriverPlan(driverInfo.membership_plan || "basic");
            setFormData(prev => ({
              ...prev,
              fullName: driverInfo.name || "",
              mobile: driverInfo.mobile || "",
              membershipId: driverInfo.membership_id || ""
            }));
          }
        } catch (error) {
          console.error("Error fetching driver data:", error);
        }
      };
      fetchDriverData();
    }
  }, [user]);

  const getGeolocationErrorMessage = (error: GeolocationPositionError) => {
    if (error.code === error.PERMISSION_DENIED) {
      return "Location permission was denied. Allow location access in your browser and try again.";
    }
    if (error.code === error.POSITION_UNAVAILABLE) {
      return "Live location is unavailable. Turn on GPS/location services and try again.";
    }
    if (error.code === error.TIMEOUT) {
      return "GPS timed out. Please try again outdoors or enter the location manually.";
    }
    return "Could not get location. Please enter manually.";
  };

  const handleGetLocation = () => {
    setLocationLoading(true);

    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
        setFormData(prev => ({
          ...prev,
          location
        }));
        setLocationLoading(false);
        toast.success("Live GPS location added");
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error(getGeolocationErrorMessage(error));
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.mobile || !formData.incidentType || !formData.location || !formData.description || !formData.districtCity) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    const plan = driverPlan.toLowerCase();
    if (plan === 'basic' || plan === 'free' || plan === '₹0' || plan === '₹999') {
      const legalCount = parseInt(localStorage.getItem(`legalRequests_${user?.id}`) || '0');
      if (legalCount >= 1) {
        toast.error("Basic members can only submit 1 legal request. Redirecting to dashboard to upgrade your plan.");
        setTimeout(() => window.location.href = '/driver-dashboard', 2000);
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `[Legal Support Request] ${formData.incidentType} - ${formData.fullName}`,
        from_name: formData.fullName,
        email: user?.email || "no-email@provided.com",
        phone: formData.mobile,
        message: `
Driver Name: ${formData.fullName}
Mobile Number: ${formData.mobile}
Membership ID: ${formData.membershipId || "Not Provided"}
District/City: ${formData.districtCity}
Incident Type: ${formData.incidentType}
Location: ${formData.location}

Description:
${formData.description}
        `.trim(),
        to: ADMIN_EMAIL,
      };

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        if (plan === 'basic' || plan === 'free' || plan === '₹0' || plan === '₹999') {
          const count = parseInt(localStorage.getItem(`legalRequests_${user?.id}`) || '0');
          localStorage.setItem(`legalRequests_${user?.id}`, (count + 1).toString());
        }
        toast.success("Your legal support request has been submitted successfully!");
        toast.info("Our team will contact you shortly.");
        setFormData(prev => ({
          ...prev,
          incidentType: "",
          location: "",
          description: "",
          districtCity: "",
        }));
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="bg-background border-b border-border py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif uppercase tracking-widest text-primary">Legal Support</h1>
            <p className="text-muted-foreground uppercase tracking-widest text-sm">
              {tPage("legal.subtitle", language)}
            </p>
          </div>
        </div>
      </section>

      {/* Legal Issues We Handle */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif uppercase tracking-wider text-primary">{tPage("legal.legalIssuesWeHandle", language)}</h2>
            <p className="text-muted-foreground uppercase tracking-widest text-xs">{tPage("legal.legalIssuesDesc", language)}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-6 text-center">
                <div className="h-16 w-16 bg-background flex items-center justify-center mx-auto mb-4 border border-border">
                  <span className="text-3xl">🚦</span>
                </div>
                <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("legal.trafficViolations", language)}</h3>
                <p className="text-xs text-muted-foreground">{tPage("legal.trafficViolationsDesc", language)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-6 text-center">
                <div className="h-16 w-16 bg-background flex items-center justify-center mx-auto mb-4 border border-border">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("legal.licensePermits", language)}</h3>
                <p className="text-xs text-muted-foreground">{tPage("legal.licensePermitsDesc", language)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-6 text-center">
                <div className="h-16 w-16 bg-background flex items-center justify-center mx-auto mb-4 border border-border">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("legal.vehicleDocuments", language)}</h3>
                <p className="text-xs text-muted-foreground">{tPage("legal.vehicleDocumentsDesc", language)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-6 text-center">
                <div className="h-16 w-16 bg-background flex items-center justify-center mx-auto mb-4 border border-border">
                  <Scale className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("legal.accidentCases", language)}</h3>
                <p className="text-xs text-muted-foreground">{tPage("legal.accidentCasesDesc", language)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Submit Issue Form */}
      <section className="py-20 bg-background border-t border-border" id="submit-form">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif uppercase tracking-wider text-primary">{tPage("legal.submitYourIssue", language)}</h2>
              <p className="text-muted-foreground uppercase tracking-widest text-xs">
                {tPage("legal.submitDesc", language)}
              </p>
            </div>
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName" className="font-bold uppercase tracking-wider text-xs">Driver Name</Label>
                      <Input 
                        id="fullName" 
                        value={formData.fullName} 
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="rounded-none border-border"
                        readOnly={prefilled.name}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="font-bold uppercase tracking-wider text-xs">Mobile Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={formData.mobile} 
                        onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, "")})}
                        className="rounded-none border-border"
                        readOnly={prefilled.mobile}
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Label htmlFor="membershipId" className="font-bold uppercase tracking-wider text-xs">Membership ID</Label>
                      <Input 
                        id="membershipId" 
                        value={formData.membershipId} 
                        onChange={(e) => setFormData({...formData, membershipId: e.target.value})}
                        className="rounded-none border-border"
                        placeholder="Auto-filled if logged in"
                        readOnly
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="issueType" className="font-bold uppercase tracking-wider text-xs">Incident Type</Label>
                      <Select 
                        required 
                        value={formData.incidentType} 
                        onValueChange={(val) => setFormData({...formData, incidentType: val})}
                      >
                        <SelectTrigger className="rounded-none border-border">
                          <SelectValue placeholder="Select Incident Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-border">
                          <SelectItem value="accident">Accident</SelectItem>
                          <SelectItem value="police">Police Issue</SelectItem>
                          <SelectItem value="insurance">Insurance Claim</SelectItem>
                          <SelectItem value="rto">RTO Fine</SelectItem>
                          <SelectItem value="confiscation">Document Confiscation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="districtCity" className="font-bold uppercase tracking-wider text-xs">City Name</Label>
                      <Input 
                        id="districtCity" 
                        value={formData.districtCity} 
                        onChange={(e) => setFormData({...formData, districtCity: e.target.value})}
                        className="rounded-none border-border"
                        placeholder="Enter your city"
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location" className="font-bold uppercase tracking-wider text-xs">Incident Location (GPS or Manual)</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 mt-1">
                      <Input 
                        id="location" 
                        placeholder="Enter location or use GPS..." 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="rounded-none border-border min-w-0"
                        required 
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="rounded-none whitespace-nowrap w-full sm:w-auto"
                        onClick={handleGetLocation}
                        disabled={locationLoading}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {locationLoading ? "Getting GPS..." : "Get GPS"}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description" className="font-bold uppercase tracking-wider text-xs">Description of the Issue</Label>
                    <Textarea
                      id="description"
                      placeholder="Please describe the incident in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="rounded-none border-border mt-1"
                      rows={6}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="documents" className="font-bold uppercase tracking-wider text-xs">Upload Supporting Documents/Photos (Optional)</Label>
                    <div className="border-2 border-dashed border-border p-4 mt-1 text-center bg-secondary cursor-pointer hover:bg-muted transition-colors">
                      <Input id="documents" type="file" multiple className="hidden" />
                      <Label htmlFor="documents" className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="h-8 w-8" />
                        <span>Click to browse files (Max 5MB per file)</span>
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-secondary p-4 border border-border">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      {tPage("legal.confidentialityNote", language)} All requests are treated with strict confidentiality. You will be matched with an expert advocate based on your membership tier.
                    </p>
                  </div>
                  <Button type="submit" size="lg" className="w-full uppercase tracking-widest font-bold text-sm h-12 gap-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting Request...
                      </>
                    ) : "Submit Legal Support Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif uppercase tracking-wider text-primary">{tPage("legal.howItWorks", language)}</h2>
            <p className="text-muted-foreground uppercase tracking-widest text-xs">{tPage("legal.howItWorksDesc", language)}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6 border border-border bg-background">
              <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center font-bold font-serif mx-auto mb-4">01</div>
              <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("legal.submitYourIssueStep", language)}</h3>
              <p className="text-xs text-muted-foreground">{tPage("legal.submitYourIssueStepDesc", language)}</p>
            </div>
            <div className="text-center p-6 border border-border bg-background">
              <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center font-bold font-serif mx-auto mb-4">02</div>
              <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("legal.caseReview", language)}</h3>
              <p className="text-xs text-muted-foreground">{tPage("legal.caseReviewDesc", language)}</p>
            </div>
            <div className="text-center p-6 border border-border bg-background">
              <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center font-bold font-serif mx-auto mb-4">03</div>
              <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("legal.expertGuidance", language)}</h3>
              <p className="text-xs text-muted-foreground">{tPage("legal.expertGuidanceDesc", language)}</p>
            </div>
            <div className="text-center p-6 border border-border bg-background">
              <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center font-bold font-serif mx-auto mb-4">04</div>
              <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("legal.resolution", language)}</h3>
              <p className="text-xs text-muted-foreground">{tPage("legal.resolutionDesc", language)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif uppercase tracking-wider text-primary">{tPage("legal.successStories", language)}</h2>
            <p className="text-muted-foreground uppercase tracking-widest text-xs">{tPage("legal.successStoriesDesc", language)}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-6">
                <CheckCircle className="h-10 w-10 text-green-600 mb-4" />
                <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("legal.licenseReinstatement", language)}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {tPage("legal.licenseReinstatementDesc", language)}
                </p>
                <p className="text-xs text-primary font-bold uppercase tracking-widest">{tPage("legal.resolvedIn2Weeks", language)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-6">
                <CheckCircle className="h-10 w-10 text-green-600 mb-4" />
                <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("legal.accidentSettlement", language)}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {tPage("legal.accidentSettlementDesc", language)}
                </p>
                <p className="text-xs text-primary font-bold uppercase tracking-widest">{tPage("legal.resolvedIn1Month", language)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-6">
                <CheckCircle className="h-10 w-10 text-green-600 mb-4" />
                <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("legal.fineReduction", language)}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {tPage("legal.fineReductionDesc", language)}
                </p>
                <p className="text-xs text-primary font-bold uppercase tracking-widest">{tPage("legal.resolvedIn1Week", language)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



    </div>
  );
};

export default LegalIssue;
