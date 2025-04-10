
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title EnergyMarketplace
 * @dev Implements a marketplace for energy trading
 */
contract EnergyMarketplace is ReentrancyGuard {
    // Token contract
    IERC20 public energyToken;
    
    // Listing structure
    struct Listing {
        uint256 id;
        address seller;
        uint256 energyAmount;
        uint256 price;
        string source;
        string location;
        uint256 timestamp;
        bool available;
    }
    
    // State variables
    uint256 public listingCount;
    mapping(uint256 => Listing) public listings;
    
    // Events
    event ListingCreated(
        uint256 id,
        address seller,
        uint256 energyAmount, 
        uint256 price, 
        string source, 
        string location
    );
    
    event ListingPurchased(
        uint256 id,
        address buyer,
        address seller,
        uint256 energyAmount,
        uint256 price
    );
    
    /**
     * @dev Constructor sets the token contract address
     * @param _energyToken Address of the EnergyToken contract
     */
    constructor(address _energyToken) {
        require(_energyToken != address(0), "Invalid token address");
        energyToken = IERC20(_energyToken);
        listingCount = 0;
    }
    
    /**
     * @dev Creates a new energy listing
     * @param energyAmount Amount of energy in kWh (with 18 decimals)
     * @param price Price in tokens (with 18 decimals)
     * @param source Source of energy (solar, wind, etc.)
     * @param location Geographic location of the energy source
     * @return id of the created listing
     */
    function createListing(
        uint256 energyAmount,
        uint256 price,
        string memory source,
        string memory location
    ) public returns (uint256) {
        // Validation
        require(energyAmount > 0, "Energy amount must be greater than 0");
        require(price > 0, "Price must be greater than 0");
        require(bytes(source).length > 0, "Source must not be empty");
        require(bytes(location).length > 0, "Location must not be empty");
        
        // Increment listing counter
        listingCount++;
        
        // Create the listing
        listings[listingCount] = Listing({
            id: listingCount,
            seller: msg.sender,
            energyAmount: energyAmount,
            price: price,
            source: source,
            location: location,
            timestamp: block.timestamp,
            available: true
        });
        
        // Emit event
        emit ListingCreated(
            listingCount,
            msg.sender,
            energyAmount,
            price,
            source,
            location
        );
        
        return listingCount;
    }
    
    /**
     * @dev Allows a user to purchase an energy listing
     * @param id The id of the listing to purchase
     * @return success indicating if the purchase was successful
     */
    function purchaseListing(uint256 id) public nonReentrant returns (bool) {
        // Get the listing
        Listing storage listing = listings[id];
        
        // Validation
        require(id > 0 && id <= listingCount, "Listing does not exist");
        require(listing.available, "Listing is not available");
        require(listing.seller != msg.sender, "You cannot buy your own listing");
        
        // Update listing status first (reentrancy protection)
        listing.available = false;
        
        // Transfer tokens from buyer to seller
        bool transferSuccess = energyToken.transferFrom(
            msg.sender,
            listing.seller,
            listing.price
        );
        
        require(transferSuccess, "Token transfer failed");
        
        // Emit purchase event
        emit ListingPurchased(
            id,
            msg.sender,
            listing.seller,
            listing.energyAmount,
            listing.price
        );
        
        return true;
    }
    
    /**
     * @dev Returns the total number of listings
     * @return count of all listings
     */
    function getListingCount() public view returns (uint256) {
        return listingCount;
    }
    
    /**
     * @dev Cancels a listing, can only be done by the seller
     * @param id The id of the listing to cancel
     * @return success indicating if the cancellation was successful
     */
    function cancelListing(uint256 id) public returns (bool) {
        // Get the listing
        Listing storage listing = listings[id];
        
        // Validation
        require(id > 0 && id <= listingCount, "Listing does not exist");
        require(listing.available, "Listing is not available");
        require(listing.seller == msg.sender, "Only seller can cancel listing");
        
        // Update listing status
        listing.available = false;
        
        return true;
    }
}
