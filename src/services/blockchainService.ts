
import { ethers } from 'ethers';
import { BlockchainConfig, EnergyListing, ContractTransaction } from '@/types/energy';
import { toast } from '@/hooks/use-toast';

// ABI definitions for our contracts
const EnergyTokenABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

const EnergyMarketplaceABI = [
  "function createListing(uint256 energyAmount, uint256 price, string memory source, string memory location) returns (uint256)",
  "function purchaseListing(uint256 id) returns (bool)",
  "function getListingCount() view returns (uint256)",
  "function listings(uint256 id) view returns (uint256 id, address seller, uint256 energyAmount, uint256 price, string memory source, string memory location, uint256 timestamp, bool available)",
  "event ListingCreated(uint256 id, address seller, uint256 energyAmount, uint256 price, string source, string location)",
  "event ListingPurchased(uint256 id, address buyer, address seller, uint256 energyAmount, uint256 price)"
];

// Default blockchain configuration (Ethereum testnet)
export const defaultBlockchainConfig: BlockchainConfig = {
  networkId: 11155111,
  networkName: 'Sepolia',
  currencySymbol: 'ETH',
  contractAddresses: {
    energyToken: '0x0000000000000000000000000000000000000000', // Replace with actual address
    energyMarketplace: '0x0000000000000000000000000000000000000000', // Replace with actual address
  },
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY', // Replace with your Infura key
  blockExplorerUrl: 'https://sepolia.etherscan.io',
};

class BlockchainService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private tokenContract: ethers.Contract | null = null;
  private marketplaceContract: ethers.Contract | null = null;
  private config: BlockchainConfig;
  private isInitialized = false;

  constructor(config: BlockchainConfig = defaultBlockchainConfig) {
    this.config = config;
  }

  async initialize(): Promise<boolean> {
    try {
      // Check if ethereum is available (MetaMask or other wallet)
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        toast({
          title: "Wallet not found",
          description: "Please install MetaMask or another Ethereum wallet to use the blockchain features.",
        });
        return false;
      }

      // Initialize ethers provider
      this.provider = new ethers.providers.Web3Provider(ethereum);
      
      // Request wallet connection
      await this.provider.send("eth_requestAccounts", []);
      
      // Get signer
      this.signer = this.provider.getSigner();
      
      // Initialize contracts
      this.tokenContract = new ethers.Contract(
        this.config.contractAddresses.energyToken,
        EnergyTokenABI,
        this.signer
      );
      
      this.marketplaceContract = new ethers.Contract(
        this.config.contractAddresses.energyMarketplace,
        EnergyMarketplaceABI,
        this.signer
      );

      // Verify network
      const network = await this.provider.getNetwork();
      if (network.chainId !== this.config.networkId) {
        toast({
          title: "Wrong network",
          description: `Please switch to ${this.config.networkName} in your wallet.`,
        });
        return false;
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize blockchain service:", error);
      toast({
        title: "Connection failed",
        description: "Could not connect to your blockchain wallet.",
        variant: "destructive",
      });
      return false;
    }
  }

  async connectWallet(): Promise<string | null> {
    try {
      if (!this.isInitialized) {
        const success = await this.initialize();
        if (!success) return null;
      }

      const address = await this.signer?.getAddress();
      return address || null;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return null;
    }
  }

  async getWalletBalance(): Promise<{ tokenBalance: number; ethBalance: number }> {
    try {
      if (!this.signer || !this.tokenContract) {
        throw new Error("Blockchain service not initialized");
      }

      const address = await this.signer.getAddress();
      const tokenBalanceBN = await this.tokenContract.balanceOf(address);
      const ethBalanceBN = await this.provider?.getBalance(address);

      // Convert from wei to ETH and from token base units
      const ethBalance = parseFloat(ethers.utils.formatEther(ethBalanceBN || 0));
      const tokenBalance = parseFloat(ethers.utils.formatUnits(tokenBalanceBN || 0, 18));

      return { tokenBalance, ethBalance };
    } catch (error) {
      console.error("Failed to get wallet balance:", error);
      return { tokenBalance: 0, ethBalance: 0 };
    }
  }

  async createEnergyListing(
    energyAmount: number,
    price: number,
    source: string,
    location: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      if (!this.marketplaceContract) {
        throw new Error("Blockchain service not initialized");
      }

      // Convert values to blockchain format (wei)
      const energyAmountWei = ethers.utils.parseUnits(energyAmount.toString(), 18);
      const priceWei = ethers.utils.parseUnits(price.toString(), 18);

      // Create listing transaction
      const transaction: ContractTransaction = await this.marketplaceContract.createListing(
        energyAmountWei,
        priceWei,
        source,
        location
      );

      // Wait for transaction to be mined
      const receipt = await transaction.wait();
      
      if (receipt.status === 1) {
        return { success: true, transactionHash: receipt.transactionHash };
      } else {
        return { success: false, error: "Transaction failed" };
      }
    } catch (error: any) {
      console.error("Failed to create energy listing:", error);
      return { 
        success: false, 
        error: error.message || "Unknown error occurred while creating listing" 
      };
    }
  }

  async purchaseEnergyListing(
    listingId: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      if (!this.marketplaceContract || !this.tokenContract) {
        throw new Error("Blockchain service not initialized");
      }

      // First approve the marketplace to spend tokens
      const listing = await this.getListingById(listingId);
      if (!listing) {
        throw new Error("Listing not found");
      }

      // Approve tokens first
      const approveTx: ContractTransaction = await this.tokenContract.approve(
        this.config.contractAddresses.energyMarketplace,
        ethers.utils.parseUnits(listing.price.toString(), 18)
      );
      await approveTx.wait();

      // Purchase listing
      const purchaseTx: ContractTransaction = await this.marketplaceContract.purchaseListing(listingId);
      const receipt = await purchaseTx.wait();

      if (receipt.status === 1) {
        return { success: true, transactionHash: receipt.transactionHash };
      } else {
        return { success: false, error: "Transaction failed" };
      }
    } catch (error: any) {
      console.error("Failed to purchase energy listing:", error);
      return { 
        success: false, 
        error: error.message || "Unknown error occurred while purchasing" 
      };
    }
  }

  async getListingById(id: string): Promise<EnergyListing | null> {
    try {
      if (!this.marketplaceContract) {
        throw new Error("Blockchain service not initialized");
      }

      const listingData = await this.marketplaceContract.listings(id);
      
      if (!listingData || !listingData.seller) {
        return null;
      }

      return {
        id: listingData.id.toString(),
        seller: listingData.seller,
        energyAmount: parseFloat(ethers.utils.formatUnits(listingData.energyAmount, 18)),
        price: parseFloat(ethers.utils.formatUnits(listingData.price, 18)),
        source: listingData.source as 'solar' | 'wind' | 'hydro' | 'biomass',
        location: listingData.location,
        timestamp: listingData.timestamp.toNumber() * 1000, // Convert blockchain timestamp to JS timestamp
        available: listingData.available
      };
    } catch (error) {
      console.error("Failed to get listing by ID:", error);
      return null;
    }
  }

  async getAllListings(): Promise<EnergyListing[]> {
    try {
      if (!this.marketplaceContract) {
        throw new Error("Blockchain service not initialized");
      }

      const count = await this.marketplaceContract.getListingCount();
      const listings: EnergyListing[] = [];

      for (let i = 1; i <= count.toNumber(); i++) {
        const listing = await this.getListingById(i.toString());
        if (listing && listing.available) {
          listings.push(listing);
        }
      }

      return listings;
    } catch (error) {
      console.error("Failed to get all listings:", error);
      return [];
    }
  }

  getExplorerUrl(txHash: string): string {
    return `${this.config.blockExplorerUrl}/tx/${txHash}`;
  }
}

// Create a singleton instance
const blockchainService = new BlockchainService();
export default blockchainService;
