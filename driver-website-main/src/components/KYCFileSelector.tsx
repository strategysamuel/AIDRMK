import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, Camera, FileText, X } from "lucide-react";
import { toast } from "sonner";

interface KYCFileSelectorProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export const KYCFileSelector = ({ label, onFileSelect, selectedFile }: KYCFileSelectorProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPG, PNG, or PDF.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    onFileSelect(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const removeFile = () => {
    onFileSelect(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {!selectedFile ? (
        <Card className="p-4 border-dashed">
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,application/pdf"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Select from Gallery
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-4">
          <div className="space-y-2">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded" />
            ) : (
              <div className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm">{selectedFile.name}</span>
              </div>
            )}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={removeFile}
            >
              <X className="mr-1 h-4 w-4" />
              Remove
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
