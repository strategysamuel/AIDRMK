import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check, Star, Crown } from "lucide-react";
import idCardFront from "@/assets/id-card-front.png";
import idCardBack from "@/assets/id-card-back.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { tPage } from "@/translations/all-pages";

import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Membership = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/driver-dashboard");
    }
  }, [user, navigate]);

  if (user) return null;

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="bg-background border-b border-border py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif uppercase tracking-widest text-primary">{tPage("membership.title", language)}</h1>
            <p className="text-muted-foreground uppercase tracking-widest text-sm">
              {tPage("membership.subtitle", language)}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-2 font-serif uppercase tracking-wider">{language === 'ta' ? 'இலவச உறுப்பினர்' : language === 'hi' ? 'मुफ्त सदस्यता' : 'Free Membership'}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold font-serif">₹0</span>
                    <span className="text-muted-foreground uppercase tracking-widest text-xs"> / {tPage("membership.perYear", language)}</span>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{tPage("membership.essentialSupport", language)}</p>
                  <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mt-2">Yellow Membership Card</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.basicLegalConsultation", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.welfareSchemeInfo", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.communitySupportAccess", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.memberIdCard", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.monthlyNewsletters", language)}</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/register">{tPage("membership.getStarted", language)}</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Standard Plan */}
            <Card className="rounded-none border-2 border-primary shadow-none relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 text-xs uppercase tracking-widest font-bold">
                  {tPage("membership.mostPopular", language)}
                </span>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Crown className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-2 font-serif uppercase tracking-wider">{tPage("membership.standard", language)}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold font-serif">₹2,999</span>
                    <span className="text-muted-foreground uppercase tracking-widest text-xs"> / {tPage("membership.per5Years", language)}</span>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{tPage("membership.completeDriverSupport", language)}</p>
                  <p className="text-xs font-bold text-red-600 uppercase tracking-widest mt-2">Red Membership Card</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{tPage("membership.everythingInBasic", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.priorityLegalSupport", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.welfareSchemeAssistance", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.freeTrainingWorkshops", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.helplineSupport247", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.documentVerificationAssistance", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.exclusiveMemberEvents", language)}</span>
                  </li>
                </ul>
                <Button className="w-full gradient-primary" asChild>
                  <Link to="/register">{tPage("membership.getStarted", language)}</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Crown className="h-12 w-12 mx-auto mb-4 text-primary fill-primary" />
                  <h3 className="text-2xl font-bold mb-2 font-serif uppercase tracking-wider">{tPage("membership.premium", language)}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold font-serif">₹9,999</span>
                    <span className="text-muted-foreground uppercase tracking-widest text-xs"> / {tPage("membership.lifetime", language)}</span>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{tPage("membership.vipSupportBenefits", language)}</p>
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mt-2">Purple Membership Card</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{tPage("membership.everythingInStandard", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.unlimitedLegalConsultations", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.courtRepresentationSupport", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.allTrainingWorkshopsFree", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.priorityCaseHandling", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.dedicatedSupportManager", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.familyCoverage", language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tPage("membership.vipEventAccess", language)}</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/register">{tPage("membership.getStarted", language)}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample ID Cards */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif uppercase tracking-wider text-primary">{tPage("membership.yourMembershipIdCard", language)}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto uppercase tracking-widest text-xs">
              {tPage("membership.idCardDesc", language)}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="rounded-none border-border shadow-none overflow-hidden">
              <CardContent className="p-0">
                <img src={idCardFront} alt="Membership ID Card Front" className="w-full" />
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none overflow-hidden">
              <CardContent className="p-0">
                <img src={idCardBack} alt="Membership ID Card Back" className="w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif uppercase tracking-wider text-primary">{tPage("membership.whyJoinAidrmk", language)}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto uppercase tracking-widest text-xs">
              {tPage("membership.whyJoinDesc", language)}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">⚖️</div>
                <h3 className="font-bold mb-2">{tPage("membership.legalProtection", language)}</h3>
                <p className="text-sm text-muted-foreground">{tPage("membership.legalProtectionDesc", language)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="font-bold mb-2">{tPage("membership.saveMoney", language)}</h3>
                <p className="text-sm text-muted-foreground">{tPage("membership.saveMoneyDesc", language)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="font-bold mb-2">{tPage("membership.strongCommunity", language)}</h3>
                <p className="text-sm text-muted-foreground">{tPage("membership.strongCommunityDesc", language)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="font-bold mb-2">{tPage("membership.learnAndGrow", language)}</h3>
                <p className="text-sm text-muted-foreground">{tPage("membership.learnAndGrowDesc", language)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif uppercase tracking-wider text-primary">{tPage("membership.faq", language)}</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">{tPage("membership.howToBecomeMember", language)}</h3>
                <p className="text-sm text-muted-foreground">
                  {tPage("membership.howToBecomeMemberAnswer", language)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">{tPage("membership.canChangePlan", language)}</h3>
                <p className="text-sm text-muted-foreground">
                  {tPage("membership.canChangePlanAnswer", language)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">{tPage("membership.paymentMethods", language)}</h3>
                <p className="text-sm text-muted-foreground">
                  {tPage("membership.paymentMethodsAnswer", language)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">{tPage("membership.refundPolicy", language)}</h3>
                <p className="text-sm text-muted-foreground">
                  {tPage("membership.refundPolicyAnswer", language)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif uppercase tracking-wider text-primary">{tPage("membership.readyToGetStarted", language)}</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto uppercase tracking-widest text-xs">
            {tPage("membership.ctaDesc", language)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="uppercase tracking-widest font-bold" asChild>
              <Link to="/register">{tPage("membership.becomeMemberNow", language)}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">{tPage("membership.contactUs", language)}</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Membership;
