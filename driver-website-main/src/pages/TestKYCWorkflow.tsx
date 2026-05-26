import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, User, Shield, FileCheck } from "lucide-react";

const TestKYCWorkflow = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      title: "Register as a New Driver",
      description: "Go to the driver registration page and fill in all required details including mobile number and 4-digit PIN",
      action: "Go to Registration",
      route: "/register",
      icon: User,
      color: "bg-blue-500"
    },
    {
      number: 2,
      title: "Upload KYC Documents",
      description: "Upload your Driving License and Aadhaar card images. You can use the camera or select from gallery",
      action: "Continue Registration",
      route: "/register",
      icon: FileCheck,
      color: "bg-purple-500"
    },
    {
      number: 3,
      title: "Login to Admin Dashboard",
      description: "Login with admin credentials to access the admin dashboard",
      action: "Go to Admin Login",
      route: "/auth",
      icon: Shield,
      color: "bg-orange-500"
    },
    {
      number: 4,
      title: "Verify KYC Documents",
      description: "In the admin dashboard, go to the KYC tab, view uploaded documents, and approve or reject them",
      action: "Go to Admin Dashboard",
      route: "/admin/dashboard",
      icon: CheckCircle,
      color: "bg-green-500"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Testing Guide</Badge>
            <h1 className="text-4xl font-bold mb-4">KYC Verification Workflow Test</h1>
            <p className="text-muted-foreground text-lg">
              Follow these steps to test the complete KYC verification process
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={step.number} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-2 h-full ${step.color}`} />
                  <CardHeader className="pl-6">
                    <div className="flex items-start gap-4">
                      <div className={`${step.color} text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0`}>
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <CardTitle>{step.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pl-6">
                    <Button 
                      onClick={() => navigate(step.route)}
                      className="w-full sm:w-auto"
                    >
                      {step.action}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                  {index < steps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          <Card className="mt-8 bg-muted/50">
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">After registration, you'll receive a membership ID</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">KYC status will show as "SUBMITTED" after document upload</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">Admin can view full-size documents by clicking on them</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">After approval, driver status changes to "ACTIVE" and KYC status to "VERIFIED"</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">Rejection requires a note explaining the reason</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestKYCWorkflow;
