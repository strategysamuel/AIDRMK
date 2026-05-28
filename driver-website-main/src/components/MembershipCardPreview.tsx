import { Card, CardContent } from "@/components/ui/card";
import { assetPath, logoPath } from "@/lib/assets";

const padmanabhan = assetPath("padmanabhan.png");
const flagLogo = logoPath;

interface MembershipCardPreviewProps {
  formData: {
    fullName: string;
    fatherOrHusband: string;
    dob: string;
    dlNo: string;
    address: string;
    bloodGroup: string;
    mobileNo: string;
    emergencyMobile: string;
    membershipPlan?: string;
    membershipId?: string;
  };
  photoUrl?: string;
}

const MembershipCardPreview = ({
  formData,
  photoUrl,
}: MembershipCardPreviewProps) => {

  const getMembershipId = () => {
    return (
      formData.membershipId ||
      "AIDRMK000001"
    );
  };

  const getValidUpto = () => {

    const currentDate = new Date();

    const plan =
      (
        formData.membershipPlan || ""
      ).toLowerCase();

    if (
      plan === "basic" ||
      plan === "free"
    ) {
      currentDate.setFullYear(
        currentDate.getFullYear() + 1
      );
    } else if (
      plan === "standard"
    ) {
      currentDate.setFullYear(
        currentDate.getFullYear() + 5
      );
    } else {
      return "Lifetime";
    }

    return currentDate.toLocaleDateString(
      "en-IN",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const getBadgeNumber = () => {
    return `BD${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  };

  const getPlanColors = () => {

    switch (
      (
        formData.membershipPlan || ""
      ).toLowerCase()
    ) {

      case "basic":
      case "free":

        return {
          header:
            "bg-[#FACC15] text-gray-900",
          border:
            "border-[#FACC15]",
          accent:
            "text-[#B45309]",
        };

      case "standard":

        return {
          header:
            "bg-[#707070] text-white",
          border:
            "border-[#707070]",
          accent:
            "text-[#707070]",
        };

      case "premium":

        return {
          header:
            "bg-[#6b21a8] text-white",
          border:
            "border-[#6b21a8]",
          accent:
            "text-[#6b21a8]",
        };

      default:

        return {
          header:
            "bg-primary text-white",
          border:
            "border-primary",
          accent:
            "text-primary",
        };
    }
  };

  const colors = getPlanColors();

  return (

    <div className="space-y-8 w-full">

      {/* FRONT CARD */}
      <div className="w-full overflow-x-auto">

        <Card className="rounded-2xl border-none shadow-2xl overflow-hidden w-full max-w-[500px] mx-auto min-w-[300px]">

          <CardContent className="p-0">

            <div className="relative bg-white">

              {/* HEADER */}
              <div
                className={`relative flex items-center justify-between p-3 ${colors.header} rounded-b-[30px] shadow-lg`}
              >

                <img
                  src={flagLogo}
                  alt="Logo"
                  className="h-12 w-12 sm:h-16 sm:w-16"
                />

                <div className="flex-1 text-center px-2">

                  <h2 className="text-sm sm:text-xl font-bold font-serif leading-tight">

                    All India Driver's Munnetra Gazhaagam

                  </h2>

                  <p className="text-[9px] sm:text-[10px] mt-1">

                    No.30, Medavakkam Main Road,
                    Keelkattalai, Chennai - 600117.

                  </p>
                </div>

                <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl overflow-hidden border-2 border-white shadow-inner">

                  <img
                    src={padmanabhan}
                    alt="President"
                    className="h-full w-full object-cover"
                  />

                </div>
              </div>

              {/* BODY */}
              <div className="px-3 sm:px-6 py-4 relative">

                <h3 className="text-sm sm:text-xl font-bold text-center text-green-700 uppercase tracking-[0.2em] mb-4">

                  MEMBERSHIP IDENTITY CARD

                </h3>

                <div className="grid grid-cols-12 gap-4">

                  {/* PHOTO */}
                  <div className="col-span-4 flex justify-center">

                    <div
                      className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 ${colors.border} shadow-md bg-white`}
                    >

                      {photoUrl &&
                      photoUrl.trim() !== "" ? (

                        <img
                          src={photoUrl}
                          alt="Member"
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      ) : (

                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">

                          <span className="text-xs text-gray-500 uppercase">

                            Photo

                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="col-span-8 space-y-2 text-[10px] sm:text-[12px] font-semibold">

                    {[
                      {
                        label: "Name",
                        value:
                          formData.fullName,
                      },

                      {
                        label: "S/o",
                        value:
                          formData.fatherOrHusband ||
                          "—",
                      },

                      {
                        label:
                          "Date of Birth",

                        value:
                          formData.dob,
                      },

                      {
                        label:
                          "Membership ID",

                        value:
                          getMembershipId(),
                      },

                      {
                        label:
                          "Valid upto",

                        value:
                          getValidUpto(),
                      },

                      {
                        label:
                          "DL. NO",

                        value:
                          formData.dlNo,
                      },

                      {
                        label:
                          "Badge No",

                        value:
                          getBadgeNumber(),
                      },

                    ].map((item) => (

                      <div
                        key={item.label}
                        className="flex gap-1"
                      >

                        <span
                          className={`${colors.accent} uppercase w-[100px]`}
                        >
                          {item.label}
                        </span>

                        <span>:</span>

                        <span className="uppercase break-all">

                          {item.value}

                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="mt-4 flex justify-between items-end">

                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">

                    🚗

                  </div>

                  <div className="text-right">

                    <div className="h-8 w-24 border-b border-black"></div>

                    <p className="text-[10px] font-bold uppercase mt-1">

                      President

                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BACK CARD */}
      <div className="w-full overflow-x-auto">

        <Card className="rounded-2xl border-none shadow-2xl overflow-hidden w-full max-w-[500px] mx-auto min-w-[300px] bg-[#fdfaf5]">

          <CardContent className="p-4">

            <div className="grid grid-cols-12 gap-4">

              {/* LEFT */}
              <div className="col-span-8 space-y-3">

                <div>

                  <h4
                    className={`${colors.accent} font-bold uppercase text-xs`}
                  >
                    Address
                  </h4>

                  <div className="bg-gray-100 border p-2 text-xs rounded mt-1">

                    {formData.address}

                  </div>
                </div>

                <div className="space-y-2">

                  <div className="flex gap-2">

                    <h4
                      className={`${colors.accent} font-bold uppercase text-xs`}
                    >
                      Blood Group :
                    </h4>

                    <span className="font-bold text-sm">

                      {formData.bloodGroup?.trim()
                        ? formData.bloodGroup
                        : "—"}

                    </span>
                  </div>

                  <div>

                    <h4
                      className={`${colors.accent} font-bold uppercase text-xs`}
                    >
                      Mobile No :
                    </h4>

                    <p className="font-bold text-sm">

                      {formData.mobileNo}

                    </p>
                  </div>

                  <div>

                    <h4
                      className={`${colors.accent} font-bold uppercase text-xs`}
                    >
                      Emergency Contact :
                    </h4>

                    <p className="font-bold text-red-600 text-sm">

                      {formData.emergencyMobile}

                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="col-span-4 flex items-center justify-center">

                <div className="w-full max-w-[120px] aspect-[4/5] border rounded overflow-hidden">

                  <img
                    src={padmanabhan}
                    alt="President"
                    className="w-full h-full object-cover"
                  />

                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div
              className={`${colors.header} mt-4 p-3 rounded-lg`}
            >

              <h3 className="font-bold uppercase text-center text-xs mb-2">

                If found, Please return to :

              </h3>

              <div className="flex items-center gap-2">

                <img
                  src={flagLogo}
                  alt="Logo"
                  className="h-10 w-10"
                />

                <div className="flex-1">

                  <p className="font-bold text-sm">

                    All India Driver's Munnetra Gazhaagam

                  </p>

                  <p className="text-[10px]">

                    30, Medavakkam Main Road,
                    Keelkattalai,
                    Chennai - 600117.

                  </p>

                  <p className="text-[10px] font-bold">

                    Landline : 044 - 22470011

                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">

                  🚗

                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MembershipCardPreview;
