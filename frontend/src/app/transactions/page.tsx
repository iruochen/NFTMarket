"use client"

import { useChainId, useConnection } from "wagmi"
// import { useMarketEvents } from "@/hooks/useMarketEvents"
import { useMarketEventsWS as useMarketEvents } from "@/hooks/useMarketEventsWS"
import { getContractAddress } from "@/constants"
import { formatUnits } from "viem/utils"
import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function TransactionsPage() {
	const { isConnected, address } = useConnection()
	const chainId = useChainId()
	const marketAddress = getContractAddress(chainId, "nftMarket")
	const { events, isLoading } = useMarketEvents(marketAddress)
	const [activeTab, setActiveTab] = useState<
		"All" | "My Activity" | "Listed" | "Purchased" | "Cancelled"
	>("All")

	const filteredEvents = events.filter((event) => {
		if (activeTab === "My Activity") {
			return (
				event.seller?.toLowerCase() === address?.toLowerCase() ||
				event.buyer?.toLowerCase() === address?.toLowerCase()
			)
		}
		if (activeTab === "All") return true
		if (activeTab === "Listed") return event.type === "NFTListed"
		if (activeTab === "Purchased") return event.type === "NFTPurchased"
		if (activeTab === "Cancelled") return event.type === "ListingCancelled"
		return true
	})

	const formatAddress = (address?: string) => {
		if (!address) return "-"
		return `${address.slice(0, 6)}...${address.slice(-4)}`
	}

	const formatPrice = (price?: string) => {
		if (!price) return "-"
		return `${formatUnits(BigInt(price), 18)} RCH`
	}

	const getEventTypeLabel = (type: string) => {
		switch (type) {
			case "NFTListed":
				return (
					<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
						Listed
					</span>
				)
			case "NFTPurchased":
				return (
					<span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
						Purchased
					</span>
				)
			case "ListingCancelled":
				return (
					<span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
						Cancelled
					</span>
				)
			default:
				return type
		}
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<Link
						href="/"
						className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
					>
						<ChevronLeft className="w-4 h-4 mr-1" />
						Back to Marketplace
					</Link>
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Transaction History
					</h1>
					<p className="text-gray-600">
						View all NFT trading history on the marketplace
					</p>
				</div>
				{!isConnected ? (
					<div className="bg-white rounded-lg shadow p-8 text-center">
						<p className="text-gray-700 mb-4">Please connect your wallet</p>
						<p className="text-sm text-gray-500">
							Click the &quot;Connect Wallet&quot; button in the top right
							corner
						</p>
					</div>
				) : (
					<div className="bg-white rounded-lg shadow p-6">
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
							<h2 className="text-2xl font-bold text-gray-900">
								Market Events
							</h2>
							<div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto whitespace-nowrap">
								{(
									[
										"All",
										"My Activity",
										"Listed",
										"Purchased",
										"Cancelled",
									] as const
								).map((tab) => (
									<button
										key={tab}
										onClick={() => setActiveTab(tab)}
										className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
											activeTab === tab
												? "bg-white text-blue-600 shadow-sm"
												: "text-gray-500 hover:text-gray-700"
										}`}
									>
										{tab}
									</button>
								))}
							</div>
							{isLoading && (
								<span className="text-sm text-gray-500">Loading...</span>
							)}
						</div>
						<div className="overflow-x-auto">
							<table className="w-full text-left">
								<thead>
									<tr className="border-b border-gray-200">
										<th className="px-4 py-3 text-gray-700 font-medium">
											Type
										</th>
										<th className="px-4 py-3 text-gray-700 font-medium">
											Listing ID
										</th>
										<th className="px-4 py-3 text-gray-700 font-medium">NFT</th>
										<th className="px-4 py-3 text-gray-700 font-medium">
											Price
										</th>
										<th className="px-4 py-3 text-gray-700 font-medium">
											Seller
										</th>
										<th className="px-4 py-3 text-gray-700 font-medium">
											Buyer
										</th>
										<th className="px-4 py-3 text-gray-700 font-medium">
											Transaction
										</th>
									</tr>
								</thead>
								<tbody>
									{isLoading && filteredEvents.length === 0 ? (
										<tr>
											<td
												colSpan={7}
												className="px-4 py-12 text-center text-gray-500"
											>
												<div className="flex flex-col items-center justify-center gap-2">
													<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
													<span>Fetching transaction history...</span>
												</div>
											</td>
										</tr>
									) : filteredEvents.length === 0 ? (
										<tr>
											<td
												colSpan={7}
												className="px-4 py-12 text-center text-gray-500"
											>
												No transactions found for this category
											</td>
										</tr>
									) : (
										filteredEvents.map((event, index) => (
											<tr
												key={index}
												className="border-b border-gray-100 hover:bg-gray-50"
											>
												<td className="px-4 py-3">
													{getEventTypeLabel(event.type)}
												</td>
												<td className="px-4 py-3 text-gray-900">
													#{event.listingId || "-"}
												</td>
												<td className="px-4 py-3 text-gray-900">
													{event.tokenId ? `#${event.tokenId}` : "-"}
												</td>
												<td className="px-4 py-3 text-gray-900">
													{formatPrice(event.price)}
												</td>
												<td className="px-4 py-3 text-gray-600 font-mono text-sm">
													{formatAddress(event.seller)}
												</td>
												<td className="px-4 py-3 text-gray-600 font-mono text-sm">
													{formatAddress(event.buyer)}
												</td>
												<td className="px-4 py-3">
													{event.transactionHash && (
														<a
															href={`https://sepolia.etherscan.io/tx/${event.transactionHash}`}
															className="text-blue-600 hover:text-blue-800 font-mono text-sm"
															target="_blank"
															rel="noopener noreferrer"
														>
															{formatAddress(event.transactionHash)}
														</a>
													)}
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
