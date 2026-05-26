import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ShieldCheck, User, Phone, Mail, Lock, AlertCircle } from "lucide-react";
import flagLogo from "@/assets/gallery/flag-logo.jpeg";

// Admin credentials - hardcoded, never displayed in UI
const ADMIN_CREDENTIALS = {
  email: "strategysamuel@gmail.com",
  phone: "9841141027",
  username: "SamuelA",
  password: "D8eJAMebTQwN@5S",
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "", // username / phone / email
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Simulate a short delay for UX
    setTimeout(() => {
      const { identifier, password } = formData;

      const identifierMatch =
        identifier === ADMIN_CREDENTIALS.email ||
        identifier === ADMIN_CREDENTIALS.phone ||
        identifier === ADMIN_CREDENTIALS.username;

      const passwordMatch = password === ADMIN_CREDENTIALS.password;

      if (identifierMatch && passwordMatch) {
        localStorage.setItem("admin_auth", "true");
        localStorage.setItem("admin_name", "Samuel A");
        navigate("/admin/dashboard", { replace: true });
      } else {
        setErrorMsg("Incorrect login details.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 relative overflow-hidden">
      {/* Decorative background orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-700/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-900/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-red-800/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl border-2 border-red-400/40 bg-white/10 backdrop-blur flex items-center justify-center overflow-hidden shadow-xl">
                  <img src={flagLogo} alt="AIDRMK" className="h-full w-full object-contain" />
                </div>
                <div className="absolute -bottom-2 -right-2 h-7 w-7 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Admin Portal</h1>
            <p className="text-white/50 text-sm">AIDRMK — Restricted Access</p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-5 flex items-center gap-3 bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-300">
              <AlertCircle className="h-5 w-5 text-red-300 flex-shrink-0" />
              <p className="text-red-200 text-sm font-medium">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identifier Field */}
            <div className="space-y-2">
              <Label className="text-white/70 text-xs font-bold uppercase tracking-widest">
                Username / Phone / Email
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1 text-white/40">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  id="admin-identifier"
                  type="text"
                  placeholder="Enter username, phone, or email"
                  value={formData.identifier}
                  onChange={(e) => handleChange("identifier", e.target.value)}
                  required
                  autoComplete="username"
                  className="pl-9 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/30 rounded-xl focus-visible:ring-red-400/50 focus-visible:border-red-400/50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label className="text-white/70 text-xs font-bold uppercase tracking-widest">
                Password
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pl-9 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/30 rounded-xl focus-visible:ring-red-400/50 focus-visible:border-red-400/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-red-900/40 transition-all duration-200 active:scale-95"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Secure Login
                </span>
              )}
            </Button>
          </form>

          {/* Footer Note */}
          <p className="text-center text-white/25 text-xs mt-6">
            This portal is restricted to authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
