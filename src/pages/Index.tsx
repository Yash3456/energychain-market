
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, ShoppingCart, BarChart2, Wallet, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import Dashboard from "./Dashboard";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
