import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, Gift, LogOut, Search, BarChart3, Image as ImageIcon,
  ExternalLink, DollarSign, ShoppingBag, MessageSquare, RefreshCw,
  CheckCircle, XCircle
} from "lucide-react";
import { SchemesManager } from "@/components/admin/SchemesManager";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { MembershipDocGenerator } from "@/components/admin/MembershipDocGenerator";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");
  const adminName = localStorage.getItem("admin_name") || "Admin";

  useEffect(() => {
    // Double-check admin auth
    if (localStorage.getItem("admin_auth") !== "true") {
      navigate("/admin-login", { replace: true });
      return;
    }
    fetchDrivers();

    const channel = supabase
      .channel('drivers-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'drivers' },
        (payload) => {
          fetchDrivers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("drivers")
        .select(`
            *,
            payments(payment_type, status, created_at),
            documents(type, file_url)
          `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setDrivers(data || []);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_name");
    navigate("/admin-login", { replace: true });
  };

  const handleApprove = async (id: string) => {
    await supabase.from("drivers").update({ status: "active", is_verified: true } as any).eq("id", id);
    toast.success("Driver approved");
    fetchDrivers();
  };

  const handleReject = async (id: string) => {
    await supabase.from("drivers").update({ status: "rejected" } as any).eq("id", id);
    toast.success("Driver rejected");
    fetchDrivers();
  };

  const filtered = drivers.filter(d =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.mobile?.includes(searchTerm) ||
    d.membership_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Parse membership plan — reads from membership_plan column or payments table
  const getPlan = (driver: any): string => {
    if (driver.membership_plan) return driver.membership_plan;
    // Fall back to payments join
    const membershipPayment = driver.payments?.find((p: any) =>
      p.payment_type?.startsWith('membership_')
    );
    if (membershipPayment) {
      return membershipPayment.payment_type.replace('membership_', '');
    }
    return '—';
  };

  // Parse kyc state
  const getKycState = (driver: any): string => {
    return driver.kyc_status || '—';
  };

  const getMembershipExpiry = (driver: any): Date | null => {
    if (!driver.created_at) return null;
    const createdAt = new Date(driver.created_at);
    if (Number.isNaN(createdAt.getTime())) return null;

    const plan = getPlan(driver).toUpperCase();
    if (plan === "BASIC" || plan === "FREE") {
      const expiry = new Date(createdAt);
      expiry.setFullYear(expiry.getFullYear() + 1);
      return expiry;
    }
    if (plan === "STANDARD") {
      const expiry = new Date(createdAt);
      expiry.setFullYear(expiry.getFullYear() + 5);
      return expiry;
    }
    return null;
  };

  const getMembershipValidityLabel = (driver: any): string => {
    const plan = getPlan(driver).toUpperCase();
    if (plan === "PREMIUM") return "Lifetime";

    const expiry = getMembershipExpiry(driver);
    if (!expiry) return "Unknown";

    const days = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return `Expired ${Math.abs(days)} days ago`;
    if (days === 0) return "Expires today";
    return `${days} days left`;
  };

  const getMembershipExpiryLabel = (driver: any): string => {
    const expiry = getMembershipExpiry(driver);
    if (!expiry) return getPlan(driver).toUpperCase() === "PREMIUM" ? "Lifetime" : "Unknown";
    return expiry.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const stats = {
    total: drivers.length,
    active: drivers.filter(d => d.status === "active").length,
    pending: drivers.filter(d => d.status === "pending").length,
    revenue: drivers.filter(d => d.status === "active").length * 500,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm">AIDRMK Admin</span>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                <span className="text-xs text-green-600 font-medium">Live sync active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
              <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{adminName.charAt(0)}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{adminName}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-400 rounded-full gap-1.5">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Row + Customer Page Button */}
        <div className="flex flex-wrap gap-3 mb-6 items-stretch">
          {/* Go to Customer Page */}
          <button
            onClick={() => window.open("/", "_blank")}
            className="flex items-center gap-3 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl px-5 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 min-w-[140px]"
          >
            <ExternalLink className="h-5 w-5 flex-shrink-0" />
            <div className="text-left">
              <div className="text-xs opacity-80">Go to</div>
              <div className="font-bold text-sm leading-tight">Customer Page</div>
            </div>
          </button>

          {/* Stat Cards */}
          {[
            { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
            { label: "Total Members", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active Members", value: stats.active, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Pending Members", value: stats.pending, icon: ShoppingBag, color: "text-orange-600", bg: "bg-orange-50" },
          ].map((s) => (
            <div key={s.label} className="flex-1 min-w-[140px] bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
              <div className={`${s.bg} rounded-xl p-2`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <div className="text-xs text-gray-500">{s.label}</div>
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            </div>
          ))}

          <Button variant="outline" size="icon" onClick={fetchDrivers} className="rounded-xl h-auto aspect-square self-stretch" title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-gray-200 rounded-xl p-1 h-auto flex-wrap gap-1 mb-4 shadow-sm">
            {[
              { value: "analytics", label: "Analytics", icon: BarChart3 },
              { value: "users", label: "Users", icon: Users },
              { value: "schemes", label: "Schemes", icon: Gift },
              { value: "gallery", label: "Gallery", icon: ImageIcon },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}
                className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center gap-2">
                <tab.icon className="h-4 w-4" />{tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid gap-4">
              <Card className="rounded-2xl shadow-sm border-gray-100">
                <CardHeader><CardTitle className="text-base">Registration Trend (Last 30 Days)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={Array.from({ length: 30 }, (_, i) => {
                      const date = new Date(); date.setDate(date.getDate() - (29 - i));
                      const ds = date.toISOString().split("T")[0];
                      return {
                        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                        registrations: drivers.filter(d => d.created_at?.split("T")[0] === ds).length
                      };
                    })}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="registrations" stroke="#dc2626" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="rounded-2xl shadow-sm border-gray-100">
                  <CardHeader><CardTitle className="text-base">Member Status</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={[
                          { name: "Active", value: stats.active, color: "#22c55e" },
                          { name: "Pending", value: stats.pending, color: "#f59e0b" },
                          { name: "Rejected", value: drivers.filter(d => d.status === "rejected").length, color: "#ef4444" },
                        ].filter(x => x.value > 0)} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                          {[{ color: "#22c55e" }, { color: "#f59e0b" }, { color: "#ef4444" }].map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl shadow-sm border-gray-100">
                  <CardHeader><CardTitle className="text-base">Membership Plans</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={["BASIC", "STANDARD", "PREMIUM"].map(plan => ({
                        plan: plan.charAt(0) + plan.slice(1).toLowerCase(),
                        count: drivers.filter(d => getPlan(d) === plan).length
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="plan" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="rounded-2xl shadow-sm border-gray-100">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">Registered Users</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} member{filtered.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search name, phone, ID..." value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)} className="pl-9 rounded-xl" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Customer ID</TableHead>
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Address</TableHead>
                        <TableHead className="font-semibold">Phone</TableHead>
                        <TableHead className="font-semibold">Aadhaar No.</TableHead>
                        <TableHead className="font-semibold">License No.</TableHead>
                        <TableHead className="font-semibold">Membership Plan</TableHead>
                        <TableHead className="font-semibold">Valid Until</TableHead>
                        <TableHead className="font-semibold">Days Active</TableHead>
                        <TableHead className="font-semibold">KYC Status</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={12} className="text-center py-12 text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                              <span className="text-sm">Loading users...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filtered.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={12} className="text-center py-12 text-muted-foreground">
                            <Users className="h-10 w-10 mx-auto mb-2 opacity-20" />
                            <p>No users found</p>
                          </TableCell>
                        </TableRow>
                      ) : filtered.map(driver => (
                        <TableRow key={driver.id} className="hover:bg-gray-50">
                          <TableCell className="font-mono text-xs font-semibold text-red-700">{driver.membership_id || "—"}</TableCell>
                          <TableCell className="font-medium">{driver.name || "—"}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[140px] truncate" title={driver.address}>{driver.address || driver.district || "—"}</TableCell>
                          <TableCell>{driver.mobile || "—"}</TableCell>
                          <TableCell className="font-mono text-xs">{driver.aadhaar_no || "—"}</TableCell>
                          <TableCell className="font-mono text-xs">{driver.license_no || "—"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`capitalize text-xs font-semibold ${
                              getPlan(driver) === 'PREMIUM' ? 'border-purple-400 text-purple-700 bg-purple-50' :
                              getPlan(driver) === 'STANDARD' ? 'border-red-400 text-red-700 bg-red-50' :
                              getPlan(driver) === 'BASIC' ? 'border-yellow-400 text-yellow-700 bg-yellow-50' :
                              ''
                            }`}>
                              {getPlan(driver)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm whitespace-nowrap">{getMembershipExpiryLabel(driver)}</TableCell>
                          <TableCell className="text-sm whitespace-nowrap">
                            <Badge variant="outline" className={`text-xs ${
                              getMembershipValidityLabel(driver).startsWith("Expired") ? "border-red-400 text-red-700 bg-red-50" :
                              getMembershipValidityLabel(driver) === "Lifetime" ? "border-purple-400 text-purple-700 bg-purple-50" :
                              "border-green-400 text-green-700 bg-green-50"
                            }`}>
                              {getMembershipValidityLabel(driver)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-xs capitalize ${
                              getKycState(driver) === 'submitted' ? 'border-blue-400 text-blue-700 bg-blue-50' :
                              getKycState(driver) === 'pending' ? 'border-gray-400 text-gray-600' :
                              getKycState(driver) === 'verified' ? 'border-green-400 text-green-700 bg-green-50' :
                              ''
                            }`}>
                              {getKycState(driver)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              driver.status === "active" ? "bg-green-500 text-white" :
                              driver.status === "pending" ? "bg-amber-500 text-white" :
                              driver.status === "rejected" ? "bg-red-500 text-white" : "bg-gray-400 text-white"
                            }>
                              {driver.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1.5">
                              {driver.status === "pending" && (
                                <>
                                  <Button size="icon" variant="outline" onClick={() => handleApprove(driver.id)}
                                    className="h-8 w-8 hover:bg-green-50 hover:border-green-400" title="Approve">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button size="icon" variant="outline" onClick={() => handleReject(driver.id)}
                                    className="h-8 w-8 hover:bg-red-50 hover:border-red-400" title="Reject">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                              <MembershipDocGenerator driver={driver} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schemes Tab */}
          <TabsContent value="schemes">
            <Card className="rounded-2xl shadow-sm border-gray-100">
              <CardHeader><CardTitle className="text-base">Scheme Management</CardTitle></CardHeader>
              <CardContent><SchemesManager /></CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <Card className="rounded-2xl shadow-sm border-gray-100">
              <CardHeader><CardTitle className="text-base">Gallery Management</CardTitle></CardHeader>
              <CardContent><GalleryManager /></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
