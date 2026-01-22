import { type Abi } from "viem"
import RCH_json from "./contracts/RCH.json"
import NFTMarket_json from "./contracts/NFTMarket.json"
import Ruochen_json from "./contracts/Ruochen.json"

// Addresses
export const NFT_MARKET_ADDRESS = process.env
	.NEXT_PUBLIC_NFT_MARKET_ADDRESS as `0x${string}`
export const RCH_TOKEN_ADDRESS = process.env
	.NEXT_PUBLIC_RCH_TOKEN_ADDRESS as `0x${string}`
export const NFT_ADDRESS = process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`

// ABIs
export const NFT_MARKET_ABI = NFTMarket_json as Abi
export const RCH_ABI = RCH_json as Abi
export const NFT_ABI = Ruochen_json as Abi
export const START_BLOCK = 10068209n

export const CONTRACT_ADDRESS = {
	sepolia: {
		nftMarket: process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as `0x${string}`,
		rchToken: process.env.NEXT_PUBLIC_RCH_TOKEN_ADDRESS as `0x${string}`,
		ruochenNFT: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
	},
} as const

export function getContractAddress(
	chainId: number,
	contractName: "nftMarket" | "rchToken" | "ruochenNFT",
): string {
	if (chainId === 11155111) {
		return CONTRACT_ADDRESS.sepolia[contractName]
	}
	throw new Error(`Unsupported chain ID: ${chainId}`)
}
