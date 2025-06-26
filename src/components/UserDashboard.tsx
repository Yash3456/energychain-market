
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Dashboard from "../pages/Dashboard";
import Marketplace from "../pages/Marketplace";
import MyEnergy from "../pages/MyEnergy";
import Wallet from "../pages/Wallet";
import Analytics from "../pages/Analytics";
import NotFound from "../pages/NotFound";

interface UserDashboardProps {
  userData: any;
  onLogout: () => void;
}

const UserDashboard = ({ userData, onLogout }: UserDashboardProps) => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="flex min-h-screen flex-col">
        <Header userData={userData} onLogout={onLogout} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/my-energy" element={<MyEnergy />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default UserDashboard;
