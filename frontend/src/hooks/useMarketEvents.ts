"use client"

import { useEffect, useState } from "react"
import { parseAbiItem } from "viem/utils"
import { usePublicClient } from "wagmi"

export interface MarketEvent {
	type: "NFTListed" | "NFTPurchased" | "ListingCancelled"
	listingId?: string
	seller?: string
	buyer?: string
	nftContract?: string
	tokenId?: string
	price?: string
	blockNumber?: bigint
	transactionHash?: string
	timestamp?: number
}

export function useMarketEvents(marketAddress: string) {
	const [events, setEvents] = useState<MarketEvent[]>([])
	const [isLoading, setLoading] = useState(false)
	const publicClient = usePublicClient()

	useEffect(() => {
		if (!marketAddress || !publicClient) return

		const fetchEvents = async () => {
			try {
				setLoading(true)

				const currentBlock = await publicClient.getBlockNumber()
				const fromBlock = currentBlock - 10000n

				const listedLogs = await publicClient.getLogs({
					address: marketAddress as `0x${string}`,
					event: parseAbiItem(
						"event NFTListed(uint256 indexed listingId, address indexed seller, address indexed nftContract, uint256 tokenId, uint256 price)",
					),
					fromBlock,
					toBlock: "latest",
				})

				// Fetch NFTPurchased events
				const purchasedLogs = await publicClient.getLogs({
					address: marketAddress as `0x${string}`,
					event: parseAbiItem(
						"event NFTPurchased(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price)",
					),
					fromBlock,
					toBlock: "latest",
				})

				// Fetch ListingCancelled events
				const cancelledLogs = await publicClient.getLogs({
					address: marketAddress as `0x${string}`,
					event: parseAbiItem(
						"event ListingCancelled(uint256 indexed listingId)",
					),
					fromBlock,
					toBlock: "latest",
				})

				const allEvents: MarketEvent[] = []

				listedLogs.forEach((log) => {
					allEvents.push({
						type: "NFTListed",
						listingId: log.args.listingId?.toString(),
						seller: log.args.seller,
						nftContract: log.args.nftContract,
						tokenId: log.args.tokenId?.toString(),
						price: log.args.price?.toString(),
						blockNumber: log.blockNumber,
						transactionHash: log.transactionHash,
					})
				})

				purchasedLogs.forEach((log) => {
					allEvents.push({
						type: "NFTPurchased",
						listingId: log.args.listingId?.toString(),
						buyer: log.args.buyer,
						seller: log.args.seller,
						price: log.args.price?.toString(),
						blockNumber: log.blockNumber,
						transactionHash: log.transactionHash,
					})
				})

				cancelledLogs.forEach((log) => {
					allEvents.push({
						type: "ListingCancelled",
						listingId: log.args.listingId?.toString(),
						blockNumber: log.blockNumber,
						transactionHash: log.transactionHash,
					})
				})

				allEvents.sort(
					(a, b) => Number(b.blockNumber || 0) - Number(a.blockNumber || 0),
				)

				setEvents(allEvents)

				allEvents.forEach((event) => {
					console.log(`[NFT Market Event] ${event.type}:`, event)
				})
			} catch (error) {
				console.error("Error fetching market events:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchEvents()

		const interval = setInterval(fetchEvents, 30000)
		return () => clearInterval(interval)
	}, [marketAddress, publicClient])

	return { events, isLoading }
}
