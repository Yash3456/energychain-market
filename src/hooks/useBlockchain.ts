
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from './useAppRedux';
import { connectWallet, updateBalances } from '@/store/blockchainSlice';
import { fetchListings, createListing, setIsUsingBlockchain } from '@/store/listingsSlice';
import { purchaseEnergy } from '@/store/transactionsSlice';
import blockchainService from '@/services/blockchainService';

export function useBlockchain() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const { 
    isConnected, 
    isLoading: blockchainLoading, 
    walletAddress,
    tokenBalance,
    ethBalance,
    error 
  } = useAppSelector(state => state.blockchain);
  
  const { isUsingBlockchain } = useAppSelector(state => state.listings);

  useEffect(() => {
    // Check if the user has previously connected their wallet
    const checkConnection = async () => {
      const ethereum = (window as any).ethereum;
      if (ethereum && ethereum.selectedAddress) {
        handleConnectWallet();
      }
    };

    checkConnection();
  }, []);

  const handleConnectWallet = async () => {
    const resultAction = await dispatch(connectWallet());
    
    if (connectWallet.fulfilled.match(resultAction)) {
      const address = resultAction.payload.address;
      toast({
        title: "Wallet connected",
        description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      });
    } else if (connectWallet.rejected.match(resultAction) && resultAction.payload) {
      toast({
        title: "Connection failed",
        description: resultAction.payload as string,
        variant: "destructive",
      });
    }
  };

  const handleCreateListing = async (
    energyAmount: number,
    price: number,
    source: string,
    location: string
  ) => {
    // First check if we're in blockchain mode and the wallet is connected
    if (isUsingBlockchain && !isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a blockchain listing",
        variant: "destructive",
      });
      return { success: false, error: "Wallet not connected" };
    }

    const resultAction = await dispatch(
      createListing({
        energyAmount,
        price,
        source,
        location,
        useBlockchain: isUsingBlockchain
      })
    );

    if (createListing.fulfilled.match(resultAction)) {
      toast({
        title: "Listing created",
        description: "Your energy listing has been created successfully.",
      });
      return { success: true };
    } else if (createListing.rejected.match(resultAction) && resultAction.payload) {
      toast({
        title: "Failed to create listing",
        description: resultAction.payload as string,
        variant: "destructive",
      });
      return { success: false, error: resultAction.payload as string };
    }
    
    return { success: false, error: "Unknown error" };
  };

  const handlePurchaseEnergy = async (listingId: string) => {
    // First check if we're in blockchain mode and the wallet is connected
    if (isUsingBlockchain && !isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make blockchain purchases",
        variant: "destructive",
      });
      return { success: false, error: "Wallet not connected" };
    }
    
    // Get listing details first
    const listing = await blockchainService.getListingById(listingId);
    
    if (!listing) {
      toast({
        title: "Listing not found",
        description: "The energy listing you're trying to purchase doesn't exist.",
        variant: "destructive",
      });
      return { success: false, error: "Listing not found" };
    }
    
    const resultAction = await dispatch(
      purchaseEnergy({
        listing,
        useBlockchain: isUsingBlockchain
      })
    );

    if (purchaseEnergy.fulfilled.match(resultAction)) {
      toast({
        title: "Purchase successful",
        description: `You purchased ${listing.energyAmount} kWh of energy for ${listing.price} tokens`,
      });
      
      // Update balances
      const { tokenBalance, ethBalance } = await blockchainService.getWalletBalance();
      dispatch(updateBalances({ tokenBalance, ethBalance }));
      
      return { success: true };
    } else if (purchaseEnergy.rejected.match(resultAction) && resultAction.payload) {
      toast({
        title: "Purchase failed",
        description: resultAction.payload as string,
        variant: "destructive",
      });
      return { success: false, error: resultAction.payload as string };
    }
    
    return { success: false, error: "Unknown error" };
  };

  const handleGetListings = async () => {
    const resultAction = await dispatch(fetchListings(isUsingBlockchain));
    
    if (fetchListings.fulfilled.match(resultAction)) {
      return resultAction.payload;
    }
    
    return [];
  };
  
  const toggleBlockchainMode = async () => {
    // If we're turning on blockchain mode, make sure wallet is connected first
    if (!isUsingBlockchain) {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        toast({
          title: "MetaMask not installed",
          description: "Please install MetaMask to use blockchain features",
          variant: "destructive",
        });
        return;
      }
      
      if (!isConnected) {
        await handleConnectWallet();
        if (!isConnected) {
          // If still not connected after trying, abort
          return;
        }
      }
    }
    
    dispatch(setIsUsingBlockchain(!isUsingBlockchain));
    dispatch(fetchListings(!isUsingBlockchain));
    
    toast({
      title: !isUsingBlockchain ? "Using blockchain mode" : "Using demo mode",
      description: !isUsingBlockchain 
        ? "Connected to real blockchain data" 
        : "Switched to demo data",
    });
  };

  return {
    isConnected,
    isLoading: blockchainLoading,
    walletAddress,
    tokenBalance,
    ethBalance,
    isUsingBlockchain,
    error,
    connectWallet: handleConnectWallet,
    createListing: handleCreateListing,
    purchaseEnergy: handlePurchaseEnergy,
    getListings: handleGetListings,
    toggleBlockchainMode,
  };
}
