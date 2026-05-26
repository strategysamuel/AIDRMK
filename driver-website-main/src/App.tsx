import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Benefits from "./pages/Benefits";
import LegalIssue from "./pages/LegalIssue";
import Membership from "./pages/Membership";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignupWithPreview from "./pages/SignupWithPreview";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import DriverRegistration from "./pages/DriverRegistration";
import DriverRegistrationWithPIN from "./pages/DriverRegistrationWithPIN";
import PINLogin from "./pages/PINLogin";
import ForgotPIN from "./pages/ForgotPIN";
import TestKYCWorkflow from "./pages/TestKYCWorkflow";
import DriverDashboard from "./pages/DriverDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import TermsAndConditions from "./pages/TermsAndConditions";
import SchemeDetail from "./pages/SchemeDetail";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute, { AdminProtectedRoute } from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

// Pages that should NOT show the header/footer (auth screens)
const AUTH_PATHS = ["/pin-login", "/register", "/forgot-pin", "/login", "/signup", "/auth", "/driver-registration", "/admin-login", "/admin/dashboard"];

const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = AUTH_PATHS.some(p => location.pathname === p || location.pathname.startsWith("/admin"));

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/benefits/:id" element={<ProtectedRoute><SchemeDetail /></ProtectedRoute>} />
          <Route path="/legal-support" element={<ProtectedRoute><LegalIssue /></ProtectedRoute>} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Navigate to="/pin-login" replace />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />
          <Route path="/auth" element={<Navigate to="/pin-login" replace />} />
          <Route path="/driver-registration" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<DriverRegistrationWithPIN />} />
          <Route path="/pin-login" element={<PINLogin />} />
          <Route path="/forgot-pin" element={<ForgotPIN />} />
          <Route path="/test-kyc" element={<ProtectedRoute><TestKYCWorkflow /></ProtectedRoute>} />
          <Route path="/driver/dashboard" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
          <Route path="/driver-dashboard" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
          {/* Admin Routes - completely separate auth from customer auth */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}

      {/* WhatsApp Floating Button */}
      {!isAuthPage && (
        <a
          href="https://wa.me/917397641027"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp"
          className="wa-fab"
        >
          <svg viewBox="0 0 32 32" width="30" height="30" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.466 2.027 7.762L0 32l8.476-2.001A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.26 13.26 0 01-6.747-1.84l-.484-.287-5.03 1.187 1.215-4.904-.316-.502A13.267 13.267 0 012.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.274-9.863c-.397-.199-2.35-1.16-2.715-1.292-.363-.133-.628-.199-.893.199-.264.397-1.028 1.292-1.26 1.557-.232.264-.463.298-.86.1-.398-.199-1.68-.619-3.2-1.977-1.183-1.055-1.982-2.358-2.214-2.756-.232-.397-.025-.612.174-.81.178-.178.397-.463.596-.695.199-.232.264-.397.397-.662.133-.264.066-.496-.033-.695-.1-.199-.893-2.153-1.224-2.948-.322-.773-.648-.668-.893-.68l-.76-.013c-.264 0-.695.099-1.059.496-.363.397-1.39 1.358-1.39 3.312 0 1.953 1.423 3.842 1.622 4.106.199.265 2.8 4.274 6.783 5.993.948.41 1.688.654 2.265.837.952.303 1.818.26 2.502.157.763-.113 2.35-.96 2.682-1.888.333-.928.333-1.723.232-1.888-.099-.166-.363-.265-.76-.463z"/>
          </svg>
        </a>
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AppLayout />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
