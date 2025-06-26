
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  BatteryMedium, 
  Leaf, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Sun,
  Wind,
  Droplets,
  LogOut,
  User
} from "lucide-react";

interface UserData {
  name: string;
  email: string;
  energyBalance: number;
  dailyProduction: number;
  monthlyConsumption: number;
  carbonOffset: number;
}

interface UserDashboardProps {
  userData: UserData;
  onLogout: () => void;
}

const UserDashboard = ({ userData, onLogout }: UserDashboardProps) => {
  const energyEfficiency = Math.round((userData.dailyProduction / (userData.monthlyConsumption / 30)) * 100);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap size={28} className="text-energy-green" />
            <h1 className="text-2xl font-bold">EnergyChain</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{userData.name}</span>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Welcome back, {userData.name.split(' ')[0]}!</h2>
          <p className="text-xl text-muted-foreground">
            Here's your personalized energy dashboard
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 p-8 text-white">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Sustainable Energy Future</h3>
            <p className="text-lg opacity-90">
              Track, trade, and optimize your renewable energy consumption
            </p>
          </div>
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <img
            src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80"
            alt="Solar panels"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          />
        </div>

        {/* Energy Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Energy Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-green-600" />
                <div className="text-3xl font-bold text-green-800">
                  {userData.energyBalance.toFixed(1)} kWh
                </div>
              </div>
              <Badge className="mt-2 bg-green-200 text-green-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                Available
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Daily Production</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Sun className="h-5 w-5 mr-2 text-blue-600" />
                <div className="text-3xl font-bold text-blue-800">
                  {userData.dailyProduction.toFixed(1)} kWh
                </div>
              </div>
              <Badge className="mt-2 bg-blue-200 text-blue-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                Today
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Monthly Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BatteryMedium className="h-5 w-5 mr-2 text-orange-600" />
                <div className="text-3xl font-bold text-orange-800">
                  {userData.monthlyConsumption} kWh
                </div>
              </div>
              <Badge className="mt-2 bg-orange-200 text-orange-800">
                <TrendingDown className="h-3 w-3 mr-1" />
                This month
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">Carbon Offset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-emerald-600" />
                <div className="text-3xl font-bold text-emerald-800">
                  {userData.carbonOffset.toFixed(1)} tons
                </div>
              </div>
              <Badge className="mt-2 bg-emerald-200 text-emerald-800">
                <Leaf className="h-3 w-3 mr-1" />
                CO₂ Saved
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Efficiency Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-energy-green" />
              Energy Efficiency Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Energy Efficiency</span>
                    <span className="text-sm text-muted-foreground">{energyEfficiency}%</span>
                  </div>
                  <Progress value={energyEfficiency} className="h-3" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Daily Production Goal</span>
                    <span className="text-sm font-medium">15 kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Current Production</span>
                    <span className="text-sm font-medium">{userData.dailyProduction.toFixed(1)} kWh</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Energy Sources</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Solar</span>
                    </div>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Wind</span>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-cyan-500" />
                      <span className="text-sm">Hydro</span>
                    </div>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="overflow-hidden">
            <div className="h-48 bg-cover bg-center" style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=400&q=80')"
            }}>
              <div className="h-full bg-black bg-opacity-40 flex items-end p-4">
                <h3 className="text-white font-bold">Solar Energy</h3>
              </div>
            </div>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                Harness the power of the sun with our advanced solar panel technology.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="h-48 bg-cover bg-center" style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=400&q=80')"
            }}>
              <div className="h-full bg-black bg-opacity-40 flex items-end p-4">
                <h3 className="text-white font-bold">Wind Power</h3>
              </div>
            </div>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                Clean wind energy generation for sustainable power solutions.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="h-48 bg-cover bg-center" style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1421757350652-9f65a35effc7?auto=format&fit=crop&w=400&q=80')"
            }}>
              <div className="h-full bg-black bg-opacity-40 flex items-end p-4">
                <h3 className="text-white font-bold">Smart Grid</h3>
              </div>
            </div>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                Intelligent energy distribution through our blockchain network.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-energy-green hover:bg-energy-green/90">
            <Zap className="h-5 w-5 mr-2" />
            Trade Energy
          </Button>
          <Button size="lg" variant="outline">
            <BarChart3 className="h-5 w-5 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
