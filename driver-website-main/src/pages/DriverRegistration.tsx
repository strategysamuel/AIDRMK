import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { tPage } from "@/translations/all-pages";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const DriverRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    whatsapp: "",
    dob: undefined as Date | undefined,
    address: "",
    district: "",
    state: "Tamil Nadu",
    pincode: "",
    license_no: "",
    license_valid_till: undefined as Date | undefined,
    vehicle_types: [] as string[],
    aadhaar_no: "",
    has_accepted_terms: false,
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleVehicleTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      vehicle_types: prev.vehicle_types.includes(type)
        ? prev.vehicle_types.filter(t => t !== type)
        : [...prev.vehicle_types, type]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.has_accepted_terms) {
      toast.error("You must accept the terms and conditions");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.vehicle_types.length === 0) {
      toast.error("Please select at least one vehicle type");
      return;
    }

    setLoading(true);

    try {
      // Sign up user
      const { error: signUpError } = await signUp(formData.email, formData.password, {
        full_name: formData.name,
        mobile: formData.mobile
      });

      if (signUpError) throw signUpError;

      // Get the newly created user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found after signup");

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: formData.name,
          mobile: formData.mobile,
          whatsapp: formData.whatsapp,
          email: formData.email
        });

      if (profileError) throw profileError;

      // Create driver record
      const { error: driverError } = await supabase
        .from('drivers')
        .insert({
          user_id: user.id,
          name: formData.name,
          mobile: formData.mobile,
          whatsapp: formData.whatsapp || formData.mobile,
          dob: formData.dob?.toISOString().split('T')[0],
          address: formData.address,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
          license_no: formData.license_no,
          license_valid_till: formData.license_valid_till?.toISOString().split('T')[0],
          vehicle_types: formData.vehicle_types,
          aadhaar_no: formData.aadhaar_no,
          has_accepted_terms: true,
          accepted_at: new Date().toISOString(),
        } as any);

      if (driverError) throw driverError;

      toast.success("Registration successful! Please login to continue.");
      navigate("/auth");
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{tPage("signup.title", language)}</CardTitle>
            <CardDescription>{tPage("signup.subtitle", language)}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{tPage("signup.fullName", language)}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{tPage("signup.email", language)}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">{tPage("signup.mobileNo", language)}</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">{tPage("signup.whatsappOptional", language)}</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{tPage("signup.dob", language)}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dob && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dob ? format(formData.dob, "PPP") : tPage("signup.pickDate", language)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dob}
                      onSelect={(date) => setFormData({ ...formData, dob: date })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{tPage("signup.address", language)}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">{tPage("signup.district", language)}</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">{tPage("signup.state", language)}</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">{tPage("signup.pincode", language)}</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license_no">{tPage("signup.licenseNo", language)}</Label>
                  <Input
                    id="license_no"
                    value={formData.license_no}
                    onChange={(e) => setFormData({ ...formData, license_no: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{tPage("signup.licenseValidTill", language)}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.license_valid_till && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.license_valid_till ? format(formData.license_valid_till, "PPP") : tPage("signup.pickDate", language)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.license_valid_till}
                        onSelect={(date) => setFormData({ ...formData, license_valid_till: date })}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhaar_no">{tPage("signup.aadhaarNo", language)}</Label>
                <Input
                  id="aadhaar_no"
                  value={formData.aadhaar_no}
                  onChange={(e) => setFormData({ ...formData, aadhaar_no: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>{tPage("signup.vehicleTypes", language)}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['auto', 'taxi', 'lorry', 'bus', 'van', 'other'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={formData.vehicle_types.includes(type)}
                        onCheckedChange={() => handleVehicleTypeChange(type)}
                      />
                      <label htmlFor={type} className="text-sm capitalize cursor-pointer">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{tPage("signup.password", language)}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{tPage("signup.confirmPassword", language)}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.has_accepted_terms}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, has_accepted_terms: checked as boolean })
                  }
                />
                <label htmlFor="terms" className="text-sm">
                  {tPage("signup.terms", language)}
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? tPage("signup.registering", language) : tPage("signup.signupButton", language)}
              </Button>

              <div className="text-center text-sm">
                <span>{tPage("signup.haveAccount", language)} </span>
                <Button variant="link" className="p-0" onClick={() => navigate("/auth")}>
                  {tPage("signup.loginLink", language)}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverRegistration;