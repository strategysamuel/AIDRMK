import { useRef } from "react";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MembershipDocGeneratorProps {
  driver: {
    membership_id?: string;
    name?: string;
    address?: string;
    mobile?: string;
    gender?: string;
    membership_plan?: string;
    payment_transaction_id?: string;
    district?: string;
    blood_group?: string;
    created_at?: string;

    selfie_photo_url?: string;
    signature_url?: string;

    license_no?: string;
    aadhaar_no?: string;

    documents?: {
      type: string;
      file_url: string;
    }[];
  };
}

export function MembershipDocGenerator({
  driver,
}: MembershipDocGeneratorProps) {

  const docRef = useRef<HTMLDivElement>(null);

  const aadhaarDoc = driver.documents?.find(
    (d) => d.type === "AADHAAR"
  );

  const dlDoc = driver.documents?.find(
    (d) => d.type === "DRIVING_LICENSE"
  );

  const handleDownload = async () => {

    if (!docRef.current) return;

    try {

      const canvas = await html2canvas(
        docRef.current,
        {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
        }
      );

      const link = document.createElement("a");

      link.download =
        `membership_${driver.membership_id || "card"}.jpg`;

      link.href = canvas.toDataURL(
        "image/jpeg",
        0.95
      );

      link.click();

    } catch (error) {

      console.error(
        "Download failed:",
        error
      );
    }
  };

  return (
    <>
      {/* DOWNLOAD DOCUMENT */}
      <div className="fixed left-[-9999px] top-0">

        <div
          ref={docRef}
          className="w-[850px] bg-white text-black rounded-xl overflow-hidden border shadow-lg"
        >

          {/* HEADER */}
          <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between">

            <div>
              <h1 className="text-4xl font-bold tracking-wide">
                AIDRMK
              </h1>

              <p className="text-sm">
                All India Driver Registration & Membership
              </p>
            </div>

            <div className="text-right">

              <div className="text-sm">
                Membership ID
              </div>

              <div className="text-2xl font-bold text-yellow-300">
                {driver.membership_id || "AIDRMK000001"}
              </div>

            </div>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-6">

            {/* TOP SECTION */}
            <div className="flex gap-6 border-b pb-6">

              {/* PROFILE PHOTO */}
              <div className="w-40 h-40 border-2 border-red-500 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">

                {driver.selfie_photo_url ? (
                  <img
                    src={driver.selfie_photo_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <span>No Photo</span>
                )}

              </div>

              {/* CUSTOMER DETAILS */}
              <div className="flex-1 space-y-3">

                <h2 className="text-4xl font-bold">
                  {driver.name || "—"}
                </h2>

                <p className="text-lg">
                  <strong>Address:</strong>{" "}
                  {driver.address || "—"}
                </p>

                <p className="text-lg">
                  <strong>Mobile:</strong>{" "}
                  {driver.mobile || "—"}
                </p>

                <p className="text-lg">
                  <strong>Gender:</strong>{" "}
                  {driver.gender || "—"}
                </p>

                <p className="text-lg">
                  <strong>Blood Group:</strong>{" "}
                  {driver.blood_group || "—"}
                </p>

                <p className="text-lg">
                  <strong>Aadhaar No:</strong>{" "}
                  {driver.aadhaar_no || "—"}
                </p>

                <p className="text-lg">
                  <strong>DL Number:</strong>{" "}
                  {driver.license_no || "—"}
                </p>

                <p className="text-lg">
                  <strong>Membership:</strong>{" "}
                  {driver.membership_plan || "—"}
                </p>

              </div>
            </div>

            {/* AADHAAR CARD */}
            <div>

              <h3 className="text-2xl font-bold mb-3">
                Aadhaar Card
              </h3>

              <div className="border rounded-xl h-[250px] bg-gray-50 overflow-hidden flex items-center justify-center">

                {aadhaarDoc?.file_url ? (
                  <img
                    src={aadhaarDoc.file_url}
                    alt="Aadhaar"
                    className="max-h-full object-contain"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <span>No Aadhaar Image</span>
                )}

              </div>
            </div>

            {/* DRIVING LICENSE */}
            <div>

              <h3 className="text-2xl font-bold mb-3">
                Driving License
              </h3>

              <div className="border rounded-xl h-[250px] bg-gray-50 overflow-hidden flex items-center justify-center">

                {dlDoc?.file_url ? (
                  <img
                    src={dlDoc.file_url}
                    alt="Driving License"
                    className="max-h-full object-contain"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <span>No DL Image</span>
                )}

              </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-end justify-between pt-6 border-t">

              <div className="flex items-center gap-2 text-lg">

                <input
                  type="checkbox"
                  checked
                  readOnly
                />

                <span>
                  I Agree to AIDRMK Terms & Conditions
                </span>

              </div>

              {/* SIGNATURE */}
              <div className="text-center">

                {driver.signature_url ? (
                  <img
                    src={driver.signature_url}
                    alt="Signature"
                    className="h-24 object-contain"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="h-24 flex items-center">
                    No Signature
                  </div>
                )}

                <div className="border-t pt-1 text-sm">
                  Signature
                </div>

              </div>
            </div>

            {/* TRANSACTION */}
            {driver.payment_transaction_id && (

              <div className="pt-4 text-sm text-gray-600">

                <strong>Transaction ID:</strong>{" "}
                {driver.payment_transaction_id}

              </div>
            )}

          </div>
        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
      <Button
        size="icon"
        variant="outline"
        onClick={handleDownload}
        title="Download Membership Document"
        className="h-8 w-8 hover:bg-green-50 hover:border-green-400 hover:text-green-600 transition-colors"
      >
        <Download className="h-4 w-4" />
      </Button>
    </>
  );
}