
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import blockchainService from '@/services/blockchainService';
import { UserWallet } from '@/types/energy';

interface BlockchainState {
  isConnected: boolean;
  isLoading: boolean;
  walletAddress: string | null;
  tokenBalance: number;
  ethBalance: number;
  error: string | null;
}

const initialState: BlockchainState = {
  isConnected: false,
  isLoading: false,
  walletAddress: null,
  tokenBalance: 0,
  ethBalance: 0,
  error: null,
};

export const connectWallet = createAsyncThunk(
  'blockchain/connectWallet',
  async (_, { rejectWithValue }) => {
    try {
      // First check if MetaMask is installed
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        return rejectWithValue('MetaMask is not installed. Please install MetaMask to use blockchain features.');
      }
      
      // If MetaMask exists, attempt to connect
      const address = await blockchainService.connectWallet();
      if (!address) {
        return rejectWithValue('Failed to connect wallet. User may have denied the connection request.');
      }
      
      // Get balances after successful connection
      const { tokenBalance, ethBalance } = await blockchainService.getWalletBalance();
      
      // Check if ETH balance is too low for gas
      if (ethBalance < 0.01) {
        const warning = 'Warning: Your ETH balance is low. You may not be able to perform transactions.';
        console.warn(warning);
        // Return success but with a warning
        return { 
          address, 
          tokenBalance, 
          ethBalance,
          warning
        };
      }
      
      return { address, tokenBalance, ethBalance };
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      return rejectWithValue(error.message || 'Failed to connect wallet');
    }
  }
);

export const blockchainSlice = createSlice({
  name: 'blockchain',
  initialState,
  reducers: {
    setWalletConnection: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    updateBalances: (state, action: PayloadAction<{ tokenBalance: number; ethBalance: number }>) => {
      state.tokenBalance = action.payload.tokenBalance;
      state.ethBalance = action.payload.ethBalance;
    },
    resetBlockchain: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isConnected = true;
        state.walletAddress = action.payload.address;
        state.tokenBalance = action.payload.tokenBalance;
        state.ethBalance = action.payload.ethBalance;
        
        // If there's a warning, we still set it as error for UI display
        if (action.payload.warning) {
          state.error = action.payload.warning;
        }
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setWalletConnection, updateBalances, resetBlockchain } = blockchainSlice.actions;

export default blockchainSlice.reducer;
