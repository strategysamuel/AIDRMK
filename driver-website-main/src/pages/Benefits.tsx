import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { subscribeToContentChanges } from "@/lib/contentSync";
import {
  DEFAULT_WELFARE_SCHEMES,
  WelfareScheme,
  mergeWithDefaultSchemes,
  normalizeSchemeLevel,
} from "@/data/welfareSchemes";

type Scheme = WelfareScheme;
type LevelFilter = "all" | "central" | "state";

const Benefits = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [schemes, setSchemes] = useState<Scheme[]>(DEFAULT_WELFARE_SCHEMES);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchSchemes();
    return subscribeToContentChanges("schemes", fetchSchemes);
  }, []);

  const fetchSchemes = async () => {
    try {
      const { data, error } = await supabase
        .from("schemes")
        .select("*")
        .eq("is_active", true)
        .order("level", { ascending: true })
        .order("category", { ascending: true });

      if (error) throw error;
      setSchemes(mergeWithDefaultSchemes((data || []) as Scheme[]));
    } catch (error) {
      console.error("Error loading schemes:", error);
      setSchemes(DEFAULT_WELFARE_SCHEMES);
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

  const categories = useMemo(() => {
    return Array.from(new Set(schemes.map((scheme) => scheme.category))).sort((a, b) => a.localeCompare(b));
  }, [schemes]);

  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      const level = normalizeSchemeLevel(scheme.level);
      const levelMatch = selectedLevel === "all" || level === selectedLevel;
      const categoryMatch = selectedCategory === "all" || scheme.category === selectedCategory;
      return levelMatch && categoryMatch;
    });
  }, [schemes, selectedCategory, selectedLevel]);

  const formatBenefit = (amount: number, unit: string | null) => {
    const rupee = String.fromCharCode(8377);
    const suffix = unit && unit !== "INR" ? ` ${unit}` : "";
    return `${rupee}${amount.toLocaleString("en-IN")}${suffix}`;
  };

  const levelLabels = {
    all: "All",
    central: "Central Govt",
    state: "State Govt",
  };

  const shortLevelLabel = (scheme: Scheme) => (normalizeSchemeLevel(scheme.level) === "central" ? "Central" : "State");

  return (
    <div className="min-h-screen flex flex-col">
      <section className="bg-primary/5 py-20 md:py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Welfare Schemes</h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Explore Central and State Government welfare schemes for drivers
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">Available Schemes</h2>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{filteredSchemes.length} schemes</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Tabs value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as LevelFilter)} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                  <TabsTrigger value="all">{levelLabels.all}</TabsTrigger>
                  <TabsTrigger value="central">{levelLabels.central}</TabsTrigger>
                  <TabsTrigger value="state">{levelLabels.state}</TabsTrigger>
                </TabsList>
              </Tabs>

              <select
                aria-label="Filter by category"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="h-10 min-w-[220px] px-4 border rounded-md bg-background text-foreground"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSchemes.map((scheme) => (
                <Card key={scheme.id} className="hover:shadow-lg transition-all flex flex-col">
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <Badge variant={normalizeSchemeLevel(scheme.level) === "central" ? "default" : "secondary"}>
                        {shortLevelLabel(scheme)}
                      </Badge>
                      <Badge variant="outline" className="text-center">
                        {scheme.category}
                      </Badge>
                    </div>

                    <Link to={`/benefits/${scheme.id}`}>
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-primary transition-colors">
                        {getTitle(scheme)}
                      </h3>
                    </Link>

                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-1">{getDescription(scheme)}</p>

                    {scheme.max_benefit_amount && scheme.max_benefit_amount > 0 && (
                      <div className="mb-6 p-4 bg-primary/10 rounded-lg">
                        <p className="text-sm font-semibold text-primary">Max Benefit:</p>
                        <p className="text-lg font-bold">{formatBenefit(scheme.max_benefit_amount, scheme.benefit_unit)}</p>
                      </div>
                    )}

                    {getEligibility(scheme) && (
                      <div className="mb-6">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Eligibility:</p>
                        <p className="text-sm line-clamp-2">{getEligibility(scheme)}</p>
                      </div>
                    )}

                    <div className="flex gap-3 mt-auto">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link to={`/benefits/${scheme.id}`}>View Details</Link>
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        {scheme.official_link ? (
                          <a href={scheme.official_link} target="_blank" rel="noopener noreferrer">
                            <span className="inline-flex items-center gap-1">
                              Apply
                              <ExternalLink className="h-3.5 w-3.5" />
                            </span>
                          </a>
                        ) : (
                          <Link to={user ? `/benefits/${scheme.id}` : "/register"}>Apply</Link>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredSchemes.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No schemes found for this filter</p>
            </div>
          )}
        </div>
      </section>

      {!user && (
        <section className="py-20 bg-accent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Become a Member?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Register today to access these schemes and get support for your driver welfare needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary" asChild>
                <Link to="/register">Register Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Get Help</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Benefits;
