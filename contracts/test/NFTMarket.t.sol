// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Test.sol";
import "../src/NFTMarket.sol";
import "../src/RCH.sol";
import "../src/Ruochen.sol";

contract NFTMarketTest is Test {
    NFTMarket public market;
    RCH public paymentToken;
    Ruochen public nft;

    address public admin = makeAddr("admin");
    address public seller = makeAddr("seller");
    address public buyer = makeAddr("buyer");

    function setUp() public {
        vm.startPrank(admin);
        // Deploy tokens
        paymentToken = new RCH(admin);
        nft = new Ruochen();
        // Deploy market
        market = new NFTMarket(address(paymentToken));

        // Setup initial state
        // Mint NFT to seller
        nft.mint(seller, "ipfs://test-metadata");

        // Distribute Payment tokens to buyer
        // Admin received all tokens in constructor
        paymentToken.transfer(buyer, 10000 * 10 ** 18);
        vm.stopPrank();

        // Approvals
        vm.prank(seller);
        nft.setApprovalForAll(address(market), true);

        vm.prank(buyer);
        paymentToken.approve(address(market), type(uint256).max);
    }

    function test_ListNFT() public {
        vm.prank(seller);
        uint256 listingId = market.list(address(nft), 1, 100 * 10 ** 18);

        (
            address _seller,
            address _nftContract,
            uint256 _tokenId,
            uint256 _price,
            bool _active
        ) = market.listings(listingId);

        assertEq(_seller, seller);
        assertEq(_nftContract, address(nft));
        assertEq(_tokenId, 1);
        assertEq(_price, 100 * 10 ** 18);
        assertTrue(_active);
    }

    function test_BuyNFT() public {
        // Setup listing
        vm.prank(seller);
        uint256 listingId = market.list(address(nft), 1, 100 * 10 ** 18);

        uint256 sellerBalanceBefore = paymentToken.balanceOf(seller);
        uint256 buyerBalanceBefore = paymentToken.balanceOf(buyer);

        // Perform buy
        vm.prank(buyer);
        market.buyNFT(listingId);

        // Verify NFT ownership
        assertEq(nft.ownerOf(1), buyer);

        // Verify Token balances
        assertEq(
            paymentToken.balanceOf(seller),
            sellerBalanceBefore + 100 * 10 ** 18
        );
        assertEq(
            paymentToken.balanceOf(buyer),
            buyerBalanceBefore - 100 * 10 ** 18
        );

        // Verify listing status
        (, , , , bool active) = market.listings(listingId);
        assertFalse(active);
    }

    function test_CancelListing() public {
        vm.prank(seller);
        uint256 listingId = market.list(address(nft), 1, 100 * 10 ** 18);

        vm.prank(seller);
        market.cancelListing(listingId);

        (, , , , bool active) = market.listings(listingId);
        assertFalse(active);
    }

    function test_BuySelfNFTRevert() public {
        vm.prank(seller);
        market.list(address(nft), 1, 100 * 10 ** 18);

        vm.prank(seller);
        vm.expectRevert("Seller cannot buy their own NFT");
        market.buyNFT(0);
    }

    function test_BuyInactiveListingRevert() public {
        vm.prank(seller);
        market.list(address(nft), 1, 100 * 10 ** 18);

        vm.prank(seller);
        market.cancelListing(0);

        vm.prank(buyer);
        vm.expectRevert("Listing is not active");
        market.buyNFT(0);
    }

    function test_BuyNFTWithCallback() public {
        // Setup listing
        vm.prank(seller);
        uint256 listingId = market.list(address(nft), 1, 100 * 10 ** 18);

        uint256 sellerBalanceBefore = paymentToken.balanceOf(seller);
        uint256 buyerBalanceBefore = paymentToken.balanceOf(buyer);

        // Ensure no approval is needed (reset to 0 incase setUp did something,
        // though transferWithCallback doesn't use allowance)
        vm.prank(buyer);
        paymentToken.approve(address(market), 0);

        // Prepare data payload with listingId
        bytes memory data = abi.encode(listingId);

        // Perform buy via transferWithCallback
        vm.prank(buyer);
        paymentToken.transferWithCallback(
            address(market),
            100 * 10 ** 18,
            data
        );

        // Verify NFT ownership
        assertEq(nft.ownerOf(1), buyer);

        // Verify Token balances
        assertEq(
            paymentToken.balanceOf(seller),
            sellerBalanceBefore + 100 * 10 ** 18
        );
        assertEq(
            paymentToken.balanceOf(buyer),
            buyerBalanceBefore - 100 * 10 ** 18
        );

        // Verify listing status
        (, , , , bool active) = market.listings(listingId);
        assertFalse(active);
    }
}
