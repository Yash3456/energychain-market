
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CreateEnergyListingForm = () => {
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [source, setSource] = useState("solar");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Energy listed successfully",
        description: `${amount} kWh of ${source} energy is now listed on the marketplace.`,
      });
      // Reset form
      setAmount("");
      setPrice("");
      setSource("solar");
      setLocation("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 text-energy-green mr-2" />
          List Your Energy
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Energy Amount (kWh)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter energy amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0.1"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (Tokens)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price per kWh"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0.1"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Energy Source</Label>
            <Select 
              value={source} 
              onValueChange={setSource}
            >
              <SelectTrigger id="source">
                <SelectValue placeholder="Select energy source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solar">Solar</SelectItem>
                <SelectItem value="wind">Wind</SelectItem>
                <SelectItem value="hydro">Hydro</SelectItem>
                <SelectItem value="biomass">Biomass</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Processing</span>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                List Energy
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateEnergyListingForm;
