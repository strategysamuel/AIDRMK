import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { broadcastContentChange, subscribeToContentChanges } from "@/lib/contentSync";

export function SchemesManager() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<any>(null);

  const emptyForm = {
    title_en: "",
    description_en: "",
    category: "",
    level: "state",
    is_active: true,
    scheme_price: "",
    payment_type: "yearly",
    scheme_type: "government",
    apply_url: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchSchemes();

    // Real-time subscription — changes reflect on ALL devices instantly
    return subscribeToContentChanges("schemes", fetchSchemes);
  }, []);

  const fetchSchemes = async () => {
    try {
      const { data, error } = await supabase
        .from("schemes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSchemes(data || []);
    } catch (e: any) {
      toast.error("Failed to fetch schemes");
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (scheme: any = null) => {
    if (scheme) {
      setEditingScheme(scheme);
      setFormData({
        title_en: scheme.title_en || "",
        description_en: scheme.description_en || "",
        category: scheme.category || "",
        level: scheme.level || "state",
        is_active: scheme.is_active ?? true,
        scheme_price: scheme.scheme_price || "",
        payment_type: scheme.payment_type || "yearly",
        scheme_type: scheme.scheme_type || "government",
        apply_url: scheme.apply_url || scheme.official_link || "",
      });
    } else {
      setEditingScheme(null);
      setFormData(emptyForm);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title_en: formData.title_en,
      title_ta: formData.title_en,
      title_hi: formData.title_en,
      description_en: formData.description_en,
      description_ta: formData.description_en,
      description_hi: formData.description_en,
      category: formData.category,
      level: formData.level,
      is_active: formData.is_active,
      scheme_price: formData.scheme_price,
      payment_type: formData.payment_type,
      scheme_type: formData.scheme_type,
      apply_url: formData.apply_url || null,
      official_link: formData.apply_url || null,
    };
    try {
      if (editingScheme) {
        const { error } = await supabase.from("schemes").update(payload as any).eq("id", editingScheme.id);
        if (error) throw error;
        toast.success("Scheme updated — changes reflect on all devices");
      } else {
        const { error } = await supabase.from("schemes").insert([payload as any]);
        if (error) throw error;
        toast.success("Scheme created — visible to all users now");
      }
      setIsDialogOpen(false);
      await broadcastContentChange("schemes");
      fetchSchemes();
    } catch (e: any) {
      toast.error("Failed to save scheme: " + (e.message || ""));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this scheme?")) return;
    const { error } = await supabase.from("schemes").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Scheme deleted");
    await broadcastContentChange("schemes");
    fetchSchemes();
  };

  if (loading) return <div className="py-6 text-center text-muted-foreground text-sm">Loading schemes...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{schemes.length} scheme{schemes.length !== 1 ? "s" : ""}</p>
        <Button onClick={() => openDialog()} className="bg-red-600 hover:bg-red-700 rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Add Scheme
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Scheme Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Apply URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schemes.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No schemes yet</TableCell>
              </TableRow>
            )}
            {schemes.map(s => (
              <TableRow key={s.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{s.title_en}</TableCell>
                <TableCell>{s.scheme_price ? `₹${s.scheme_price}` : "—"}</TableCell>
                <TableCell className="capitalize">
                  <Badge variant="outline" className="text-xs">{s.payment_type || "—"}</Badge>
                </TableCell>
                <TableCell>{s.category}</TableCell>
                <TableCell>
                  <Badge
                    className={s.scheme_type === "government"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : "bg-purple-100 text-purple-700 border-purple-200"}
                    variant="outline"
                  >
                    {s.scheme_type === "government" ? "Government" : "Private"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {(s.apply_url || s.official_link) ? (
                    <a
                      href={s.apply_url || s.official_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline text-xs max-w-[140px] truncate"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{s.apply_url || s.official_link}</span>
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={s.is_active ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}>
                    {s.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    <Button size="icon" variant="outline" onClick={() => openDialog(s)} className="h-8 w-8 rounded-lg">
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => handleDelete(s.id)} className="h-8 w-8 rounded-lg hover:bg-red-50 hover:border-red-300">
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
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingScheme ? "Edit Scheme" : "Add New Scheme"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Scheme Name *</Label>
              <Input
                required
                value={formData.title_en}
                onChange={e => setFormData({ ...formData, title_en: e.target.value })}
                placeholder="e.g. Accident Insurance"
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Scheme Price (₹)</Label>
                <Input
                  value={formData.scheme_price}
                  onChange={e => setFormData({ ...formData, scheme_price: e.target.value })}
                  placeholder="e.g. 1200"
                  type="number"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Payment Type</Label>
                <Select value={formData.payment_type} onValueChange={v => setFormData({ ...formData, payment_type: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Input
                  required
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Health"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Scheme Type</Label>
                <Select value={formData.scheme_type} onValueChange={v => setFormData({ ...formData, scheme_type: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Apply URL */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                Apply URL
              </Label>
              <Input
                value={formData.apply_url}
                onChange={e => setFormData({ ...formData, apply_url: e.target.value })}
                placeholder="https://example.gov.in/apply"
                type="url"
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                When a customer clicks "Apply for this Scheme", they will be redirected to this URL.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={formData.description_en}
                onChange={e => setFormData({ ...formData, description_en: e.target.value })}
                className="rounded-xl"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Level</Label>
                <Select value={formData.level} onValueChange={v => setFormData({ ...formData, level: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="central">Central</SelectItem>
                    <SelectItem value="state">State</SelectItem>
                    <SelectItem value="state_tn">State (TN)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={formData.is_active ? "active" : "inactive"}
                  onValueChange={v => setFormData({ ...formData, is_active: v === "active" })}
                >
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 rounded-xl">
              {editingScheme ? "Update Scheme" : "Create Scheme"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
