import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Scale, Heart, Users, GraduationCap, Truck, Car, Bus, Shield, Phone, Mail, MapPin, CheckCircle2, TrendingUp, Award, FileText } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCard from "@/components/TestimonialCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { tPage } from "@/translations/all-pages";
import { useAuth } from "@/contexts/AuthContext";
import { assetPath } from "@/lib/assets";

const driverHero1 = assetPath("legal_help_driver.png");
const driverHero2 = assetPath("community_support_driver.png");
const driverHero3 = assetPath("welfare_benefits_driver.png");
const cityscapeOutline = assetPath("cityscape-outline.png");
const eshramLogo = assetPath("eshram-logo.png");
const carLegal = assetPath("car-legal.png");

const Index = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 bg-secondary">
        <div 
          className="absolute inset-0 opacity-5"
          // @ts-ignore - necessary for dynamic image path
          style={{ 
            backgroundImage: `url(${cityscapeOutline})`,
            backgroundRepeat: "repeat-x",
            backgroundPosition: "bottom",
            backgroundSize: "contain"
          } as React.CSSProperties}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-block mb-6 border border-primary px-6 py-2 rounded-none">
              <span className="text-xs uppercase tracking-widest font-semibold text-primary">All India Drivers Munnetra Kazhagam</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight text-foreground">
              {tPage("home.heroTitle", language)}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-4 leading-relaxed font-sans font-light">
              {tPage("home.heroSubtitle", language)}
            </p>
            <p className="font-medium mb-10 text-foreground/70 uppercase tracking-widest text-sm">
              {tPage("home.heroTagline", language)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <Button size="lg" className="text-sm uppercase tracking-wider px-10 py-7 group" asChild>
                  <Link to="/membership" className="flex items-center gap-2">
                    {tPage("home.joinCommunity", language)}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="text-sm uppercase tracking-wider px-10 py-7 group" asChild>
                  <Link to="/driver-dashboard" className="flex items-center gap-2">
                    {language === 'ta' ? 'எனது டேஷ்போர்டு' : language === 'hi' ? 'मेरा डैशबोर्ड' : 'Go to Dashboard'}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="outline" className="text-sm uppercase tracking-wider font-semibold px-10 py-7 border-2" asChild>
                <Link to="/about">{tPage("home.learnMore", language)}</Link>
              </Button>
            </div>
          </div>

          {/* Driver Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="relative group overflow-hidden rounded-[8px] shadow-xl">
              <img src={driverHero1} alt="Truck Driver" className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-background text-foreground px-6 py-3 rounded-none text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-3">
                  <Scale className="h-4 w-4" /> {tPage("home.legalHelp", language)}
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-[8px] shadow-xl md:mt-12">
              <img src={driverHero2} alt="Taxi Driver" className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-background text-foreground px-6 py-3 rounded-none text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-3">
                  <Users className="h-4 w-4" /> {tPage("home.communitySupport", language)}
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-[8px] shadow-xl">
              <img src={driverHero3} alt="Auto Driver" className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-background text-foreground px-6 py-3 rounded-none text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-3">
                  <Heart className="h-4 w-4" /> {tPage("home.welfareBenefits", language)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-serif font-bold mb-4">50K+</div>
              <div className="text-xs md:text-sm uppercase tracking-widest opacity-90 font-semibold">{tPage("home.activeMembers", language)}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-serif font-bold mb-4">10K+</div>
              <div className="text-xs md:text-sm uppercase tracking-widest opacity-90 font-semibold">{tPage("home.casesResolved", language)}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-serif font-bold mb-4">28</div>
              <div className="text-xs md:text-sm uppercase tracking-widest opacity-90 font-semibold">{tPage("home.statesCovered", language)}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-serif font-bold mb-4">98%</div>
              <div className="text-xs md:text-sm uppercase tracking-widest opacity-90 font-semibold">{tPage("home.satisfaction", language)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block mb-6 border-b-2 border-primary pb-2">
                  <span className="text-xs uppercase tracking-widest font-semibold text-primary">{tPage("home.aboutUs", language)}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 text-foreground">{tPage("home.whoWeAre", language)}</h2>
                <p className="text-lg text-foreground/80 mb-8 leading-relaxed font-light">
                  {tPage("home.whoWeAreDesc", language)}
                </p>
                <div className="space-y-6 mb-12">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1 text-lg">{tPage("home.expertLegalTeam", language)}</h4>
                      <p className="text-foreground/70">{tPage("home.expertLegalTeamDesc", language)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1 text-lg">{tPage("home.comprehensiveBenefits", language)}</h4>
                      <p className="text-foreground/70">{tPage("home.comprehensiveBenefitsDesc", language)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1 text-lg">{tPage("home.strongNetwork", language)}</h4>
                      <p className="text-foreground/70">{tPage("home.strongNetworkDesc", language)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button size="lg" className="uppercase text-xs tracking-wider px-8 py-6" asChild>
                    <Link to="/about">{tPage("home.readMore", language)}</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="uppercase text-xs tracking-wider font-semibold px-8 py-6 border-2" asChild>
                    <Link to="/contact">{tPage("home.contactUs", language)}</Link>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-8 text-center rounded-none shadow-none border border-border bg-background hover:bg-secondary transition-colors duration-300">
                  <Award className="h-10 w-10 text-primary mx-auto mb-6" />
                  <h4 className="font-serif font-bold mb-3 text-lg">{tPage("home.certified", language)}</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">{tPage("home.certifiedDesc", language)}</p>
                </Card>
                <Card className="p-8 text-center mt-12 rounded-none shadow-none border border-border bg-background hover:bg-secondary transition-colors duration-300">
                  <TrendingUp className="h-10 w-10 text-primary mx-auto mb-6" />
                  <h4 className="font-serif font-bold mb-3 text-lg">{tPage("home.growing", language)}</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">{tPage("home.growingDesc", language)}</p>
                </Card>
                <Card className="p-8 text-center rounded-none shadow-none border border-border bg-background hover:bg-secondary transition-colors duration-300">
                  <Shield className="h-10 w-10 text-primary mx-auto mb-6" />
                  <h4 className="font-serif font-bold mb-3 text-lg">{tPage("home.trusted", language)}</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">{tPage("home.trustedDesc", language)}</p>
                </Card>
                <Card className="p-8 text-center mt-12 rounded-none shadow-none border border-border bg-background hover:bg-secondary transition-colors duration-300">
                  <FileText className="h-10 w-10 text-primary mx-auto mb-6" />
                  <h4 className="font-serif font-bold mb-3 text-lg">{tPage("home.transparent", language)}</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">{tPage("home.transparentDesc", language)}</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-32 bg-secondary border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <div className="inline-block mb-6 border-b-2 border-primary pb-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-primary">{tPage("home.ourServices", language)}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-foreground">{tPage("home.whatWeOffer", language)}</h2>
            <p className="text-lg text-foreground/70 font-light leading-relaxed">{tPage("home.ourCoreServices", language)}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <Link to="/legal-support" className="block h-full">
              <Card className="h-full rounded-none border border-border bg-background hover:border-primary transition-all duration-300 shadow-none p-8 text-center group">
                <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-secondary group-hover:bg-primary transition-colors duration-300">
                  <Scale className="h-8 w-8 text-foreground group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-4 text-foreground">{tPage("home.legalSupport", language)}</h3>
                <p className="text-foreground/70 font-light text-sm leading-relaxed">{tPage("home.legalSupportDesc", language)}</p>
              </Card>
            </Link>
            <Link to="/benefits" className="block h-full">
              <Card className="h-full rounded-none border border-border bg-background hover:border-primary transition-all duration-300 shadow-none p-8 text-center group">
                <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-secondary group-hover:bg-primary transition-colors duration-300">
                  <Heart className="h-8 w-8 text-foreground group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-4 text-foreground">{tPage("home.welfareAssistance", language)}</h3>
                <p className="text-foreground/70 font-light text-sm leading-relaxed">{tPage("home.welfareAssistanceDesc", language)}</p>
              </Card>
            </Link>
            <Link to="/membership" className="block h-full">
              <Card className="h-full rounded-none border border-border bg-background hover:border-primary transition-all duration-300 shadow-none p-8 text-center group">
                <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-secondary group-hover:bg-primary transition-colors duration-300">
                  <Users className="h-8 w-8 text-foreground group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-4 text-foreground">{tPage("home.communitySupport", language)}</h3>
                <p className="text-foreground/70 font-light text-sm leading-relaxed">{tPage("home.communitySupportDesc", language)}</p>
              </Card>
            </Link>
            <Link to="/about" className="block h-full">
              <Card className="h-full rounded-none border border-border bg-background hover:border-primary transition-all duration-300 shadow-none p-8 text-center group">
                <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-secondary group-hover:bg-primary transition-colors duration-300">
                  <GraduationCap className="h-8 w-8 text-foreground group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-4 text-foreground">{tPage("home.trainingAwareness", language)}</h3>
                <p className="text-foreground/70 font-light text-sm leading-relaxed">{tPage("home.trainingAwarenessDesc", language)}</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Driver Welfare Benefits */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <div className="inline-block mb-6 border-b-2 border-primary pb-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-primary">{tPage("home.benefits", language)}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-foreground">{tPage("home.driverWelfareBenefits", language)}</h2>
            <p className="text-lg text-foreground/70 font-light leading-relaxed">
              {tPage("home.driverWelfareDesc", language)}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <Card className="rounded-none shadow-none border border-border hover:border-primary transition-colors duration-300">
              <CardContent className="p-10">
                <div className="text-5xl mb-8">🏥</div>
                <h3 className="text-2xl font-serif font-bold mb-4">{tPage("home.healthInsurance", language)}</h3>
                <p className="text-foreground/70 font-light mb-8 leading-relaxed">
                  {tPage("home.healthInsuranceDesc", language)}
                </p>
                <Button variant="link" className="p-0 text-primary font-bold uppercase tracking-wider text-xs group" asChild>
                  <Link to="/benefits" className="flex items-center gap-2">
                    {tPage("home.readMore", language)}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="rounded-none shadow-none border border-border hover:border-primary transition-colors duration-300">
              <CardContent className="p-10">
                <div className="text-5xl mb-8">🧓</div>
                <h3 className="text-2xl font-serif font-bold mb-4">{tPage("home.pensionPlans", language)}</h3>
                <p className="text-foreground/70 font-light mb-8 leading-relaxed">
                  {tPage("home.pensionPlansDesc", language)}
                </p>
                <Button variant="link" className="p-0 text-primary font-bold uppercase tracking-wider text-xs group" asChild>
                  <Link to="/benefits" className="flex items-center gap-2">
                    {tPage("home.readMore", language)}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="rounded-none shadow-none border border-border hover:border-primary transition-colors duration-300">
              <CardContent className="p-10">
                <div className="text-5xl mb-8">💰</div>
                <h3 className="text-2xl font-serif font-bold mb-4">{tPage("home.accidentCover", language)}</h3>
                <p className="text-foreground/70 font-light mb-8 leading-relaxed">
                  {tPage("home.accidentCoverDesc", language)}
                </p>
                <Button variant="link" className="p-0 text-primary font-bold uppercase tracking-wider text-xs group" asChild>
                  <Link to="/benefits" className="flex items-center gap-2">
                    {tPage("home.readMore", language)}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          {!user && (
            <div className="text-center mt-16">
              <Button size="lg" className="uppercase text-xs tracking-wider px-10 py-7" asChild>
                <Link to="/membership">{tPage("home.becomeMember", language)}</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Government Schemes */}
      <section className="py-32 bg-secondary border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <div className="inline-block mb-6 border-b-2 border-primary pb-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-primary">{tPage("home.schemes", language)}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-foreground">{tPage("home.featuredSchemes", language)}</h2>
            <p className="text-lg text-foreground/70 font-light leading-relaxed">
              {tPage("home.featuredSchemesDesc", language)}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="rounded-none shadow-none border border-border hover:border-primary transition-colors duration-300 bg-background">
              <CardContent className="p-12">
                <img src={eshramLogo} alt="e-Shram Logo" className="h-24 w-auto mb-8 rounded-none grayscale opacity-80" />
                <h3 className="text-3xl font-serif font-bold mb-8 text-foreground">{tPage("home.eshramTitle", language)}</h3>
                <div className="space-y-6 mb-12">
                  <div className="border-l-2 border-primary pl-6">
                    <h4 className="font-bold mb-2 uppercase tracking-wider text-xs">{tPage("home.benefit", language)}</h4>
                    <p className="text-foreground/70 font-light">{tPage("home.eshramBenefit", language)}</p>
                  </div>
                  <div className="border-l-2 border-border pl-6">
                    <h4 className="font-bold mb-2 uppercase tracking-wider text-xs">{tPage("home.whatYouGet", language)}</h4>
                    <p className="text-foreground/70 font-light">{tPage("home.eshramWhatYouGet", language)}</p>
                  </div>
                  <div className="border-l-2 border-border pl-6">
                    <h4 className="font-bold mb-2 uppercase tracking-wider text-xs">{tPage("home.whoCanApply", language)}</h4>
                    <p className="text-foreground/70 font-light">{tPage("home.eshramWhoCanApply", language)}</p>
                  </div>
                </div>
                <Button className="w-full uppercase text-xs tracking-wider py-6" asChild>
                  <Link to="/benefits">{tPage("home.getChecklistPdf", language)}</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="rounded-none shadow-none border border-border hover:border-primary transition-colors duration-300 bg-background">
              <CardContent className="p-12">
                <div className="h-24 w-24 mb-8 rounded-full border border-border flex items-center justify-center">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-3xl font-serif font-bold mb-8 text-foreground">{tPage("home.pmsbTitle", language)}</h3>
                <div className="space-y-6 mb-12">
                  <div className="border-l-2 border-primary pl-6">
                    <h4 className="font-bold mb-2 uppercase tracking-wider text-xs">{tPage("home.benefit", language)}</h4>
                    <p className="text-foreground/70 font-light">{tPage("home.pmsbBenefit", language)}</p>
                  </div>
                  <div className="border-l-2 border-border pl-6">
                    <h4 className="font-bold mb-2 uppercase tracking-wider text-xs">{tPage("home.whatYouGet", language)}</h4>
                    <p className="text-foreground/70 font-light">{tPage("home.pmsbWhatYouGet", language)}</p>
                  </div>
                  <div className="border-l-2 border-border pl-6">
                    <h4 className="font-bold mb-2 uppercase tracking-wider text-xs">{tPage("home.whoCanApply", language)}</h4>
                    <p className="text-foreground/70 font-light">{tPage("home.pmsbWhoCanApply", language)}</p>
                  </div>
                </div>
                <Button className="w-full uppercase text-xs tracking-wider py-6" asChild>
                  <Link to="/benefits">{tPage("home.getChecklistPdf", language)}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-16">
            <Button size="lg" variant="outline" className="uppercase text-xs tracking-wider font-semibold px-10 py-7 border-2" asChild>
              <Link to="/benefits">{tPage("home.viewAllSchemes", language)}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Legal Support */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-primary/10 translate-x-4 translate-y-4"></div>
              <img src={carLegal} alt="Legal Support" className="w-full h-[600px] object-cover relative z-10" />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block mb-6 border-b-2 border-primary pb-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-primary">{tPage("home.legalHelp", language)}</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 text-foreground">{tPage("home.legalSupportSection", language)}</h2>
              <p className="text-lg text-foreground/70 font-light mb-12 leading-relaxed">
                {tPage("home.legalSupportDesc2", language)}
              </p>
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🚦</span>
                  </div>
                  <div>
                    <span className="font-serif font-bold text-xl block mb-2">{tPage("home.trafficViolation", language)}</span>
                    <span className="text-foreground/70 font-light">{tPage("home.trafficViolationDesc", language)}</span>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📄</span>
                  </div>
                  <div>
                    <span className="font-serif font-bold text-xl block mb-2">{tPage("home.licensePermit", language)}</span>
                    <span className="text-foreground/70 font-light">{tPage("home.licensePermitDesc", language)}</span>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🚘</span>
                  </div>
                  <div>
                    <span className="font-serif font-bold text-xl block mb-2">{tPage("home.rcVehicle", language)}</span>
                    <span className="text-foreground/70 font-light">{tPage("home.rcVehicleDesc", language)}</span>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">⚖️</span>
                  </div>
                  <div>
                    <span className="font-serif font-bold text-xl block mb-2">{tPage("home.accidentFir", language)}</span>
                    <span className="text-foreground/70 font-light">{tPage("home.accidentFirDesc", language)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button size="lg" className="uppercase text-xs tracking-wider px-10 py-7 group" asChild>
                  <Link to="/legal-support" className="flex items-center gap-2">
                    {tPage("home.submitYourIssue", language)}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-foreground text-background relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">{tPage("home.readyToJoin", language)}</h2>
            <p className="text-xl md:text-2xl text-background/70 font-light mb-12 leading-relaxed">
              {tPage("home.readyToJoinDesc", language)}
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" className="uppercase text-sm tracking-wider px-12 py-8" asChild>
                  <Link to="/pin-login">Login Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-background text-background hover:bg-background hover:text-foreground uppercase text-sm tracking-wider font-semibold px-12 py-8" asChild>
                  <Link to="/contact">{tPage("home.contactUs", language)}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <div className="inline-block mb-6 border-b-2 border-primary pb-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-primary">{tPage("home.testimonial", language)}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-foreground">{tPage("home.whatDriversSay", language)}</h2>
            <p className="text-lg text-foreground/70 font-light leading-relaxed">{tPage("home.testimonialDesc", language)}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {/* Using a minimalist testimonial style instead of the heavy card */}
            <div className="text-center p-8 bg-background border border-border">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-primary text-xl">★</span>
                ))}
              </div>
              <p className="text-foreground/80 font-serif italic text-lg leading-relaxed mb-8">"{tPage("home.testimonial1", language)}"</p>
              <div>
                <p className="font-bold uppercase tracking-widest text-sm">Rajesh Kumar</p>
                <p className="text-xs text-foreground/60 uppercase tracking-widest mt-1">Truck Driver</p>
              </div>
            </div>
            <div className="text-center p-8 bg-background border border-border">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-primary text-xl">★</span>
                ))}
              </div>
              <p className="text-foreground/80 font-serif italic text-lg leading-relaxed mb-8">"{tPage("home.testimonial2", language)}"</p>
              <div>
                <p className="font-bold uppercase tracking-widest text-sm">Priya Singh</p>
                <p className="text-xs text-foreground/60 uppercase tracking-widest mt-1">Taxi Driver</p>
              </div>
            </div>
            <div className="text-center p-8 bg-background border border-border">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-primary text-xl">★</span>
                ))}
              </div>
              <p className="text-foreground/80 font-serif italic text-lg leading-relaxed mb-8">"{tPage("home.testimonial3", language)}"</p>
              <div>
                <p className="font-bold uppercase tracking-widest text-sm">Mohammed Ali</p>
                <p className="text-xs text-foreground/60 uppercase tracking-widest mt-1">Auto Driver</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
