
# EnergyChain Smart Contracts

This directory contains the Solidity smart contracts for the EnergyChain decentralized marketplace application.

## Contracts

### EnergyToken.sol
An ERC20 token contract that represents energy units on the blockchain. Users can:
- Buy tokens using ETH
- Transfer tokens to other users
- Use tokens to purchase energy listings

### EnergyMarketplace.sol
A marketplace contract that allows users to:
- Create energy listings with specific amount, price, source, and location
- Purchase energy listings using EnergyTokens
- View all available listings
- Cancel their own listings

## Deployment

To deploy these contracts:

1. Deploy the EnergyToken contract first
2. Use the EnergyToken contract address when deploying the EnergyMarketplace contract

## Using with the EnergyChain Application

After deployment, update the contract addresses in the `blockchainService.ts` file:

```typescript
export const defaultBlockchainConfig: BlockchainConfig = {
  ...
  contractAddresses: {
    energyToken: "0x...", // Replace with deployed EnergyToken address
    energyMarketplace: "0x...", // Replace with deployed EnergyMarketplace address
  },
  ...
};
```

## Testing

These contracts should be tested thoroughly on a testnet like Sepolia before deploying to mainnet.
