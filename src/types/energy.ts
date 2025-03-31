
export interface EnergyListing {
  id: string;
  seller: string;
  energyAmount: number; // in kWh
  price: number; // in tokens
  source: 'solar' | 'wind' | 'hydro' | 'biomass';
  location: string;
  timestamp: number;
  available: boolean;
}

export interface Transaction {
  id: string;
  seller: string;
  buyer: string;
  energyAmount: number;
  price: number;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface UserWallet {
  address: string;
  balance: number;
  energyBalance: number;
}

export interface MarketStats {
  totalEnergy: number;
  averagePrice: number;
  totalTransactions: number;
  activeListings: number;
}
