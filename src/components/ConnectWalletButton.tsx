
import React from "react";
import { Button } from "./ui/button";
import { useBlockchain } from "@/hooks/useBlockchain";
import { Wallet } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppRedux";

interface ConnectWalletButtonProps {
  className?: string;
}

const ConnectWalletButton = ({ className = "" }: ConnectWalletButtonProps) => {
  const { isConnected, isLoading, walletAddress } = useAppSelector(state => state.blockchain);
  const { connectWallet } = useBlockchain();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return isConnected ? (
    <Button variant="outline" className={className}>
      <Wallet className="h-4 w-4 mr-2" />
      {walletAddress ? formatAddress(walletAddress) : "Wallet Connected"}
    </Button>
  ) : (
    <Button 
      onClick={connectWallet} 
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <span className="mr-2">Connecting</span>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};

export default ConnectWalletButton;
