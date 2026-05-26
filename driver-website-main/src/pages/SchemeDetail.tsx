import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle } from "lucide-react";
import { DEFAULT_WELFARE_SCHEMES, normalizeSchemeLevel } from "@/data/welfareSchemes";
import { subscribeToContentChanges } from "@/lib/contentSync";

interface Scheme {
  id: string;
  title_en: string;
  title_ta: string;
  title_hi: string;
  description_en: string;
  description_ta: string;
  description_hi: string;
  category: string;
  level: string;
  target_workers: string | null;
  eligibility_summary_en: string | null;
  eligibility_summary_ta: string | null;
  eligibility_summary_hi: string | null;
  max_benefit_amount: number | null;
  benefit_unit: string | null;
  official_link: string | null;
}

const SchemeDetail = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [driverData, setDriverData] = useState<any>(null);

  useEffect(() => {
    fetchScheme();
    if (user) {
      if (user.id === '00000000-0000-0000-0000-000000000000') {
        setDriverData({ name: 'Demo Driver', mobile: '9876543210' });
      } else {
        supabase.from('drivers').select('name, mobile').eq('user_id', user.id).single()
          .then(({ data }) => { if (data) setDriverData(data); });
      }
    }
    return subscribeToContentChanges("schemes", fetchScheme);
  }, [id, user]);

  const fetchScheme = async () => {
    try {
      const { data, error } = await supabase
        .from("schemes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setScheme(data);
    } catch (error: any) {
      const fallbackScheme = DEFAULT_WELFARE_SCHEMES.find((item) => item.id === id);
      if (fallbackScheme) {
        setScheme(fallbackScheme);
        return;
      }

      toast({
        title: "Error loading scheme",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = (scheme: Scheme) => {
    return language === "ta" ? scheme.title_ta : language === "hi" ? scheme.title_hi : scheme.title_en;
  };

  const getDescription = (scheme: Scheme) => {
    return language === "ta" ? scheme.description_ta : language === "hi" ? scheme.description_hi : scheme.description_en;
  };

  const getEligibility = (scheme: Scheme) => {
    return language === "ta" ? scheme.eligibility_summary_ta : language === "hi" ? scheme.eligibility_summary_hi : scheme.eligibility_summary_en;
  };

  const formatBenefit = (amount: number, unit: string | null) => {
    const rupee = String.fromCharCode(8377);
    const suffix = unit && unit !== "INR" ? ` ${unit}` : "";
    return `${rupee}${amount.toLocaleString("en-IN")}${suffix}`;
  };

  const handleRequestApply = () => {
    if (!scheme) return;
    
    const plan = driverData?.membership_plan?.toLowerCase() || 'basic';
    if (plan === 'basic' || plan === 'free' || plan === '₹0' || plan === '₹999') {
      const schemeCount = parseInt(localStorage.getItem(`schemeRequests_${user?.id}`) || '0');
      if (schemeCount >= 1) {
        toast({
          title: "Upgrade Required",
          description: "Basic members can only submit 1 scheme request. Redirecting to dashboard to upgrade your membership.",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = '/driver-dashboard', 2000);
        return;
      }
      localStorage.setItem(`schemeRequests_${user?.id}`, (schemeCount + 1).toString());
    }

    const adminPhone = "+917397641027";
    const driverName = driverData?.name || "Member";
    const driverPhone = driverData?.mobile || user?.phone || "";
    const schemeName = getTitle(scheme);
    
    const message = `Hello Admin, I would like to request to apply for the following scheme:
Scheme Name: ${schemeName}
Name: ${driverName}
Phone Number: ${driverPhone}

Please assist me.`;
    
    const whatsappUrl = `https://wa.me/${adminPhone.replace("+", "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // APY Premium Chart Data
  const apyPremiumData = [
    { age: "18", pension2000: 42, pension3000: 63, pension4000: 84, pension5000: 105 },
    { age: "19", pension2000: 46, pension3000: 69, pension4000: 92, pension5000: 115 },
    { age: "20", pension2000: 50, pension3000: 75, pension4000: 100, pension5000: 126 },
    { age: "21", pension2000: 54, pension3000: 82, pension4000: 109, pension5000: 137 },
    { age: "22", pension2000: 59, pension3000: 88, pension4000: 117, pension5000: 147 },
    { age: "23", pension2000: 64, pension3000: 96, pension4000: 127, pension5000: 159 },
    { age: "24", pension2000: 70, pension3000: 104, pension4000: 139, pension5000: 174 },
    { age: "25", pension2000: 76, pension3000: 114, pension4000: 151, pension5000: 189 },
    { age: "26", pension2000: 82, pension3000: 123, pension4000: 164, pension5000: 206 },
    { age: "27", pension2000: 90, pension3000: 134, pension4000: 179, pension5000: 224 },
    { age: "28", pension2000: 97, pension3000: 146, pension4000: 195, pension5000: 244 },
    { age: "29", pension2000: 106, pension3000: 159, pension4000: 212, pension5000: 265 },
    { age: "30", pension2000: 116, pension3000: 173, pension4000: 231, pension5000: 289 },
    { age: "31", pension2000: 126, pension3000: 189, pension4000: 252, pension5000: 315 },
    { age: "32", pension2000: 138, pension3000: 207, pension4000: 276, pension5000: 345 },
    { age: "33", pension2000: 151, pension3000: 226, pension4000: 302, pension5000: 377 },
    { age: "34", pension2000: 165, pension3000: 248, pension4000: 330, pension5000: 413 },
    { age: "35", pension2000: 181, pension3000: 271, pension4000: 362, pension5000: 452 },
    { age: "36", pension2000: 198, pension3000: 297, pension4000: 396, pension5000: 495 },
    { age: "37", pension2000: 218, pension3000: 327, pension4000: 436, pension5000: 545 },
    { age: "38", pension2000: 240, pension3000: 360, pension4000: 480, pension5000: 600 },
    { age: "39", pension2000: 902, pension3000: 1353, pension4000: 1804, pension5000: 2255 },
    { age: "40", pension2000: 1000, pension3000: 1500, pension4000: 2000, pension5000: 2500 },
  ];

  // PMJJBY Premium Data
  const pmjjbyPremiumData = {
    annualPremium: 436,
    coverageAmount: 200000,
    ageRange: "18-50 years",
    renewalDate: "June 1st every year"
  };

  // PMSBY Premium Data
  const pmsbyPremiumData = {
    annualPremium: 20,
    accidentalDeath: 200000,
    totalDisability: 200000,
    partialDisability: 100000,
    ageRange: "18-70 years",
    renewalDate: "June 1st every year"
  };

  const isAPYScheme = scheme?.title_en?.toLowerCase().includes("atal pension yojana") || 
                      scheme?.title_en?.toLowerCase().includes("apy");
  
  const isPMJJBYScheme = scheme?.title_en?.toLowerCase().includes("jeevan jyoti") ||
                         scheme?.title_en?.toLowerCase().includes("pmjjby");
  
  const isPMSBYScheme = scheme?.title_en?.toLowerCase().includes("suraksha bima") ||
                        scheme?.title_en?.toLowerCase().includes("pmsby");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Scheme not found</h2>
            <Button asChild>
              <Link to="/benefits">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Schemes
              </Link>
            </Button>
          </div>
        </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">

      <div className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link to="/benefits">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === "ta" ? "திட்டங்களுக்குத் திரும்பு" : language === "hi" ? "योजनाओं पर वापस जाएं" : "Back to Schemes"}
            </Link>
          </Button>

          {/* Scheme Header */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <Badge variant={normalizeSchemeLevel(scheme.level) === "central" ? "default" : "secondary"}>
                {normalizeSchemeLevel(scheme.level) === "central"
                  ? language === "ta" ? "மத்திய" : language === "hi" ? "केंद्र" : "Central"
                  : language === "ta" ? "மாநில" : language === "hi" ? "राज्य" : "State"}
              </Badge>
              <Badge variant="outline">{scheme.category}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{getTitle(scheme)}</h1>
            <p className="text-lg text-muted-foreground">{getDescription(scheme)}</p>
          </div>

          {/* Max Benefit */}
          {scheme.max_benefit_amount && scheme.max_benefit_amount > 0 && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {language === "ta" ? "அதிகபட்ச நன்மை" : language === "hi" ? "अधिकतम लाभ" : "Maximum Benefit"}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {formatBenefit(scheme.max_benefit_amount, scheme.benefit_unit)}
                    </p>
                  </div>
                  {scheme.official_link && (
                    <Button asChild>
                      <a href={scheme.official_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {language === "ta" ? "அதிகாரப்பூர்வ இணைப்பு" : language === "hi" ? "आधिकारिक लिंक" : "Official Link"}
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Eligibility */}
          {getEligibility(scheme) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {language === "ta" ? "தகுதி" : language === "hi" ? "पात्रता" : "Eligibility"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{getEligibility(scheme)}</p>
              </CardContent>
            </Card>
          )}

          {/* APY Premium Chart */}
          {isAPYScheme && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {language === "ta" 
                    ? "மாதாந்திர பிரீமியம் விவரங்கள்" 
                    : language === "hi" 
                    ? "मासिक प्रीमियम विवरण" 
                    : "Monthly Premium Details"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {language === "ta"
                    ? "நுழைவு வயதின் அடிப்படையில் பல்வேறு ஓய்வூதியத் தொகைகளுக்கான மாதாந்திர பங்களிப்பு (இந்திய ரூபாயில்)"
                    : language === "hi"
                    ? "प्रवेश आयु के आधार पर विभिन्न पेंशन राशियों के लिए मासिक योगदान (रुपये में)"
                    : "Monthly contribution for different pension amounts based on entry age (in ₹)"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold">
                          {language === "ta" ? "நுழைவு வயது" : language === "hi" ? "प्रवेश आयु" : "Entry Age"}
                        </TableHead>
                        <TableHead className="text-right">₹2,000 {language === "ta" ? "ஓய்வூதியம்" : language === "hi" ? "पेंशन" : "Pension"}</TableHead>
                        <TableHead className="text-right">₹3,000 {language === "ta" ? "ஓய்வூதியம்" : language === "hi" ? "पेंशन" : "Pension"}</TableHead>
                        <TableHead className="text-right">₹4,000 {language === "ta" ? "ஓய்வூதியம்" : language === "hi" ? "पेंशन" : "Pension"}</TableHead>
                        <TableHead className="text-right">₹5,000 {language === "ta" ? "ஓய்வூதியம்" : language === "hi" ? "पेंशन" : "Pension"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apyPremiumData.map((row) => (
                        <TableRow key={row.age}>
                          <TableCell className="font-medium">{row.age} {language === "ta" ? "வயது" : language === "hi" ? "वर्ष" : "years"}</TableCell>
                          <TableCell className="text-right">₹{row.pension2000}</TableCell>
                          <TableCell className="text-right">₹{row.pension3000}</TableCell>
                          <TableCell className="text-right">₹{row.pension4000}</TableCell>
                          <TableCell className="text-right">₹{row.pension5000}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 p-4 bg-accent/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {language === "ta"
                      ? "குறிப்பு: பிரீமியம் தொகைகள் தோராயமானவை மற்றும் அரசாங்கக் கொள்கைகளின் அடிப்படையில் மாறுபடலாம். துல்லியமான விவரங்களுக்கு அதிகாரப்பூர்வ இணைப்பைப் பார்வையிடவும்."
                      : language === "hi"
                      ? "नोट: प्रीमियम राशि अनुमानित है और सरकारी नीतियों के आधार पर भिन्न हो सकती है। सटीक विवरण के लिए आधिकारिक लिंक पर जाएं।"
                      : "Note: Premium amounts are approximate and may vary based on government policies. Please visit the official link for accurate details."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* PMJJBY Premium Details */}
          {isPMJJBYScheme && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {language === "ta" 
                    ? "பிரீமியம் மற்றும் கவரேஜ் விவரங்கள்" 
                    : language === "hi" 
                    ? "प्रीमियम और कवरेज विवरण" 
                    : "Premium & Coverage Details"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {language === "ta"
                    ? "வருடாந்திர பிரீமியம் மற்றும் வாழ்க்கை கவரேஜ் தகவல்"
                    : language === "hi"
                    ? "वार्षिक प्रीमियम और जीवन कवरेज जानकारी"
                    : "Annual premium and life coverage information"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-2">
                      {language === "ta" ? "வருடாந்திர பிரீமியம்" : language === "hi" ? "वार्षिक प्रीमियम" : "Annual Premium"}
                    </div>
                    <div className="text-3xl font-bold text-primary">₹{pmjjbyPremiumData.annualPremium}</div>
                    <div className="text-sm text-muted-foreground mt-1">{language === "ta" ? "ஒரு வருடத்திற்கு" : language === "hi" ? "प्रति वर्ष" : "per year"}</div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-sm text-muted-foreground mb-2">
                      {language === "ta" ? "வாழ்க்கை கவரேஜ்" : language === "hi" ? "जीवन कवरेज" : "Life Coverage"}
                    </div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">₹{pmjjbyPremiumData.coverageAmount.toLocaleString("en-IN")}</div>
                    <div className="text-sm text-muted-foreground mt-1">{language === "ta" ? "இறப்பு நன்மை" : language === "hi" ? "मृत्यु लाभ" : "Death benefit"}</div>
                  </div>
                  
                  <div className="bg-secondary p-6 rounded-lg">
                    <div className="text-sm font-semibold mb-2">
                      {language === "ta" ? "தகுதி வயது" : language === "hi" ? "पात्रता आयु" : "Eligibility Age"}
                    </div>
                    <div className="text-lg font-medium">{pmjjbyPremiumData.ageRange}</div>
                  </div>
                  
                  <div className="bg-secondary p-6 rounded-lg">
                    <div className="text-sm font-semibold mb-2">
                      {language === "ta" ? "புதுப்பித்தல் தேதி" : language === "hi" ? "नवीनीकरण तिथि" : "Renewal Date"}
                    </div>
                    <div className="text-lg font-medium">{pmjjbyPremiumData.renewalDate}</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    {language === "ta" ? "முக்கிய நன்மைகள்" : language === "hi" ? "मुख्य लाभ" : "Key Benefits"}
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li>• {language === "ta" ? "₹2,00,000 வாழ்க்கை காப்பீடு கவரேஜ்" : language === "hi" ? "₹2,00,000 का जीवन बीमा कवरेज" : "Life insurance coverage of ₹2,00,000"}</li>
                    <li>• {language === "ta" ? "சேமிப்பு கணக்கிலிருந்து தானியங்கி பற்று வசதி" : language === "hi" ? "बचत खाते से ऑटो-डेबिट सुविधा" : "Auto-debit facility from savings account"}</li>
                    <li>• {language === "ta" ? "எந்த காரணத்திற்காகவும் இறப்பு கவரேஜ்" : language === "hi" ? "मृत्यु के किसी भी कारण के लिए कवरेज" : "Coverage for any reason of death"}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* PMSBY Premium Details */}
          {isPMSBYScheme && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {language === "ta" 
                    ? "பிரீமியம் மற்றும் கவரேஜ் விவரங்கள்" 
                    : language === "hi" 
                    ? "प्रीमियम और कवरेज विवरण" 
                    : "Premium & Coverage Details"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {language === "ta"
                    ? "வருடாந்திர பிரீமியம் மற்றும் விபத்து கவரேஜ் தகவல்"
                    : language === "hi"
                    ? "वार्षिक प्रीमियम और दुर्घटना कवरेज जानकारी"
                    : "Annual premium and accident coverage information"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-2">
                      {language === "ta" ? "வருடாந்திர பிரீமியம்" : language === "hi" ? "वार्षिक प्रीमियम" : "Annual Premium"}
                    </div>
                    <div className="text-3xl font-bold text-primary">₹{pmsbyPremiumData.annualPremium}</div>
                    <div className="text-sm text-muted-foreground mt-1">{language === "ta" ? "ஒரு வருடத்திற்கு" : language === "hi" ? "प्रति वर्ष" : "per year"}</div>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="text-sm text-muted-foreground mb-2">
                      {language === "ta" ? "விபத்து மரணம்" : language === "hi" ? "दुर्घटना मृत्यु" : "Accidental Death"}
                    </div>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">₹{pmsbyPremiumData.accidentalDeath.toLocaleString("en-IN")}</div>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="text-sm text-muted-foreground mb-2">
                      {language === "ta" ? "முழு ஊனம்" : language === "hi" ? "कुल विकलांगता" : "Total Disability"}
                    </div>
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">₹{pmsbyPremiumData.totalDisability.toLocaleString("en-IN")}</div>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="text-sm text-muted-foreground mb-2">
                      {language === "ta" ? "பகுதி ஊனம்" : language === "hi" ? "आंशिक विकलांगता" : "Partial Disability"}
                    </div>
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">₹{pmsbyPremiumData.partialDisability.toLocaleString("en-IN")}</div>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="bg-secondary p-6 rounded-lg">
                    <div className="text-sm font-semibold mb-2">
                      {language === "ta" ? "தகுதி வயது" : language === "hi" ? "पात्रता आयु" : "Eligibility Age"}
                    </div>
                    <div className="text-lg font-medium">{pmsbyPremiumData.ageRange}</div>
                  </div>
                  
                  <div className="bg-secondary p-6 rounded-lg">
                    <div className="text-sm font-semibold mb-2">
                      {language === "ta" ? "புதுப்பித்தல் தேதி" : language === "hi" ? "नवीनीकरण तिथि" : "Renewal Date"}
                    </div>
                    <div className="text-lg font-medium">{pmsbyPremiumData.renewalDate}</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    {language === "ta" ? "கவரேஜ் பிரிவு" : language === "hi" ? "कवरेज विवरण" : "Coverage Breakdown"}
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li>• {language === "ta" ? "விபத்து மரணம்: முழு ₹2,00,000" : language === "hi" ? "दुर्घटना मृत्यु: पूर्ण ₹2,00,000" : "Accidental Death: Full ₹2,00,000"}</li>
                    <li>• {language === "ta" ? "முழு மற்றும் மீட்க முடியாத ஊனம்: ₹2,00,000" : language === "hi" ? "कुल और अप्राप्य विकलांगता: ₹2,00,000" : "Total & Irrecoverable Disability: ₹2,00,000"}</li>
                    <li>• {language === "ta" ? "பகுதி ஊனம்: ₹1,00,000" : language === "hi" ? "आंशिक विकलांगता: ₹1,00,000" : "Partial Disability: ₹1,00,000"}</li>
                    <li>• {language === "ta" ? "சேமிப்பு கணக்கிலிருந்து தானியங்கி பற்று வசதி" : language === "hi" ? "बचत खाते से ऑटो-डेबिट सुविधा" : "Auto-debit facility from savings account"}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Target Workers */}
          {scheme.target_workers && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {language === "ta" ? "இலக்கு பயனாளிகள்" : language === "hi" ? "लक्षित लाभार्थी" : "Target Beneficiaries"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{scheme.target_workers}</p>
              </CardContent>
            </Card>
          )}

          {/* Apply Button */}
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <Button size="lg" className="flex-1" onClick={() => {
              const url = (scheme as any).apply_url || scheme.official_link;
              if (url) {
                window.open(url, "_blank", "noopener,noreferrer");
              } else {
                handleRequestApply();
              }
            }}>
              <ExternalLink className="h-4 w-4 mr-2" />
              {language === "ta" ? "இந்த திட்டத்திற்கு விண்ணப்பிக்கவும்" : language === "hi" ? "इस योजना के लिए आवेदन करें" : "Apply for this Scheme"}
            </Button>
            <Button size="lg" variant="default" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleRequestApply}>
              <MessageCircle className="w-5 h-5 mr-2" />
              {language === "ta" ? "விண்ணப்பிக்க கோரிக்கை" : language === "hi" ? "आवेदन करने का अनुरोध करें" : "Request to Apply"}
            </Button>
            <Button size="lg" variant="outline" className="flex-1" asChild>
              <Link to="/contact">
                {language === "ta" ? "உதவி பெறுங்கள்" : language === "hi" ? "सहायता प्राप्त करें" : "Get Help"}
              </Link>
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SchemeDetail;
