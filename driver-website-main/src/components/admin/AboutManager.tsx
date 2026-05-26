import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit } from "lucide-react";

export function AboutManager() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    section_key: "",
    content_en: "",
    image_url: "",
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .order("section_key", { ascending: true });

      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist yet, just return empty
          setSections([]);
          return;
        }
        throw error;
      }
      setSections(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch about content. Make sure to run the SQL query.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (section: any = null) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        section_key: section.section_key,
        content_en: section.content_en || "",
        image_url: section.image_url || "",
      });
    } else {
      setEditingSection(null);
      setFormData({
        section_key: "",
        content_en: "",
        image_url: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSection) {
        const { error } = await supabase
          .from("about_content")
          .update(formData)
          .eq("id", editingSection.id);
        if (error) throw error;
        toast.success("Section updated successfully");
      } else {
        const { error } = await supabase
          .from("about_content")
          .insert([formData]);
        if (error) throw error;
        toast.success("Section created successfully");
      }
      setIsDialogOpen(false);
      fetchSections();
    } catch (error: any) {
      toast.error("Failed to save section. Make sure to run the SQL query.");
      console.error(error);
    }
  };

  if (loading) return <div>Loading about content...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage About Us Content</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Add Section Content
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Section Key</TableHead>
            <TableHead>Content Snippet</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No sections found. If you haven't run the SQL script, please do so.
              </TableCell>
            </TableRow>
          )}
          {sections.map((section) => (
            <TableRow key={section.id}>
              <TableCell className="font-mono text-xs">{section.section_key}</TableCell>
              <TableCell className="max-w-md truncate">{section.content_en}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => handleOpenDialog(section)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSection ? "Edit Section" : "Add Section"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Section Key (e.g., 'who_we_are', 'mission')</Label>
              <Input required value={formData.section_key} onChange={e => setFormData({...formData, section_key: e.target.value})} disabled={!!editingSection} />
            </div>
            <div className="space-y-2">
              <Label>Content (English)</Label>
              <Textarea required value={formData.content_en} onChange={e => setFormData({...formData, content_en: e.target.value})} rows={6} />
            </div>
            <div className="space-y-2">
              <Label>Image URL (Optional)</Label>
              <Input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
            </div>
            <Button type="submit" className="w-full">{editingSection ? "Update" : "Create"} Section</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
