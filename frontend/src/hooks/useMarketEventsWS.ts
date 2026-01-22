"use client"

import { useEffect, useState, useCallback } from "react"
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

const EVENTS_ABI = {
	NFTListed: parseAbiItem(
		"event NFTListed(uint256 indexed listingId, address indexed seller, address indexed nftContract, uint256 tokenId, uint256 price)",
	),
	NFTPurchased: parseAbiItem(
		"event NFTPurchased(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price)",
	),
	ListingCancelled: parseAbiItem(
		"event ListingCancelled(uint256 indexed listingId)",
	),
}

export function useMarketEventsWS(marketAddress: string) {
	const [events, setEvents] = useState<MarketEvent[]>([])
	const [isLoading, setLoading] = useState(false)
	const publicClient = usePublicClient()

	const fetchHistoricalEvents = useCallback(async () => {
		if (!marketAddress || !publicClient) return

		try {
			setLoading(true)
			const currentBlock = await publicClient.getBlockNumber()
			const fromBlock = currentBlock - 10000n

			const [listedLogs, purchasedLogs, cancelledLogs] = await Promise.all([
				publicClient.getLogs({
					address: marketAddress as `0x${string}`,
					event: EVENTS_ABI.NFTListed,
					fromBlock,
					toBlock: "latest",
				}),
				publicClient.getLogs({
					address: marketAddress as `0x${string}`,
					event: EVENTS_ABI.NFTPurchased,
					fromBlock,
					toBlock: "latest",
				}),
				publicClient.getLogs({
					address: marketAddress as `0x${string}`,
					event: EVENTS_ABI.ListingCancelled,
					fromBlock,
					toBlock: "latest",
				}),
			])

			const historicalEvents: MarketEvent[] = []

			listedLogs.forEach((log) => {
				historicalEvents.push({
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
				historicalEvents.push({
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
				historicalEvents.push({
					type: "ListingCancelled",
					listingId: log.args.listingId?.toString(),
					blockNumber: log.blockNumber,
					transactionHash: log.transactionHash,
				})
			})

			historicalEvents.sort(
				(a, b) => Number(b.blockNumber || 0) - Number(a.blockNumber || 0),
			)

			setEvents(historicalEvents)
		} catch (error) {
			console.error("Error fetching historical market events:", error)
		} finally {
			setLoading(false)
		}
	}, [marketAddress, publicClient])

	useEffect(() => {
		fetchHistoricalEvents()
	}, [fetchHistoricalEvents])

	useEffect(() => {
		if (!marketAddress || !publicClient) return

		const unwatchListed = publicClient.watchEvent({
			address: marketAddress as `0x${string}`,
			event: EVENTS_ABI.NFTListed,
			onLogs: (logs) => {
				logs.forEach((log) => {
					const newEvent: MarketEvent = {
						type: "NFTListed",
						listingId: log.args.listingId?.toString(),
						seller: log.args.seller,
						nftContract: log.args.nftContract,
						tokenId: log.args.tokenId?.toString(),
						price: log.args.price?.toString(),
						blockNumber: log.blockNumber,
						transactionHash: log.transactionHash,
					}
					setEvents((prev) => [newEvent, ...prev])
					console.log("[NFT Market WS] New Listing:", newEvent)
				})
			},
		})

		const unwatchPurchased = publicClient.watchEvent({
			address: marketAddress as `0x${string}`,
			event: EVENTS_ABI.NFTPurchased,
			onLogs: (logs) => {
				logs.forEach((log) => {
					const newEvent: MarketEvent = {
						type: "NFTPurchased",
						listingId: log.args.listingId?.toString(),
						buyer: log.args.buyer,
						seller: log.args.seller,
						price: log.args.price?.toString(),
						blockNumber: log.blockNumber,
						transactionHash: log.transactionHash,
					}
					setEvents((prev) => [newEvent, ...prev])
					console.log("[NFT Market WS] New Purchase:", newEvent)
				})
			},
		})

		const unwatchCancelled = publicClient.watchEvent({
			address: marketAddress as `0x${string}`,
			event: EVENTS_ABI.ListingCancelled,
			onLogs: (logs) => {
				logs.forEach((log) => {
					const newEvent: MarketEvent = {
						type: "ListingCancelled",
						listingId: log.args.listingId?.toString(),
						blockNumber: log.blockNumber,
						transactionHash: log.transactionHash,
					}
					setEvents((prev) => [newEvent, ...prev])
					console.log("[NFT Market WS] Listing Cancelled:", newEvent)
				})
			},
		})

		return () => {
			unwatchListed()
			unwatchPurchased()
			unwatchCancelled()
		}
	}, [marketAddress, publicClient])

	return { events, isLoading, refresh: fetchHistoricalEvents }
}
