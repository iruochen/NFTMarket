// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NFT Marketplace Contract
 * @dev A simple NFT marketplace allowing users to list, buy, and cancel listings of NFTs
 */
contract NFTMarket is ReentrancyGuard {
    struct Listing {
        address seller;
        address ntfContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    // The ERC20 token used for payments
    IERC20 public paymentToken;

    // mapping of listing ID to Listing details
    mapping(uint256 => Listing) public listings;
    uint256 public listingCounter;

    // Events
    event NFTListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );

    event NFTPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );

    event ListingCancelled(uint256 indexed listingId);

    constructor(address _paymentToken) {
        require(_paymentToken != address(0), "Invalid payment token address");
        paymentToken = IERC20(_paymentToken);
    }

    /**
     * @dev List an NFT for sale on the marketplace.
     * @param nftContract The address of the NFT contract.
     * @param tokenId The ID of the NFT to list.
     * @param price The sale price of the NFT in payment tokens.
     * @return listingId The ID of the created listing.
     */
    function list(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant returns (uint256) {
        require(price > 0, "Price must be greater than 0");
        require(nftContract != address(0), "Invalid NFT contract");

        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner of the NFT");
        require(
            nft.isApprovedForAll(msg.sender, address(this)) ||
                nft.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );
        uint256 listingId = listingCounter++;
        listings[listingId] = Listing({
            seller: msg.sender,
            ntfContract: nftContract,
            tokenId: tokenId,
            price: price,
            active: true
        });

        emit NFTListed(listingId, msg.sender, nftContract, tokenId, price);
        return listingId;
    }

    /**
     * @dev Buy a listed NFT from the marketplace.
     * @param listingId The ID of the listing to buy.
     */
    function buyNFT(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing is not active");
        require(
            msg.sender != listing.seller,
            "Seller cannot buy their own NFT"
        );

        // Mark listing as inactive
        listing.active = false;

        // Transfer payment from buyer to seller
        require(
            paymentToken.transferFrom(
                msg.sender,
                listing.seller,
                listing.price
            ),
            "Payment transfer failed"
        );

        // Transfer NFT from seller to buyer
        IERC721 nft = IERC721(listing.ntfContract);
        nft.safeTransferFrom(listing.seller, msg.sender, listing.tokenId);

        emit NFTPurchased(listingId, msg.sender, listing.seller, listing.price);
    }

    /**
     * @dev Handle receipt of ERC20 tokens for purchasing NFTs.
     * @param from The address sending the tokens.
     * @param amount The amount of tokens sent.
     * @param data The data containing the listing ID.
     * @return selector indicating success of the token receipt.
     */
    function tokenReceived(
        address from,
        uint256 amount,
        bytes calldata data
    ) external nonReentrant returns (bytes4) {
        require(
            msg.sender == address(paymentToken),
            "Unauthorized token receiver"
        );
        require(data.length == 32, "Invalid data length");

        uint256 listingId = abi.decode(data, (uint256));
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing is not active");
        require(from != listing.seller, "Seller cannot buy their own NFT");
        require(amount == listing.price, "Incorrect payment amount");

        // Mark listing as inactive
        listing.active = false;

        require(
            paymentToken.transfer(listing.seller, amount),
            "Payment transfer failed"
        );

        // Transfer NFT from seller to buyer
        IERC721 nft = IERC721(listing.ntfContract);
        nft.safeTransferFrom(listing.seller, from, listing.tokenId);

        emit NFTPurchased(listingId, from, listing.seller, amount);

        return this.tokenReceived.selector;
    }

    /**
     * @dev Cancel an active listing.
     * @param listingId The ID of the listing to cancel.
     */
    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing is not active");
        require(listing.seller == msg.sender, "Only seller can cancel listing");

        listing.active = false;
        emit ListingCancelled(listingId);
    }

    /**
     * @dev Get details of a listing.
     * @param listingId The ID of the listing to retrieve.
     * @return Listing struct containing listing details.
     */
    function getListing(
        uint256 listingId
    ) external view returns (Listing memory) {
        return listings[listingId];
    }
}
