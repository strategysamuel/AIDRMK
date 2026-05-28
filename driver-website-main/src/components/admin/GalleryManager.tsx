import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { broadcastContentChange, subscribeToContentChanges } from "@/lib/contentSync";
import { normalizePublicImageUrl } from "@/lib/assets";

// gallery_items is a custom table not in the generated types, so use an untyped client.
const db = supabase as any;

export function GalleryManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title_en: "",
    description_en: "",
    image_url: "",
  });

  useEffect(() => {
    fetchItems();
    return subscribeToContentChanges("gallery", fetchItems);
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await db
        .from("gallery_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error && error.code !== "42P01") throw error;
      setItems((data || []).map((item: any) => ({
        ...item,
        image_url: normalizePublicImageUrl(item.image_url),
      })));
    } catch (e: any) {
      console.error("Gallery fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setPreviewUrl(url);
      setFormData(prev => ({ ...prev, image_url: url }));
    };
    reader.readAsDataURL(file);
  };

  const openDialog = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      const imageUrl = normalizePublicImageUrl(item.image_url);
      setFormData({ title_en: item.title_en, description_en: item.description_en || "", image_url: imageUrl });
      setPreviewUrl(imageUrl);
    } else {
      setEditingItem(null);
      setFormData({ title_en: "", description_en: "", image_url: "" });
      setPreviewUrl("");
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const { error } = await db
          .from("gallery_items")
          .update(formData)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast.success("Image updated");
      } else {
        const { error } = await db
          .from("gallery_items")
          .insert([formData]);
        if (error) throw error;
        toast.success("Image added to gallery");
      }
      setIsDialogOpen(false);
      await broadcastContentChange("gallery");
      fetchItems();
    } catch (e: any) {
      toast.error("Failed to save: " + (e.message || "Check if gallery_items table exists in DB"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery image?")) return;
    const { error } = await db.from("gallery_items").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Image removed");
    await broadcastContentChange("gallery");
    fetchItems();
  };

  if (loading) return <div className="py-6 text-center text-muted-foreground text-sm">Loading gallery...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{items.length} image{items.length !== 1 ? "s" : ""}</p>
        <Button onClick={() => openDialog()} className="bg-red-600 hover:bg-red-700 rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Add Image
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p>No gallery images yet</p>
                </TableCell>
              </TableRow>
            )}
            {items.map(item => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  {item.image_url ? (
                    <img src={normalizePublicImageUrl(item.image_url)} alt={item.title_en} className="w-16 h-16 object-cover rounded-xl border border-gray-100" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.title_en}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{item.description_en || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    <Button size="icon" variant="outline" onClick={() => openDialog(item)} className="h-8 w-8 rounded-lg">
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => handleDelete(item.id)} className="h-8 w-8 rounded-lg hover:bg-red-50 hover:border-red-300">
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Gallery Image" : "Add Gallery Image"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Image Upload */}
            <div className="space-y-1.5">
              <Label htmlFor="gallery-image-upload">Image</Label>
              <label
                htmlFor="gallery-image-upload"
                className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-red-400 hover:bg-red-50/30 transition-colors block"
              >
                {previewUrl ? (
                  <img src={normalizePublicImageUrl(previewUrl)} alt="Preview" className="w-full h-40 object-cover rounded-lg mx-auto" />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload image</p>
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP supported</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  id="gallery-image-upload"
                  type="file"
                  accept="image/*"
                  title="Upload a gallery image"
                  aria-label="Upload a gallery image"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {/* Fallback: manual URL */}
              <Input
                value={formData.image_url.startsWith("data:") ? "" : formData.image_url}
                onChange={e => {
                  setFormData({ ...formData, image_url: e.target.value });
                  setPreviewUrl(e.target.value);
                }}
                placeholder="Or paste image URL..."
                aria-label="Image URL"
                className="rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gallery-title">Title / Subject *</Label>
              <Input
                id="gallery-title"
                required
                value={formData.title_en}
                onChange={e => setFormData({ ...formData, title_en: e.target.value })}
                className="rounded-xl"
                placeholder="e.g. Annual Meeting 2024"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gallery-description">Description</Label>
              <Textarea
                id="gallery-description"
                value={formData.description_en}
                onChange={e => setFormData({ ...formData, description_en: e.target.value })}
                className="rounded-xl"
                rows={3}
                placeholder="Optional description..."
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 rounded-xl">
              {editingItem ? "Update Image" : "Add to Gallery"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
