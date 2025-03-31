
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Zap } from "lucide-react";
import EnergyListingCard from "@/components/EnergyListingCard";
import CreateEnergyListingForm from "@/components/CreateEnergyListingForm";
import { mockListings } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EnergyListing } from "@/types/energy";
import { toast } from "@/hooks/use-toast";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedListing, setSelectedListing] = useState<EnergyListing | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search Results",
      description: `Found ${filteredListings.length} listings matching "${searchQuery}"`,
    });
  };
  
  const handleBuy = (listing: EnergyListing) => {
    setSelectedListing(listing);
    setDialogOpen(true);
  };
  
  const handleConfirmPurchase = () => {
    // Simulate purchase
    toast({
      title: "Purchase Successful",
      description: `You purchased ${selectedListing?.energyAmount} kWh of energy for ${selectedListing?.price} tokens`,
    });
    setDialogOpen(false);
  };
  
  // Filter and sort listings
  const filteredListings = mockListings.filter(listing => {
    if (sourceFilter && listing.source !== sourceFilter) return false;
    if (searchQuery && !listing.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "amount-high":
        return b.energyAmount - a.energyAmount;
      case "newest":
      default:
        return b.timestamp - a.timestamp;
    }
  });
  
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Energy Marketplace</h1>
        <p className="text-muted-foreground">
          Buy and sell renewable energy on the blockchain
        </p>
      </div>
      
      <Tabs defaultValue="browse">
        <TabsList>
          <TabsTrigger value="browse">Browse Listings</TabsTrigger>
          <TabsTrigger value="sell">Sell Energy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by location..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
            
            <div className="flex gap-2">
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="min-w-[140px] w-fit">
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="whitespace-nowrap">{sourceFilter || "All Sources"}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sources</SelectItem>
                  <SelectItem value="solar">Solar</SelectItem>
                  <SelectItem value="wind">Wind</SelectItem>
                  <SelectItem value="hydro">Hydro</SelectItem>
                  <SelectItem value="biomass">Biomass</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="min-w-[140px] w-fit">
                  <span className="whitespace-nowrap">Sort: {sortOption.replace("-", " ")}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <EnergyListingCard
                  key={listing.id}
                  listing={listing}
                  onBuy={handleBuy}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Zap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No listings found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sell">
          <div className="max-w-md mx-auto">
            <CreateEnergyListingForm />
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to purchase this energy?</p>
            
            {selectedListing && (
              <div className="mt-4 p-4 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Energy Source:</span>
                  <span className="font-medium capitalize">{selectedListing.source}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">{selectedListing.energyAmount} kWh</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">{selectedListing.price} Tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seller:</span>
                  <span className="font-medium font-mono text-xs">{selectedListing.seller.substring(0, 14)}...</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPurchase}>
              Confirm Purchase
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
