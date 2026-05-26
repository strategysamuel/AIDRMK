import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, FileText, Eye, Phone, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface KYCVerificationCardProps {
  driver: any;
  documents: any[];
  onVerificationComplete: () => void;
}

export const KYCVerificationCard = ({ driver, documents, onVerificationComplete }: KYCVerificationCardProps) => {
  const [verificationNotes, setVerificationNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);

  const aadhaarDoc = documents.find(d => d.type === 'aadhaar');
  const panDoc = documents.find(d => d.type === 'pan');
  const signatureDoc = documents.find(d => d.type === 'signature');
  const photoDoc = documents.find(d => d.type === 'photo');

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500';
      case 'submitted':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      // Update driver KYC status
      const { error: driverError } = await supabase
        .from('drivers')
        .update({ 
          kyc_status: 'verified',
          is_verified: true,
          status: 'active'
        })
        .eq('id', driver.id);

      if (driverError) throw driverError;

      // Update all documents as verified
      const { error: docsError } = await supabase
        .from('documents')
        .update({
          verified_at: new Date().toISOString(),
          verified_by: (await supabase.auth.getUser()).data.user?.id,
          verification_notes: verificationNotes || 'KYC documents approved'
        })
        .eq('driver_id', driver.id);

      if (docsError) throw docsError;

      toast.success("KYC approved successfully!");
      onVerificationComplete();
    } catch (error: any) {
      console.error('Error approving KYC:', error);
      toast.error(error.message || "Failed to approve KYC");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!verificationNotes.trim()) {
      toast.error("Please provide rejection reason in notes");
      return;
    }

    setLoading(true);
    try {
      // Update driver KYC status
      const { error: driverError } = await supabase
        .from('drivers')
        .update({ 
          kyc_status: 'rejected',
          is_verified: false
        })
        .eq('id', driver.id);

      if (driverError) throw driverError;

      // Update documents with rejection notes
      const { error: docsError } = await supabase
        .from('documents')
        .update({
          verified_at: new Date().toISOString(),
          verified_by: (await supabase.auth.getUser()).data.user?.id,
          verification_notes: verificationNotes
        })
        .eq('driver_id', driver.id);

      if (docsError) throw docsError;

      toast.success("KYC rejected");
      onVerificationComplete();
    } catch (error: any) {
      console.error('Error rejecting KYC:', error);
      toast.error(error.message || "Failed to reject KYC");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{driver.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              {driver.mobile}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Submitted: {format(new Date(driver.created_at), "PPP")}
            </div>
            {driver.membership_id && (
              <div className="text-sm font-mono text-primary">
                ID: {driver.membership_id}
              </div>
            )}
          </div>
          <Badge className={getKycStatusColor(driver.kyc_status)}>
            {driver.kyc_status?.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Driver Details */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Aadhaar No:</span>
            <p className="font-medium">{driver.aadhaar_no || 'N/A'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Gender:</span>
            <p className="font-medium capitalize">{driver.gender || 'N/A'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Blood Group:</span>
            <p className="font-medium">{driver.blood_group || 'N/A'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Emergency Contact:</span>
            <p className="font-medium">{driver.emergency_mobile || 'N/A'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">District:</span>
            <p className="font-medium">{driver.district}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Membership:</span>
            <p className="font-medium capitalize">{driver.membership_plan || 'N/A'}</p>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-2">
          <Label>KYC Documents</Label>
          <div className="grid grid-cols-2 gap-2">
            {aadhaarDoc ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Aadhaar Card
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Aadhaar Card</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <img 
                      src={aadhaarDoc.file_url} 
                      alt="Aadhaar Card" 
                      className="max-h-[70vh] object-contain"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(aadhaarDoc.file_url, '_blank')}
                  >
                    Open in New Tab
                  </Button>
                </DialogContent>
              </Dialog>
            ) : (
              <div className="flex items-center justify-center p-4 border border-dashed rounded text-sm text-muted-foreground">
                <FileText className="h-4 w-4 mr-2" />
                No Aadhaar
              </div>
            )}

            {panDoc ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    PAN Card
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>PAN Card</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <img 
                      src={panDoc.file_url} 
                      alt="PAN Card" 
                      className="max-h-[70vh] object-contain"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(panDoc.file_url, '_blank')}
                  >
                    Open in New Tab
                  </Button>
                </DialogContent>
              </Dialog>
            ) : (
              <div className="flex items-center justify-center p-4 border border-dashed rounded text-sm text-muted-foreground">
                <FileText className="h-4 w-4 mr-2" />
                No PAN
              </div>
            )}

            {signatureDoc ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Signature
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Signature</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <img 
                      src={signatureDoc.file_url} 
                      alt="Signature" 
                      className="max-h-[70vh] object-contain"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(signatureDoc.file_url, '_blank')}
                  >
                    Open in New Tab
                  </Button>
                </DialogContent>
              </Dialog>
            ) : (
              <div className="flex items-center justify-center p-4 border border-dashed rounded text-sm text-muted-foreground">
                <FileText className="h-4 w-4 mr-2" />
                No Signature
              </div>
            )}

            {photoDoc ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Photo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Passport Photo</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <img 
                      src={photoDoc.file_url} 
                      alt="Photo" 
                      className="max-h-[70vh] object-contain"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(photoDoc.file_url, '_blank')}
                  >
                    Open in New Tab
                  </Button>
                </DialogContent>
              </Dialog>
            ) : (
              <div className="flex items-center justify-center p-4 border border-dashed rounded text-sm text-muted-foreground">
                <FileText className="h-4 w-4 mr-2" />
                No Photo
              </div>
            )}
          </div>
        </div>

        {/* Verification Notes */}
        {driver.kyc_status === 'submitted' && (
          <div className="space-y-2">
            <Label htmlFor={`notes-${driver.id}`}>Verification Notes</Label>
            <Textarea
              id={`notes-${driver.id}`}
              placeholder="Add verification notes or rejection reason..."
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              rows={3}
            />
          </div>
        )}

        {/* Previous Verification Info */}
        {(driver.kyc_status === 'verified' || driver.kyc_status === 'rejected') && documents[0]?.verification_notes && (
          <div className="bg-muted p-3 rounded text-sm">
            <p className="font-medium mb-1">Verification Notes:</p>
            <p className="text-muted-foreground">{documents[0].verification_notes}</p>
            {documents[0].verified_at && (
              <p className="text-xs text-muted-foreground mt-2">
                Verified on: {format(new Date(documents[0].verified_at), "PPP p")}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {driver.kyc_status === 'submitted' && (
          <div className="flex gap-2">
            <Button
              className="flex-1"
              variant="default"
              onClick={handleApprove}
              disabled={loading || !aadhaarDoc || !panDoc || !signatureDoc || !photoDoc}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve KYC
            </Button>
            <Button
              className="flex-1"
              variant="destructive"
              onClick={handleReject}
              disabled={loading}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject KYC
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
