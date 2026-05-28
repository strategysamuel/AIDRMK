import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { User, FileText, CreditCard, Gift, LogOut, ExternalLink, Clock, CheckCircle, XCircle, Upload, Trash2, Download, Pencil, Save, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import MembershipCardPreview from "@/components/MembershipCardPreview";
import { isSupportedDocumentFile, isSupportedImageFile, validateImageVisual, validateMaxFileSize } from "@/lib/fileValidation";

const DriverDashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const [driverData, setDriverData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingSchemes, setLoadingSchemes] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("license");
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDriverData();
    }
  }, [user]);

  useEffect(() => {
    if (driverData) {
      fetchSchemesAndApplications();
      fetchDocuments();
    }
  }, [driverData?.id]);

  const fetchDriverData = async () => {
    try {
      // Mock data for demo user
      if (user?.id === '00000000-0000-0000-0000-000000000000') {
        const mockData = {
          id: 'demo-driver-id',
          user_id: user.id,
          name: 'Demo Driver',
          mobile: '6302912969',
          whatsapp: '6302912969',
          dob: '1990-01-01',
          address: '123 Demo Street, Chennai',
          district: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600001',
          license_no: 'TN01-20230000001',
          license_valid_till: '2030-12-31',
          blood_group: 'O+ve',
          status: 'active',
          membership_id: 'AID-DEMO-001',
          membership_plan: 'gold',
          emergency_mobile: '7397641027',
          created_at: new Date().toISOString()
        };
        setDriverData(mockData);
        setEditFormData(mockData);
        setLoading(false);
        return;
      }

      // Get the current session user directly from Supabase (not just AuthContext)
      // to handle the case where AuthContext hasn't refreshed yet after registration
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting current user:', userError);
        throw userError;
      }

      const uid = currentUser?.id || user?.id;
      
      if (!uid) {
        console.warn('No user ID available');
        setLoading(false);
        return;
      }

      console.log('Fetching driver data for user_id:', uid);

      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', uid)
        .maybeSingle();

      if (error) {
        console.error('Error fetching driver data:', error);
        throw error;
      }

      console.log('Driver data fetched:', data);

      if (data) {
        // Enrich with membership plan from payments table if not on driver record
        if (!data.membership_plan) {
          const { data: paymentData } = await supabase
            .from('payments')
            .select('payment_type')
            .eq('driver_id', data.id)
            .like('payment_type', 'membership_%')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (paymentData?.payment_type) {
            data.membership_plan = paymentData.payment_type.replace('membership_', '');
          }
        }
        setDriverData(data);
        setEditFormData(data);
        // Clear any stale pending data
        localStorage.removeItem('pending_driver_data');
      } else {
        console.warn('No driver record found for user_id:', uid);
        // Fallback: show data from localStorage for freshly registered users
        const pending = localStorage.getItem('pending_driver_data');
        if (pending) {
          try {
            const parsed = JSON.parse(pending);
            setDriverData(parsed);
            setEditFormData(parsed);
          } catch { /* ignore parse errors */ }
        }
      }
    } catch (error: any) {
      console.error('Error fetching driver data:', error);
      toast.error("Failed to load driver data: " + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('drivers')
        .update({
          name: editFormData.name,
          address: editFormData.address,
          blood_group: editFormData.blood_group,
          emergency_mobile: editFormData.emergency_mobile,
          whatsapp: editFormData.whatsapp,
        })
        .eq('id', driverData.id);

      if (error) throw error;
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchDriverData();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradePlan = async (newPlan: string) => {
    try {
      setLoading(true);
      if (user?.id === '00000000-0000-0000-0000-000000000000') {
        setDriverData({ ...driverData, membership_plan: newPlan });
        toast.success(`Membership upgraded to ${newPlan.toUpperCase()}!`);
        return;
      }

      const { error } = await supabase
        .from('drivers')
        .update({ membership_plan: newPlan })
        .eq('id', driverData.id);

      if (error) throw error;
      
      // Reset counters so they can apply for things again
      localStorage.removeItem(`legalRequests_${user?.id}`);
      localStorage.removeItem(`schemeRequests_${user?.id}`);
      
      toast.success(`Membership upgraded to ${newPlan.toUpperCase()}!`);
      fetchDriverData();
    } catch (error: any) {
      console.error('Error upgrading plan:', error);
      toast.error("Failed to upgrade membership plan");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!driverData || user?.id === '00000000-0000-0000-0000-000000000000') return;
    
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("driver_id", driverData.id)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    }
  };

  const handleUploadDocument = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !driverData || !user) return;

    if (!validateMaxFileSize(file, 5)) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!isSupportedDocumentFile(file)) {
      toast.error("Only JPG, PNG, and PDF files are allowed");
      return;
    }

    if (["aadhaar", "license", "photo", "signature"].includes(selectedDocType)) {
      if (!isSupportedImageFile(file)) {
        toast.error("Please upload a clear image for this document type.");
        return;
      }

      const visualKind =
        selectedDocType === "photo" ? "portrait" :
        selectedDocType === "signature" ? "signature" :
        "document";

      try {
        const isValidVisual = await validateImageVisual(file, visualKind);
        if (!isValidVisual) {
          toast.error("This image does not match the selected document type.");
          return;
        }
      } catch {
        toast.error("Could not read this image. Please upload a clear JPG, PNG, or WEBP.");
        return;
      }
    }

    setUploadingDoc(true);
    try {
      // Upload to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${selectedDocType}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("driver-documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData, error: signError } = await supabase.storage
        .from("driver-documents")
        .createSignedUrl(fileName, 60 * 60 * 24 * 365);

      if (signError || !urlData?.signedUrl) throw signError ?? new Error("Failed to create document URL");

      // Save document record
      const { error: dbError } = await supabase.from("documents").insert({
        driver_id: driverData.id,
        type: selectedDocType,
        file_url: urlData.signedUrl,
      });

      if (dbError) throw dbError;

      if (selectedDocType === "photo") {
        const { error: driverError } = await supabase
          .from("drivers")
          .update({ photo_url: urlData.signedUrl, selfie_photo_url: urlData.signedUrl } as any)
          .eq("id", driverData.id);
        if (driverError) throw driverError;
        setDriverData((prev: any) => ({ ...prev, photo_url: urlData.signedUrl, selfie_photo_url: urlData.signedUrl }));
      }

      if (selectedDocType === "signature") {
        const { error: driverError } = await supabase
          .from("drivers")
          .update({ signature_url: urlData.signedUrl } as any)
          .eq("id", driverData.id);
        if (driverError) throw driverError;
        setDriverData((prev: any) => ({ ...prev, signature_url: urlData.signedUrl }));
      }

      toast.success("Document uploaded successfully!");
      fetchDocuments();
      
      // Reset file input
      event.target.value = "";
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDeleteDocument = async (docId: string, fileUrl: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      // Extract file path from URL
      const rawPath = fileUrl.split("/driver-documents/")[1];
      const filePath = rawPath ? decodeURIComponent(rawPath.split("?")[0]) : "";

      // Delete from storage
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("driver-documents")
          .remove([filePath]);

        if (storageError) throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", docId);

      if (dbError) throw dbError;

      toast.success("Document deleted successfully!");
      fetchDocuments();
    } catch (error: any) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  const fetchSchemesAndApplications = async () => {
    if (user?.id === '00000000-0000-0000-0000-000000000000') {
      setLoadingSchemes(false);
      return;
    }
    setLoadingSchemes(true);
    try {
      // Fetch all active schemes
      const { data: schemesData, error: schemesError } = await supabase
        .from("schemes")
        .select("*")
        .eq("is_active", true)
        .order("level", { ascending: true });

      if (schemesError) throw schemesError;
      setSchemes(schemesData || []);

      // Fetch driver's applications
      if (driverData) {
        const { data: appsData, error: appsError } = await supabase
          .from("applications")
          .select("*, schemes(*)")
          .eq("driver_id", driverData.id)
          .order("created_at", { ascending: false });

        if (appsError) throw appsError;
        setApplications(appsData || []);
      }
    } catch (error: any) {
      console.error("Error fetching schemes:", error);
      toast.error("Failed to load schemes");
    } finally {
      setLoadingSchemes(false);
    }
  };

  const handleApplyScheme = async (schemeId: string) => {
    if (!driverData) {
      toast.error("Driver profile not found");
      return;
    }

    const plan = driverData.membership_plan?.toLowerCase() || 'basic';
    if ((plan === 'basic' || plan === 'free' || plan === '₹0' || plan === '₹999') && applications.length >= 1) {
      toast.error("Basic members can only apply for 1 scheme. Please upgrade your plan to apply for more.");
      return;
    }

    try {
      const { error } = await supabase.from("applications").insert({
        driver_id: driverData.id,
        scheme_id: schemeId,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Application submitted successfully!");
      fetchSchemesAndApplications();
    } catch (error: any) {
      console.error("Error applying for scheme:", error);
      toast.error("Failed to submit application");
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getTitle = (scheme: any) => {
    return language === "ta" ? scheme.title_ta : language === "hi" ? scheme.title_hi : scheme.title_en;
  };

  const getDescription = (scheme: any) => {
    return language === "ta" ? scheme.description_ta : language === "hi" ? scheme.description_hi : scheme.description_en;
  };

  const getCardPhotoUrl = () => {
    const photoDoc = documents.find((doc: any) =>
      ["photo", "selfie", "PHOTO", "SELFIE"].includes(doc.type)
    );

    return driverData.selfie_photo_url || driverData.photo_url || photoDoc?.file_url || "";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!driverData) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Complete Your Registration</CardTitle>
              <CardDescription>Please complete your driver profile to access the dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/register")} className="w-full">
                Complete Registration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'expired': return 'bg-red-500';
      case 'rejected': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Driver Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {driverData.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Status Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{driverData.name}</h2>
                    <Badge className={getStatusColor(driverData.status)}>
                      {driverData.status?.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">Membership ID: {driverData.membership_id}</p>
                  {driverData.has_accepted_terms && (
                    <p className="text-sm text-green-600 mt-1">✓ Terms accepted on {new Date(driverData.accepted_at).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Member since</p>
                  <p className="font-medium">{new Date(driverData.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="payments">
                <CreditCard className="h-4 w-4 mr-2" />
                Payments
              </TabsTrigger>
              <TabsTrigger value="benefits">
                <Gift className="h-4 w-4 mr-2" />
                Benefits
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your registered driver details</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button variant="default" size="sm" onClick={handleUpdateProfile}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input 
                          value={editFormData.name} 
                          onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>WhatsApp Number</Label>
                        <Input 
                          value={editFormData.whatsapp} 
                          onChange={(e) => setEditFormData({...editFormData, whatsapp: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Blood Group</Label>
                        <Input 
                          value={editFormData.blood_group} 
                          onChange={(e) => setEditFormData({...editFormData, blood_group: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Emergency Mobile</Label>
                        <Input 
                          value={editFormData.emergency_mobile} 
                          onChange={(e) => setEditFormData({...editFormData, emergency_mobile: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label>Address</Label>
                        <Input 
                          value={editFormData.address} 
                          onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{driverData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mobile</p>
                        <p className="font-medium">{driverData.mobile}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">WhatsApp</p>
                        <p className="font-medium">{driverData.whatsapp || driverData.mobile}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">{new Date(driverData.dob).toLocaleDateString()}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{driverData.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">District</p>
                        <p className="font-medium">{driverData.district}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">State</p>
                        <p className="font-medium">{driverData.state}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pincode</p>
                        <p className="font-medium">{driverData.pincode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">License Number</p>
                        <p className="font-medium">{driverData.license_no}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">License Valid Till</p>
                        <p className="font-medium">{new Date(driverData.license_valid_till).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Blood Group</p>
                        <p className="font-medium">{driverData.blood_group || "Not Provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Emergency Mobile</p>
                        <p className="font-medium">{driverData.emergency_mobile || "Not Provided"}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Vehicle Types</p>
                        <div className="flex gap-2 mt-1">
                          {driverData.vehicle_types?.map((type: string) => (
                            <Badge key={type} variant="secondary">{type}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Membership Card */}
              {driverData.membership_id && (
                <Card className="mt-4">
                  <CardHeader 
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setCardVisible(v => !v)}
                  >
                    <div>
                      <CardTitle>Membership Card</CardTitle>
                      <CardDescription>View and download your digital membership card</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Download icon only - no text */}
                      <Button
                        variant="outline"
                        size="icon"
                        title="Download Card"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            const element = document.getElementById('membership-card-preview');
                            if (!element) { toast.error('Please show the card first using the + button.'); return; }
                            toast.info('Generating membership card...');
                            const html2canvas = (await import('html2canvas')).default;
                            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
                            const link = document.createElement('a');
                            link.download = `membership-card-${driverData.membership_id}.png`;
                            link.href = canvas.toDataURL('image/png');
                            link.click();
                            toast.success('Membership card downloaded!');
                          } catch (err) {
                            console.error(err);
                            toast.error('Failed to generate membership card.');
                          }
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {/* +/- toggle to show/hide card */}
                      <Button
                        variant="outline"
                        size="icon"
                        title={cardVisible ? 'Hide Card' : 'Show Card'}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCardVisible(v => !v);
                        }}
                        className="text-lg font-bold leading-none"
                      >
                        {cardVisible ? '−' : '+'}
                      </Button>
                    </div>
                  </CardHeader>
                  {cardVisible && (
                    <CardContent>
                      <div className="pb-4 flex justify-center">
                        <div id="membership-card-preview" className="w-full max-w-[540px] bg-background">
                          <MembershipCardPreview
                            formData={{
                              fullName: driverData.name,
                              fatherOrHusband: driverData.father_or_husband_name || "Not Provided",
                              dob: new Date(driverData.dob).toLocaleDateString(),
                              dlNo: driverData.license_no,
                              address: driverData.address,
                              bloodGroup: driverData.blood_group || "Not Provided",
                              mobileNo: driverData.mobile,
                              emergencyMobile: driverData.emergency_mobile || "7397641027",
                              membershipPlan: driverData.membership_plan || "basic",
                              membershipId: driverData.membership_id,
                            }}
                            photoUrl={getCardPhotoUrl()}
                          />
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Upgrade Membership */}
              <Card className="mt-4 border-primary">
                <CardHeader>
                  <CardTitle>Upgrade Membership</CardTitle>
                  <CardDescription>Upgrade your plan to unlock more benefits like unlimited Legal and Scheme requests.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4 flex-wrap">
                  <Select onValueChange={handleUpgradePlan}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select New Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (₹2,999)</SelectItem>
                      <SelectItem value="premium">Premium (₹9,999)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Selecting a plan will immediately upgrade your profile.</p>
                </CardContent>
              </Card>

            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Upload and manage your documents</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Upload Section */}
                  <div className="mb-6 p-4 border-2 border-dashed rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="docType" className="font-bold uppercase tracking-wider text-xs">Document Type</Label>
                        <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                          <SelectTrigger className="rounded-none border-border">
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-border">
                            <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                            <SelectItem value="pan">PAN Card</SelectItem>
                            <SelectItem value="signature">Signature</SelectItem>
                            <SelectItem value="photo">Passport-size Photo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="file-upload" className="font-bold uppercase tracking-wider text-xs">Upload File (Max 5MB - JPG, PNG, PDF)</Label>
                        <Input
                          id="file-upload"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,application/pdf"
                          onChange={handleUploadDocument}
                          disabled={uploadingDoc}
                          className="mt-2"
                        />
                      </div>
                      {uploadingDoc && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          Uploading...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documents List */}
                  {documents.length > 0 ? (
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium capitalize">{doc.type.replace("_", " ")}</p>
                              <p className="text-sm text-muted-foreground">
                                Uploaded on {new Date(doc.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                View
                              </a>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id, doc.file_url)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No documents uploaded yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>View your membership and donation payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No payment history yet</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits">
              <div className="space-y-6">
                {/* My Applications */}
                {applications.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>My Applications</CardTitle>
                      <CardDescription>Track your scheme applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {applications.map((app) => (
                          <div key={app.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold">{getTitle(app.schemes)}</h4>
                              <Badge
                                variant={
                                  app.status === "approved"
                                    ? "default"
                                    : app.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {app.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                                {app.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                                {app.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                                {app.status.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Applied on: {new Date(app.created_at).toLocaleDateString()}
                            </p>
                            {app.admin_notes && (
                              <p className="text-sm mt-2 p-2 bg-muted rounded">
                                <strong>Admin Notes:</strong> {app.admin_notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Available Schemes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Available Schemes</CardTitle>
                    <CardDescription>Apply for government welfare programs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingSchemes ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {schemes
                          .filter(
                            (scheme) =>
                              !applications.some((app) => app.scheme_id === scheme.id)
                          )
                          .map((scheme) => (
                            <div key={scheme.id} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-bold">{getTitle(scheme)}</h4>
                                    <Badge variant={scheme.level === "central" ? "default" : "secondary"}>
                                      {scheme.level === "central" ? "Central" : "State"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                    {getDescription(scheme)}
                                  </p>
                                  {scheme.max_benefit_amount && scheme.max_benefit_amount > 0 && (
                                    <p className="text-sm font-semibold text-primary">
                                      Max Benefit: ₹{scheme.max_benefit_amount.toLocaleString("en-IN")}
                                      {scheme.benefit_unit && scheme.benefit_unit !== "INR" && ` ${scheme.benefit_unit}`}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  onClick={() => handleApplyScheme(scheme.id)}
                                  disabled={driverData?.status !== "active"}
                                >
                                  Apply Now
                                </Button>
                                {scheme.official_link && (
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={scheme.official_link} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Details
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        {schemes.filter(
                          (scheme) =>
                            !applications.some((app) => app.scheme_id === scheme.id)
                        ).length === 0 && (
                          <div className="text-center py-8">
                            <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                              You've applied to all available schemes!
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
