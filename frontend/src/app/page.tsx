"use client"

import { useAccount, useConnection } from "wagmi"
import { useAppKit } from "@reown/appkit/react"
import { useState, useEffect, useCallback } from "react"
import Navbar from "@/components/Navbar"
import NFTCard from "@/components/NFTCard"
import ListNFTModal from "@/components/ListNFTModal"
import { useMarketplace, useRCHToken } from "@/hooks/useMarketplace"
import { useAllNFTs as useNFTs, NFTItem } from "@/hooks/useNFTs"
import { useMarketActions } from "@/hooks/useMarketActions"
import { cn } from "@/lib/utils"
import { LayoutGrid, User, RefreshCw, Loader2 } from "lucide-react"

export default function Home() {
	const { open } = useAppKit()
	const { address } = useConnection()
	const [activeTab, setActiveTab] = useState<"market" | "profile">("market")

	// Market Data
	const { listings, isLoadingListings, refetchListings } = useMarketplace()

	// RCH Token (for balance refetch)
	const { refetchBalance: refetchRCHBalance } = useRCHToken()

	// User Data (Owned NFTs)
	const {
		userNFTs: myItems,
		isLoadingUserNFTs: isLoadingMyItems,
		fetchUserNFTs: refreshMyItems,
		refetchMarket: refreshUserMarketData,
	} = useNFTs()

	// Actions
	const {
		buyNFT,
		cancelListing,
		isConfirmed: isActionConfirmed,
		isPending: isActionPending,
		isConfirming: isActionConfirming,
		reset: resetAction,
	} = useMarketActions()

	const isActionProcessing = isActionPending || isActionConfirming
	const [processingId, setProcessingId] = useState<string | null>(null)

	// Modal State
	const [isListModalOpen, setIsListModalOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState<NFTItem | null>(null)

	// Manual Refresh Handler
	const handleRefresh = useCallback(() => {
		refetchListings()
		refreshMyItems()
		refreshUserMarketData()
		refetchRCHBalance()
	}, [
		refetchListings,
		refreshMyItems,
		refreshUserMarketData,
		refetchRCHBalance,
	])

	// Auto-Refresh when actions complete
	useEffect(() => {
		if (isActionConfirmed) {
			handleRefresh()
			setProcessingId(null)
			resetAction()
		}
	}, [isActionConfirmed, handleRefresh, resetAction])

	// Note: High-frequency polling (useWatchContractEvent) is removed because public RPCs
	// do not support the required rate limits or CORS headers for browser-based event watching.
	// We rely on "Refetch on Confirmation" (above) and the Manual Refresh button for stability.

	// Derived state: Market items mapped to NFTItem structure
	const marketItems: NFTItem[] = listings.map((l) => ({
		tokenId: l.tokenId,
		// TODO tokenURI 没有保存，页面如何展示？
		tokenURI: "", // Optimization: We rely on card placeholder/visuals for market items
		owner: l.seller,
		seller: l.seller,
		price: l.price,
		isListed: true,
		listingId: l.listingId,
		metadata: undefined,
	}))

	// Handle Card Actions
	const handleAction = async (
		item: NFTItem,
		action: "buy" | "cancel" | "list",
	) => {
		if (!address && action === "buy") {
			// Prompt user to login
			open()
			return
		}

		// Set local processing state immediately to block clicks
		const itemId =
			action === "list" ? item.tokenId.toString() : item.listingId?.toString()
		if (itemId) setProcessingId(itemId)

		try {
			if (action === "buy") {
				if (item.listingId === undefined || !item.price) {
					console.error("Invalid listing for buy", item)
					setProcessingId(null)
					return
				}
				await buyNFT(item.listingId, item.price)
			} else if (action === "cancel") {
				if (item.listingId === undefined) {
					console.error("Invalid listing for cancel", item)
					setProcessingId(null)
					return
				}
				await cancelListing(item.listingId)
			} else if (action === "list") {
				setProcessingId(null) // Modal handles its own loading state
				setSelectedItem(item)
				setIsListModalOpen(true)
			}
		} catch (error) {
			console.error("Action failed:", error)
			setProcessingId(null)
		}
	}

	// derived Loading state
	const isGlobalLoading =
		isLoadingListings || (activeTab === "profile" && isLoadingMyItems)

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Navbar />

			<main className="grow container mx-auto px-4 py-8 max-w-7xl">
				{/* Header & Controls */}
				<div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
					<div className="flex items-center gap-4">
						<h1 className="text-3xl font-bold text-gray-900 tracking-tight">
							{activeTab === "market" ? "Marketplace" : "My Collection"}
						</h1>
						{isGlobalLoading && (
							<Loader2 className="animate-spin text-indigo-500" size={24} />
						)}
					</div>

					<div className="flex items-center gap-3 w-full md:w-auto">
						{/* Tabs */}
						<div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 flex-1 md:flex-none">
							<button
								onClick={() => setActiveTab("market")}
								className={cn(
									"flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200",
									activeTab === "market"
										? "bg-gray-900 text-white shadow-md"
										: "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
								)}
							>
								<LayoutGrid size={18} />
								Explore
							</button>
							<button
								onClick={() => setActiveTab("profile")}
								className={cn(
									"flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200",
									activeTab === "profile"
										? "bg-gray-900 text-white shadow-md"
										: "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
								)}
							>
								<User size={18} />
								My Assets
							</button>
						</div>

						{/* Refresh Button */}
						<button
							onClick={handleRefresh}
							className="p-3 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all active:scale-95"
							title="Refresh Data"
						>
							<RefreshCw
								size={20}
								className={cn(isGlobalLoading && "animate-spin")}
							/>
						</button>
					</div>
				</div>

				{/* Content Area */}
				<div className="min-h-100">
					{activeTab === "market" ? (
						// Market Tab
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
							{marketItems.length > 0
								? marketItems.map((item) => (
										<NFTCard
											key={`market-${item.listingId}`}
											item={item}
											variant="market"
											onAction={handleAction}
											disabled={isActionProcessing}
											isLoading={
												isActionProcessing &&
												processingId === item.listingId?.toString()
											}
										/>
									))
								: !isLoadingListings && (
										<div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
											<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
												<LayoutGrid size={32} />
											</div>
											<h3 className="text-xl font-semibold text-gray-900 mb-2">
												No Active Listings
											</h3>
											<p className="text-gray-500 max-w-md">
												The marketplace is currently empty. Be the first to list
												an NFT!
											</p>
										</div>
									)}
						</div>
					) : (
						// Profile Tab
						<div>
							{!address ? (
								<div className="flex flex-col items-center justify-center py-20 text-center">
									<div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-400">
										<User size={32} />
									</div>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										Connect Wallet
									</h3>
									<p className="text-gray-500">
										Please connect your wallet to view your assets.
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
									{myItems.length > 0
										? myItems.map((item) => (
												<NFTCard
													key={`profile-${item.tokenId}`}
													item={item}
													variant="profile"
													onAction={handleAction}
													disabled={isActionProcessing}
													isLoading={
														isActionProcessing &&
														processingId === item.listingId?.toString()
													}
												/>
											))
										: !isLoadingMyItems && (
												<div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
													<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
														<User size={32} />
													</div>
													<h3 className="text-lg font-semibold text-gray-900">
														No Assets Found
													</h3>
													<p className="text-gray-500 mt-2">
														You don&apos;t own any NFTs in this collection yet.
													</p>
												</div>
											)}
								</div>
							)}
						</div>
					)}
				</div>
			</main>

			<ListNFTModal
				isOpen={isListModalOpen}
				onClose={() => setIsListModalOpen(false)}
				onSuccess={handleRefresh}
				item={selectedItem}
			/>
		</div>
	)
}
