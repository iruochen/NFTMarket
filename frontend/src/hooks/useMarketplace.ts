import {
	useReadContract,
	useReadContracts,
	useWriteContract,
	useWaitForTransactionReceipt,
	useConnection,
} from "wagmi"
import {
	NFT_MARKET_ADDRESS,
	NFT_MARKET_ABI,
	RCH_TOKEN_ADDRESS,
	RCH_ABI,
	NFT_ADDRESS,
	NFT_ABI,
} from "../constants"
import { useAccount } from "wagmi"

export interface Listing {
	listingId: bigint
	seller: string
	nftContract: string
	tokenId: bigint
	price: bigint
	active: boolean
}

/**
 * Hook to read marketplace listings.
 * Actions (write) have been moved to useMarketActions.ts
 */
export function useMarketplace() {
	// 1. Get Listing Counter
	const { data: listingCounter, refetch: refetchCounter } = useReadContract({
		address: NFT_MARKET_ADDRESS,
		abi: NFT_MARKET_ABI,
		functionName: "listingCounter",
	})

	// 2. Prepare calls for all listings
	const counter = listingCounter ? Number(listingCounter) : 0
	// Create array of indices [0, 1, ... counter-1]
	const listingIndices = Array.from({ length: counter }, (_, i) => BigInt(i))

	const listingCalls = listingIndices.map((index) => ({
		address: NFT_MARKET_ADDRESS,
		abi: NFT_MARKET_ABI,
		functionName: "listings",
		args: [index],
	}))

	// 3. Fetch all listings
	const {
		data: listingsData,
		isLoading: isLoadingListings,
		refetch: refetchListingsData,
	} = useReadContracts({
		contracts: listingCalls,
	})

	const refetchListings = () => {
		refetchCounter()
		refetchListingsData()
	}

	// 4. Process listings
	const listings: Listing[] = listingsData
		? listingsData.flatMap((result, index) => {
				if (result.status === "success" && result.result) {
					const [seller, nftContract, tokenId, price, active] =
						result.result as [string, string, bigint, bigint, boolean]
					if (active) {
						return {
							listingId: listingIndices[index],
							seller,
							nftContract,
							tokenId,
							price,
							active,
						}
					}
				}
				return []
			})
		: []

	return {
		listings,
		isLoadingListings,
		refetchListings,
	}
}

// Helper hook for ERC20 Allowance and Approve (Used in Navbar)
export function useRCHToken() {
	const { address } = useConnection()
	// approve for marketplace
	const { mutate: writeContract, data: hash, isPending } = useWriteContract()
	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({ hash })

	const { data: allowance, refetch: refetchAllowance } = useReadContract({
		address: RCH_TOKEN_ADDRESS,
		abi: RCH_ABI,
		functionName: "allowance",
		args: address ? [address, NFT_MARKET_ADDRESS] : undefined,
	})

	// get balance
	const { data: balance, refetch: refetchBalance } = useReadContract({
		address: RCH_TOKEN_ADDRESS,
		abi: RCH_ABI,
		functionName: "balanceOf",
		args: address ? [address] : undefined,
	})

	return {
		allowance: (allowance as bigint) ?? 0n,
		balance: (balance as bigint) ?? 0n,
		isPending,
		isConfirming,
		isConfirmed,
		refetchAllowance,
		refetchBalance,
	}
}

// Helper hook for NFT Approval (Used in ListNFTModal)
export function useRuochenNFT() {
	const { address } = useConnection()
	const {
		mutateAsync: writeContractAsync,
		data: hash,
		isPending,
		reset,
	} = useWriteContract()
	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({ hash })

	// Check if approved for all
	const { data: isApprovedForAll, refetch: refetchApproval } = useReadContract({
		address: NFT_ADDRESS,
		abi: NFT_ABI,
		functionName: "isApprovedForAll",
		args: address ? [address, NFT_MARKET_ADDRESS] : undefined,
	})

	const approveForAll = async () => {
		try {
			await writeContractAsync({
				address: NFT_ADDRESS,
				abi: NFT_ABI,
				functionName: "setApprovalForAll",
				args: [NFT_MARKET_ADDRESS, true],
			})
		} catch (err) {
			console.error("Approval failed:", err)
			reset()
			throw err
		}
	}

	return {
		isApprovedForAll,
		approveForAll,
		isPending,
		isConfirming,
		isConfirmed,
		refetchApproval,
		reset,
	}
}
