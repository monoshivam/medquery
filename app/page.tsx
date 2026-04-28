"use client";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Settings } from "lucide-react";
import { ModeToggle } from "@/components/modetoggle";
import { useState } from "react";
import ReportComponent from "@/components/ReportComponent";
import { useToast } from "@/components/ui/use-toast"
import ChatComponent from "@/components/chatcomponent";

const Home = () => {
  const { toast } = useToast()
  const [reportData, setreportData] = useState("");

  const onReportConfirmation = (data: string) => {
    setreportData(data);
    toast({ description: "Updated!" });
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <header className="shrink-0 z-10 flex h-[57px] bg-background items-center gap-1 border-b px-4">
        <h1 className="text-xl font-semibold text-[#D90013]">
          <span className="flex flex-row">MedicalRag</span>
        </h1>
        <div className="w-full flex flex-row justify-end gap-2">
          <ModeToggle />
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Settings />
                <span className="sr-only">Settings</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <ReportComponent onReportConfirmation={onReportConfirmation} />
            </DrawerContent>
          </Drawer>
        </div>
      </header>

      <main className="flex-1 min-h-0 grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="hidden md:flex flex-col overflow-y-auto">
          <ReportComponent onReportConfirmation={onReportConfirmation} />
        </div>
        <div className="lg:col-span-2 min-h-0 h-full">
          <ChatComponent reportData={reportData} />
        </div>
      </main>
    </div>
  );
};

export default Home;
