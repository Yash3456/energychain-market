
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
      const address = await blockchainService.connectWallet();
      if (!address) {
        return rejectWithValue('Failed to connect wallet');
      }
      
      const { tokenBalance, ethBalance } = await blockchainService.getWalletBalance();
      return { address, tokenBalance, ethBalance };
    } catch (error: any) {
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
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setWalletConnection, updateBalances, resetBlockchain } = blockchainSlice.actions;

export default blockchainSlice.reducer;
