import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/translations";

const Signup = () => {
  const { language } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("signup.success", language));
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl my-8">
        <CardHeader className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Flame className="h-8 w-8 text-primary rotate-180" fill="currentColor" />
              <Flame className="h-8 w-8 text-primary" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-primary">AIDRMK</span>
          </Link>
          <CardTitle className="text-2xl">{t("signup.title", language)}</CardTitle>
          <CardDescription>{t("signup.subtitle", language)}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{t("signup.firstName", language)} *</Label>
                <Input id="firstName" placeholder={t("signup.firstNamePlaceholder", language)} required />
              </div>
              <div>
                <Label htmlFor="lastName">{t("signup.lastName", language)} *</Label>
                <Input id="lastName" placeholder={t("signup.lastNamePlaceholder", language)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">{t("signup.email", language)} *</Label>
                <Input id="email" type="email" placeholder={t("signup.emailPlaceholder", language)} required />
              </div>
              <div>
                <Label htmlFor="phone">{t("signup.phone", language)} *</Label>
                <Input id="phone" type="tel" placeholder={t("signup.phonePlaceholder", language)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="driverType">{t("signup.driverType", language)} *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder={t("signup.driverTypePlaceholder", language)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">{t("signup.driverTypes.truck", language)}</SelectItem>
                    <SelectItem value="taxi">{t("signup.driverTypes.taxi", language)}</SelectItem>
                    <SelectItem value="auto">{t("signup.driverTypes.auto", language)}</SelectItem>
                    <SelectItem value="bus">{t("signup.driverTypes.bus", language)}</SelectItem>
                    <SelectItem value="private">{t("signup.driverTypes.private", language)}</SelectItem>
                    <SelectItem value="other">{t("signup.driverTypes.other", language)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="licenseNumber">{t("signup.licenseNumber", language)} *</Label>
                <Input id="licenseNumber" placeholder={t("signup.licenseNumberPlaceholder", language)} required />
              </div>
            </div>
            <div>
              <Label htmlFor="state">{t("signup.state", language)} *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder={t("signup.statePlaceholder", language)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delhi">{t("signup.states.delhi", language)}</SelectItem>
                  <SelectItem value="maharashtra">{t("signup.states.maharashtra", language)}</SelectItem>
                  <SelectItem value="karnataka">{t("signup.states.karnataka", language)}</SelectItem>
                  <SelectItem value="tamil-nadu">{t("signup.states.tamilNadu", language)}</SelectItem>
                  <SelectItem value="west-bengal">{t("signup.states.westBengal", language)}</SelectItem>
                  <SelectItem value="gujarat">{t("signup.states.gujarat", language)}</SelectItem>
                  <SelectItem value="other">{t("signup.states.other", language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">{t("signup.password", language)} *</Label>
                <Input id="password" type="password" placeholder={t("signup.passwordPlaceholder", language)} required />
              </div>
              <div>
                <Label htmlFor="confirmPassword">{t("signup.confirmPassword", language)} *</Label>
                <Input id="confirmPassword" type="password" placeholder={t("signup.confirmPasswordPlaceholder", language)} required />
              </div>
            </div>
            <div>
              <Label htmlFor="membershipPlan">{t("signup.membershipPlan", language)} *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder={t("signup.membershipPlanPlaceholder", language)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">{t("signup.plans.basic", language)}</SelectItem>
                  <SelectItem value="standard">{t("signup.plans.standard", language)}</SelectItem>
                  <SelectItem value="premium">{t("signup.plans.premium", language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" required className="mt-1" />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                {t("signup.terms", language)}
              </label>
            </div>
            <Button type="submit" className="w-full gradient-primary" size="lg">
              {t("signup.signupButton", language)}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              {t("signup.haveAccount", language)}{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                {t("signup.loginLink", language)}
              </Link>
            </p>
          </div>
          <div className="mt-6">
            <Link to="/">
              <Button variant="outline" className="w-full">
                {t("signup.backHome", language)}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
