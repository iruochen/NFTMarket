// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Ruochen NFT Contract
 * @dev ERC721 contract for minting Ruochen NFTs with metadata URI support
 */
contract Ruochen is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    constructor() ERC721("Ruochen", "RC") Ownable(msg.sender) {}

    /**
     * @dev Mint a new NFT to the specified address with the given tokenURI.
     * @param to The address to mint the NFT to.
     * @param tokenURI The metadata URI for the NFT.
     * @return tokenId The ID of the newly minted NFT.
     */
    function mint(
        address to,
        string memory tokenURI
    ) external onlyOwner returns (uint256) {
        require(to != address(0), "Ruochen: invalid recipient");
        require(bytes(tokenURI).length > 0, "Ruochen: tokenURI required");

        _tokenIds++;
        uint256 tokenId = _tokenIds;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }
}
