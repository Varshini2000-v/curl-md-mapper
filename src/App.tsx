import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { FileProvider } from "./contexts/FileContext";
import FileRepository from "./pages/FileRepository";
import TestScenarios from "./pages/TestScenarios";
import CreateTestScenario from "./pages/CreateTestScenario";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <FileProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<FileRepository />} />
              <Route path="/test-scenarios" element={<TestScenarios />} />
              <Route path="/test-scenarios/create" element={<CreateTestScenario />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </FileProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
