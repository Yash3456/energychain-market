
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EnergyToken
 * @dev ERC20 Token for the EnergyChain marketplace
 */
contract EnergyToken is ERC20, Ownable {
    // Events
    event Minted(address indexed to, uint256 amount);
    
    /**
     * @dev Constructor that gives the msg.sender an initial supply of tokens
     */
    constructor() ERC20("EnergyToken", "ENRG") Ownable(msg.sender) {
        // Mint 1 million tokens initially to the contract creator
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
    
    /**
     * @dev Function to mint tokens
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     * @return A boolean that indicates if the operation was successful
     */
    function mint(address to, uint256 amount) public onlyOwner returns (bool) {
        _mint(to, amount);
        emit Minted(to, amount);
        return true;
    }
    
    /**
     * @dev Allows users to buy tokens by sending ETH
     */
    function buyTokens() public payable {
        require(msg.value > 0, "Send ETH to buy tokens");
        
        // Calculate tokens amount (1 ETH = 100 ENRG)
        uint256 tokenAmount = (msg.value * 100) / (1 ether);
        
        // Check if the contract has enough tokens
        require(balanceOf(owner()) >= tokenAmount, "Not enough tokens in reserve");
        
        // Transfer tokens to the buyer
        _transfer(owner(), msg.sender, tokenAmount);
    }
}
