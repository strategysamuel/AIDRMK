import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KYCDocumentUploadProps {
  label: string;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onDataExtracted?: (data: any) => void;
  isProcessing?: boolean;
  extractedBadge?: string;
  accept?: string;
}

export const KYCDocumentUpload = ({ 
  label, 
  onFileSelect, 
  selectedFile,
  onDataExtracted,
  isProcessing,
  extractedBadge,
  accept = "image/jpeg,image/jpg,image/png,image/webp"
}: KYCDocumentUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    e.currentTarget.value = "";
  };

  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, [selectedFile]);

  const clearFile = () => {
    onFileSelect(null as any);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base">{label}</Label>
        {extractedBadge && (
          <Badge variant="secondary" className="text-xs">
            {extractedBadge}
          </Badge>
        )}
      </div>
      
      {!selectedFile ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full min-w-0 h-12 justify-center text-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2 shrink-0" />
            <span className="truncate">Select from Gallery</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full min-w-0 h-12 justify-center text-sm"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="h-4 w-4 mr-2 shrink-0" />
            <span className="truncate">Take Photo</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="sr-only"
            title="Upload from gallery"
            aria-label="Upload from gallery"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            capture="environment"
            onChange={handleFileChange}
            className="sr-only"
            title="Take photo"
            aria-label="Take photo"
          />
        </div>
      ) : (
        <Card className="relative p-4">
          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Extracting data...</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-muted rounded border flex overflow-hidden items-center justify-center shrink-0">
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearFile}
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
