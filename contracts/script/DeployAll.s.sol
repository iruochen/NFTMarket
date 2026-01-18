// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {console} from "forge-std/console.sol";
import {BaseScript} from "./BaseScript.s.sol";
import {RCH} from "../src/RCH.sol";
import {Ruochen} from "../src/Ruochen.sol";
import {NFTMarket} from "../src/NFTMarket.sol";

contract DeployAll is BaseScript {
    RCH public rch;
    Ruochen public ruochenNFT;
    NFTMarket public nftMarket;

    function run() external broadcaster {
        // rch = new RCH(deployerAddr);
        // Use deployed RCH address
        rch = RCH(0xb42c5a0B067e0622fBfE606B63F0181776025817);
        console.log("RCH deployed at:", address(rch));
        saveContract("RCH", address(rch));

        // ruochenNFT = new RuochenNFT();
        // Use deployed RuochenNFT address
        ruochenNFT = Ruochen(0x08D1dB0B355CcE9125c27Da75B40304dB9ad8264);
        console.log("RuochenNFT deployed at:", address(ruochenNFT));
        saveContract("RuochenNFT", address(ruochenNFT));

        nftMarket = new NFTMarket(address(rch));
        console.log("NFTMarket deployed at:", address(nftMarket));
        saveContract("NFTMarket", address(nftMarket));

        console.log("=== Deployment Summary ===");
        console.log("Deployer:", deployerAddr);
        console.log("RCH:", address(rch));
        console.log("RuochenNFT:", address(ruochenNFT));
    }
}
