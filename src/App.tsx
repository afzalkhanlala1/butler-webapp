import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Roadmap from "./pages/Roadmap";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// Removed communication pages per request
// import Phone from "./pages/Phone";
// import SMS from "./pages/SMS";
// import WhatsApp from "./pages/WhatsApp";
// import Email from "./pages/Email";
import Calendar from "./pages/Calendar";
// Removed tools pages per request
// import Shortcuts from "./pages/Shortcuts";
import CcToSchedule from "./pages/CcToSchedule";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import Slack from "./pages/Slack";
import Inbox from "./pages/Inbox";
import TextingCalling from "./pages/TextingCalling";
import Reminders from "./pages/Reminders";
import Todos from "./pages/Todos";
import Notes from "./pages/Notes";
// import Search from "./pages/Search";
import EmailBriefings from "./pages/EmailBriefings";
import ProactiveDrafts from "./pages/ProactiveDrafts";
import EmailTriage from "./pages/EmailTriage";
import WakeUpCalls from "./pages/WakeUpCalls";
import Foodpanda from "./pages/Foodpanda";
import Careem from "./pages/Careem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/roadmap" element={
              <ProtectedRoute>
                <Roadmap />
              </ProtectedRoute>
            } />
            {/* communication routes removed */}
            <Route path="/calendar" element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            } />
            {/* tools routes removed */}
            <Route path="/cc-to-schedule" element={
              <ProtectedRoute>
                <CcToSchedule />
              </ProtectedRoute>
            } />
            <Route path="/pricing" element={
              <ProtectedRoute>
                <Pricing />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/slack" element={
              <ProtectedRoute>
                <Slack />
              </ProtectedRoute>
            } />
            <Route path="/inbox" element={
              <ProtectedRoute>
                <Inbox />
              </ProtectedRoute>
            } />
            <Route path="/texting-calling" element={
              <ProtectedRoute>
                <TextingCalling />
              </ProtectedRoute>
            } />
            <Route path="/reminders" element={
              <ProtectedRoute>
                <Reminders />
              </ProtectedRoute>
            } />
            <Route path="/todos" element={
              <ProtectedRoute>
                <Todos />
              </ProtectedRoute>
            } />
            <Route path="/notes" element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            } />
            {/* /search removed */}
            <Route path="/email-briefings" element={
              <ProtectedRoute>
                <EmailBriefings />
              </ProtectedRoute>
            } />
            <Route path="/proactive-drafts" element={
              <ProtectedRoute>
                <ProactiveDrafts />
              </ProtectedRoute>
            } />
            <Route path="/email-triage" element={
              <ProtectedRoute>
                <EmailTriage />
              </ProtectedRoute>
            } />
            <Route path="/wake-up-calls" element={
              <ProtectedRoute>
                <WakeUpCalls />
              </ProtectedRoute>
            } />
            <Route path="/foodpanda" element={
              <ProtectedRoute>
                <Foodpanda />
              </ProtectedRoute>
            } />
            <Route path="/careem" element={
              <ProtectedRoute>
                <Careem />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
