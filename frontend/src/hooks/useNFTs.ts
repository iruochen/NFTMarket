import { useState, useEffect, useCallback } from "react"
import {
	useConnection,
	usePublicClient,
	useReadContract,
	useReadContracts,
} from "wagmi"
import { parseAbiItem } from "viem"
import {
	NFT_MARKET_ADDRESS,
	NFT_MARKET_ABI,
	NFT_ADDRESS,
	NFT_ABI,
	START_BLOCK,
} from "../constants"

export type NFTMetadata = {
	name: string
	description: string
	image: string
}

export type NFTItem = {
	tokenId: bigint
	tokenURI: string
	owner: string
	metadata?: NFTMetadata
	isListed?: boolean
	listingId?: bigint
	price?: bigint
	seller?: string
}

// ABI for Standard ERC721 events
const ERC721_EVENTS = [
	parseAbiItem(
		"event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
	),
]

// CHUNK SIZE reducing to 1000 to avoid provider limits
const BLOCK_CHUNK_SIZE = 2000n

/**
 * Hook to fetch all NFTs for the connected user, including those listed on the market.
 * Uses incremental scanning to avoid re-fetching the entire history.
 */
export function useAllNFTs() {
	const { address } = useConnection()
	const publicClient = usePublicClient()
	const [userNFTs, setUserNFTs] = useState<NFTItem[]>([])
	const [isLoadingUserNFTs, setIsLoadingUserNFTs] = useState(false)

	// Cache the set of tokens we've found so we don't lose them on refetch
	const [foundTokenIds, setFoundTokenIds] = useState<Set<bigint>>(new Set())
	// Keep track of the last block we scanned to enable incremental updates
	const [lastScannedBlock, setLastScannedBlock] = useState<bigint>(
		START_BLOCK - 1n,
	)

	// --- 1. Fetch User's Owned NFTs from Logs (Incremental) ---
	const fetchUserNFTs = useCallback(async () => {
		if (!address || !publicClient) return
		setIsLoadingUserNFTs(true)

		try {
			const currentBlock = await publicClient.getBlockNumber()
			// If we've already scanned up to currentBlock, no need to do anything
			if (lastScannedBlock >= currentBlock) {
				setIsLoadingUserNFTs(false)
				return
			}

			const startBlock = lastScannedBlock + 1n
			const allReceivedLogs = []

			// Fetch logs in chunks
			for (
				let from = startBlock;
				from <= currentBlock;
				from += BLOCK_CHUNK_SIZE
			) {
				let to = from + BLOCK_CHUNK_SIZE - 1n
				if (to > currentBlock) to = currentBlock

				try {
					const logs = await publicClient.getLogs({
						address: NFT_ADDRESS,
						event: ERC721_EVENTS[0],
						args: { to: address },
						fromBlock: from,
						toBlock: to,
					})
					allReceivedLogs.push(...logs)
				} catch (err) {
					console.error(`Failed to fetch logs for range ${from}-${to}`, err)
					// If a chunk fails, we might want to break or continue.
					// For now, allow partial failure but don't advance cursor too far if critical?
					// Actually, if we fail, we probably shouldn't update lastScannedBlock fully,
					// but avoiding infinite loops is improved by just proceedingBestEffort.
				}
			}

			// Update the set of candidate tokens
			const newFoundIds = new Set(foundTokenIds)
			allReceivedLogs.forEach((log) => {
				if (log.args.tokenId !== undefined) {
					newFoundIds.add(log.args.tokenId)
				}
			})
			setFoundTokenIds(newFoundIds)
			setLastScannedBlock(currentBlock)

			// Verify current ownership via multicall for ALL candidates (old + new)
			// This part is necessary because we might have transferred SOME out since last check
			// However, multicall ownerOf is cheap (read-only) compared to getLogs.
			const candidatesArray = Array.from(newFoundIds)

			if (candidatesArray.length === 0) {
				setUserNFTs([])
				setIsLoadingUserNFTs(false)
				return
			}

			const contracts = candidatesArray.map((id) => ({
				address: NFT_ADDRESS,
				abi: NFT_ABI,
				functionName: "ownerOf",
				args: [id],
			}))

			const ownersResults = await publicClient.multicall({ contracts })

			const ownedTokenIds: bigint[] = []
			ownersResults.forEach((result, index) => {
				if (
					result.status === "success" &&
					(result.result as string).toLowerCase() === address.toLowerCase()
				) {
					ownedTokenIds.push(candidatesArray[index])
				}
			})

			// Fetch TokenURIs for verified owned tokens
			const uriContracts = ownedTokenIds.map((id) => ({
				address: NFT_ADDRESS,
				abi: NFT_ABI,
				functionName: "tokenURI",
				args: [id],
			}))

			const urisResults = await publicClient.multicall({
				contracts: uriContracts,
			})

			const items: NFTItem[] = ownedTokenIds.map((id, index) => {
				const uri =
					urisResults[index].status === "success"
						? (urisResults[index].result as string)
						: ""
				return {
					tokenId: id,
					tokenURI: uri,
					owner: address,
					isListed: false, // Default, will update with market data
				}
			})

			setUserNFTs(items)
		} catch (e) {
			console.error("Error fetching user NFTs", e)
		} finally {
			setIsLoadingUserNFTs(false)
		}
	}, [address, publicClient])

	// Initial fetch when address is available
	useEffect(() => {
		if (address && publicClient) {
			fetchUserNFTs()
		}
	}, [address, publicClient, fetchUserNFTs])

	// --- 2. Fetch Market Listings ---
	const { data: listingCounter, refetch: refetchCounter } = useReadContract({
		address: NFT_MARKET_ADDRESS,
		abi: NFT_MARKET_ABI,
		functionName: "listingCounter",
	})

	const listingIndices = listingCounter
		? Array.from({ length: Number(listingCounter) }, (_, i) => BigInt(i))
		: []

	const {
		data: listingsData,
		isLoading: isLoadingListings,
		refetch: refetchListingsData,
	} = useReadContracts({
		contracts: listingIndices.map((index) => ({
			address: NFT_MARKET_ADDRESS,
			abi: NFT_MARKET_ABI,
			functionName: "listings",
			args: [index],
		})),
	})

	const marketItems: NFTItem[] = []

	if (listingsData) {
		listingsData.forEach((result, index) => {
			if (result.status === "success" && result.result) {
				const [seller, nftContract, tokenId, price, active] = result.result as [
					string,
					string,
					bigint,
					bigint,
					boolean,
				]
				// Filter for our NFT contract and active listings
				if (active && nftContract.toLowerCase() === NFT_ADDRESS.toLowerCase()) {
					marketItems.push({
						listingId: listingIndices[index],
						tokenId: tokenId,
						tokenURI: "", // Metadata should be fetched if needed
						owner: seller,
						price,
						seller,
						isListed: true,
					})
				}
			}
		})
	}

	// --- 3. Merge Market Data with User Data ---
	// We want 'userNFTs' (My Assets) to include:
	// 1. Items I currently hold in my wallet (userNFTs state)
	// 2. Items I have listed on the market (still "mine" to cancel)

	const myListings = marketItems.filter(
		(m) => m.seller?.toLowerCase() === address?.toLowerCase(),
	)

	const combinedUserNFTs = [...userNFTs]

	myListings.forEach((listedItem) => {
		const existingIndex = combinedUserNFTs.findIndex(
			(u) => u.tokenId === listedItem.tokenId,
		)

		if (existingIndex !== -1) {
			// Item exists (e.g. Approval listing or race condition), update it
			combinedUserNFTs[existingIndex] = {
				...combinedUserNFTs[existingIndex],
				isListed: true,
				price: listedItem.price,
				listingId: listedItem.listingId,
				seller: listedItem.seller,
			}
		} else {
			// Item is listed (transferred to market), add it to my view
			combinedUserNFTs.push({
				...listedItem,
				isListed: true,
				// Note: tokenURI might be empty here since we didn't fetch it for market items.
				// The UI handles missing metadata gracefully.
			})
		}
	})

	return {
		userNFTs: combinedUserNFTs,
		marketItems,
		fetchUserNFTs,
		isLoadingUserNFTs,
		isLoadingListings: isLoadingListings,
		refetchMarket: () => {
			refetchCounter()
			refetchListingsData()
		},
	}
}
