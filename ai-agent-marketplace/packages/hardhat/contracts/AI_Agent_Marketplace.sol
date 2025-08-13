// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title AI_Agent_Marketplace
/// @notice Simple escrow marketplace for AI_Agent_NFT (ERC721) listings.
/// @dev Uses atomic escrow within the buy function (funds held by the contract during transfer).
contract AI_Agent_Marketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 tokenId;
        uint256 price; // in wei
        bool active;
    }

    /// @notice The ERC721 collection being traded (expected to be AI_Agent_NFT)
    IERC721 public immutable nft;

    /// @notice Autoincremental listing id
    uint256 public nextListingId = 1;

    /// @notice listingId => Listing
    mapping(uint256 => Listing) private _listings;

    /// Events
    event Listed(uint256 indexed listingId, address indexed seller, uint256 indexed tokenId, uint256 price);
    event ListingCanceled(uint256 indexed listingId, address indexed seller);
    event Purchased(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price);

    constructor(address _nft) {
        require(_nft != address(0), "nft=0");
        nft = IERC721(_nft);
    }

    /// @notice Create a listing for `tokenId` at `price` (in wei)
    /// @dev Seller must own the token and approve this marketplace for transfer
    function listAgent(uint256 tokenId, uint256 price) external returns (uint256 listingId) {
        require(price > 0, "price=0");
        address owner = nft.ownerOf(tokenId);
        require(owner == msg.sender, "not owner");

        // Require approval for transfer by marketplace
        require(
            nft.getApproved(tokenId) == address(this) || nft.isApprovedForAll(owner, address(this)),
            "not approved"
        );

        listingId = nextListingId++;
        _listings[listingId] = Listing({seller: owner, tokenId: tokenId, price: price, active: true});

        emit Listed(listingId, owner, tokenId, price);
    }

    /// @notice Cancel an active listing. Only the seller can cancel.
    function cancelListing(uint256 listingId) external {
        Listing storage l = _listings[listingId];
        require(l.active, "not active");
        require(l.seller == msg.sender, "not seller");
        l.active = false;
        emit ListingCanceled(listingId, msg.sender);
    }

    /// @notice Buy an active listing; funds are escrowed until NFT transfer succeeds.
    /// @dev Non-reentrant; marks listing inactive before external calls; atomic on success.
    function buyListing(uint256 listingId) external payable nonReentrant {
        Listing storage l = _listings[listingId];
        require(l.active, "not active");
        require(msg.value == l.price, "bad price");

        // Effects
        l.active = false;

        address seller = l.seller;
        uint256 tokenId = l.tokenId;
        uint256 price = l.price;

        // Interactions: transfer the NFT first; will revert if seller no longer owns or approval revoked
        nft.safeTransferFrom(seller, msg.sender, tokenId);

        // Transfer escrowed funds to the seller
        (bool ok, ) = payable(seller).call{value: price}("");
        require(ok, "pay seller failed");

        emit Purchased(listingId, msg.sender, seller, price);
    }

    /// @notice Get details for a listing
    function getListing(uint256 listingId) external view returns (Listing memory) {
        return _listings[listingId];
    }
}
