import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { tPage } from "@/translations/all-pages";
import { supabase } from "@/integrations/supabase/client";
import { subscribeToContentChanges } from "@/lib/contentSync";

const Gallery = () => {
  const { language } = useLanguage();
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
    return subscribeToContentChanges("gallery", fetchGallery);
  }, [language]);

  const fetchGallery = async () => {
    const staticEvents = [
      { id: 's1', image_url: '/src/assets/gallery/eye-checkup.png', title_en: tPage("gallery.event1Title", language), description_en: tPage("gallery.event1Desc", language), created_at: new Date('2023-01-15').toISOString() },
      { id: 's2', image_url: '/src/assets/gallery/community-meeting.png', title_en: tPage("gallery.event2Title", language), description_en: tPage("gallery.event2Desc", language), created_at: new Date('2023-02-20').toISOString() },
      { id: 's3', image_url: '/src/assets/gallery/conference-event.png', title_en: tPage("gallery.event3Title", language), description_en: tPage("gallery.event3Desc", language), created_at: new Date('2023-03-10').toISOString() },
      { id: 's4', image_url: '/src/assets/gallery/public-assistance.png', title_en: tPage("gallery.event4Title", language), description_en: tPage("gallery.event4Desc", language), created_at: new Date('2023-04-05').toISOString() },
      { id: 's5', image_url: '/src/assets/gallery/leadership-meeting.png', title_en: tPage("gallery.event5Title", language), description_en: tPage("gallery.event5Desc", language), created_at: new Date('2023-05-12').toISOString() },
      { id: 's6', image_url: '/src/assets/gallery/auto-drivers.png', title_en: tPage("gallery.event6Title", language), description_en: tPage("gallery.event6Desc", language), created_at: new Date('2023-06-18').toISOString() },
      { id: 's7', image_url: '/src/assets/gallery/driver-team.png', title_en: tPage("gallery.event7Title", language), description_en: tPage("gallery.event7Desc", language), created_at: new Date('2023-07-22').toISOString() },
      { id: 's8', image_url: '/src/assets/gallery/eye-testing.png', title_en: tPage("gallery.event8Title", language), description_en: tPage("gallery.event8Desc", language), created_at: new Date('2023-08-30').toISOString() },
    ];

    try {
      const db = supabase as any;
      const { data, error } = await db
        .from("gallery_items")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error && error.code !== "42P01") throw error;
      
      const combinedData = [...(data || []), ...staticEvents];
      setGalleryImages(combinedData);
    } catch (e) {
      console.error(e);
      setGalleryImages(staticEvents);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{tPage("gallery.title", language)}</h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {tPage("gallery.subtitle", language)}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {loading ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : galleryImages.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.image_url} 
                    alt={item.title_en} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="text-xs text-primary font-medium mb-2">{new Date(item.created_at).toLocaleDateString()}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title_en}</h3>
                  <p className="text-sm text-muted-foreground">{item.description_en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Events Highlights */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{tPage("gallery.recentHighlights", language)}</h2>
            <p className="text-muted-foreground">
              {tPage("gallery.recentHighlightsDesc", language)}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-2xl font-bold mb-2">5,000+</h3>
                <p className="text-muted-foreground">{tPage("gallery.driversServed", language)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-2xl font-bold mb-2">50+</h3>
                <p className="text-muted-foreground">{tPage("gallery.workshopsConducted", language)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold mb-2">10,000+</h3>
                <p className="text-muted-foreground">{tPage("gallery.membersUnited", language)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Gallery;
