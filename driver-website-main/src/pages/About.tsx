import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Target, Eye, Users, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { tPage } from "@/translations/all-pages";
import padmanabhan from "@/assets/padmanabhan.png";
import aboutBanner from "@/assets/about-banner.png";
import { useAuth } from "@/contexts/AuthContext";

const About = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section with Banner */}
      <section className="relative">
        <div className="w-full">
          <img src={aboutBanner} alt="About Banner" className="w-full h-48 md:h-64 object-cover" />
        </div>
        <div className="bg-background border-b border-border py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif uppercase tracking-widest text-primary">{tPage("about.title", language)}</h1>
              <p className="text-lg md:text-xl text-muted-foreground uppercase tracking-widest text-sm">
                {tPage("about.subtitle", language)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif uppercase tracking-wider text-primary">{tPage("about.whoWeAre", language)}</h2>
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-wider text-sm">{tPage("about.aboutHeading", language)}</h3>
            <p className="text-lg text-muted-foreground mb-4 font-sans">
              {tPage("about.para1", language)}
            </p>
            <p className="text-lg text-muted-foreground mb-4 font-sans">
              {tPage("about.para2", language)}
            </p>
            <p className="text-lg text-muted-foreground mb-4 font-sans">
              {tPage("about.para3", language)}
            </p>
            <p className="text-lg text-muted-foreground mb-6 font-sans">
              {tPage("about.para4", language)}
            </p>
            <Button size="lg" className="uppercase tracking-widest font-bold" asChild>
              <Link to="/membership">{tPage("about.joinCommunity", language)}</Link>
            </Button>
          </div>
            <div>
              <img src={padmanabhan} alt="Leader" className="rounded-none shadow-none w-full border border-border" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 font-serif uppercase tracking-wider">{tPage("about.ourMission", language)}</h3>
                <p className="text-muted-foreground text-sm">
                  {tPage("about.missionDesc", language)}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-8">
                <Eye className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 font-serif uppercase tracking-wider">{tPage("about.ourVision", language)}</h3>
                <p className="text-muted-foreground text-sm">
                  {tPage("about.visionDesc", language)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif uppercase tracking-wider text-primary">{tPage("about.ourValues", language)}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto uppercase tracking-widest text-xs">
              {tPage("about.valuesDesc", language)}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="rounded-none border-border shadow-none bg-background">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("about.communityFirst", language)}</h3>
                <p className="text-xs text-muted-foreground">{tPage("about.communityFirstDesc", language)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none bg-background">
              <CardContent className="p-6 text-center">
                <Award className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("about.integrity", language)}</h3>
                <p className="text-xs text-muted-foreground">{tPage("about.integrityDesc", language)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none bg-background">
              <CardContent className="p-6 text-center">
                <Target className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("about.excellence", language)}</h3>
                <p className="text-xs text-muted-foreground">{tPage("about.excellenceDesc", language)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none bg-background">
              <CardContent className="p-6 text-center">
                <Eye className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-bold mb-2 uppercase tracking-wider text-sm">{tPage("about.empowerment", language)}</h3>
                <p className="text-xs text-muted-foreground">{tPage("about.empowermentDesc", language)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif uppercase tracking-wider text-primary">{tPage("about.whatWeDo", language)}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">⚖️</div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-sm">{tPage("about.legalAssistance", language)}</h3>
                <p className="text-muted-foreground text-sm">
                  {tPage("about.legalAssistanceDesc", language)}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🏥</div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-sm">{tPage("about.welfarePrograms", language)}</h3>
                <p className="text-muted-foreground text-sm">
                  {tPage("about.welfareProgramsDesc", language)}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-sm">{tPage("about.communityBuilding", language)}</h3>
                <p className="text-muted-foreground text-sm">
                  {tPage("about.communityBuildingDesc", language)}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-sm">{tPage("about.trainingEducation", language)}</h3>
                <p className="text-muted-foreground text-sm">
                  {tPage("about.trainingEducationDesc", language)}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-sm">{tPage("about.employmentSupport", language)}</h3>
                <p className="text-muted-foreground text-sm">
                  {tPage("about.employmentSupportDesc", language)}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border shadow-none">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">📢</div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-sm">{tPage("about.advocacy", language)}</h3>
                <p className="text-muted-foreground text-sm">
                  {tPage("about.advocacyDesc", language)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - only shown to guests */}
      {!user && (
        <section className="py-20 bg-secondary border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif uppercase tracking-wider text-primary">{tPage("about.readyToJoin", language)}</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto uppercase tracking-widest text-xs">
              {tPage("about.readyToJoinDesc", language)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="uppercase tracking-widest font-bold" asChild>
                <Link to="/membership">{tPage("about.becomeMember", language)}</Link>
              </Button>
              <Button size="lg" variant="outline" className="uppercase tracking-widest font-bold" asChild>
                <Link to="/contact">{tPage("about.contactUs", language)}</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default About;
