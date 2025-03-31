
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import blockchainService from '@/services/blockchainService';
import { EnergyListing } from '@/types/energy';

export function useBlockchain() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user has previously connected their wallet
    const checkConnection = async () => {
      const ethereum = (window as any).ethereum;
      if (ethereum && ethereum.selectedAddress) {
        await connectWallet();
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const address = await blockchainService.connectWallet();
      if (address) {
        setWalletAddress(address);
        setIsConnected(true);
        
        // Get balances
        const { tokenBalance, ethBalance } = await blockchainService.getWalletBalance();
        setTokenBalance(tokenBalance);
        setEthBalance(ethBalance);
        
        toast({
          title: "Wallet connected",
          description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection failed",
        description: "Could not connect to your blockchain wallet.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createListing = async (
    energyAmount: number,
    price: number,
    source: string,
    location: string
  ) => {
    setIsLoading(true);
    try {
      const result = await blockchainService.createEnergyListing(
        energyAmount,
        price,
        source,
        location
      );

      if (result.success) {
        toast({
          title: "Listing created",
          description: "Your energy listing has been created on the blockchain.",
        });
        return result;
      } else {
        toast({
          title: "Failed to create listing",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
        return result;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create listing",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseEnergy = async (listingId: string) => {
    setIsLoading(true);
    try {
      const result = await blockchainService.purchaseEnergyListing(listingId);

      if (result.success) {
        toast({
          title: "Purchase successful",
          description: "Your energy purchase has been confirmed on the blockchain.",
        });
        return result;
      } else {
        toast({
          title: "Purchase failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
        return result;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to purchase energy",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getListings = async (): Promise<EnergyListing[]> => {
    try {
      return await blockchainService.getAllListings();
    } catch (error) {
      console.error("Error getting listings:", error);
      return [];
    }
  };

  return {
    isConnected,
    isLoading,
    walletAddress,
    tokenBalance,
    ethBalance,
    connectWallet,
    createListing,
    purchaseEnergy,
    getListings,
  };
}
