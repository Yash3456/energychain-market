
import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { useBlockchain } from "@/hooks/useBlockchain";

interface ConnectWalletButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ 
  variant = "default", 
  size = "default",
  className = ""
}) => {
  const { isConnected, isLoading, walletAddress, connectWallet } = useBlockchain();

  const handleClick = async () => {
    if (!isConnected) {
      await connectWallet();
    }
  };

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading || isConnected}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : isConnected ? (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 'Connected'}
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};

export default ConnectWalletButton;
