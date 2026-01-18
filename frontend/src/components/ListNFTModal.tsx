import { useState, useEffect, useCallback } from "react"
import { useMarketActions } from "../hooks/useMarketActions"
import { useRuochenNFT } from "../hooks/useMarketplace"
import { NFTItem } from "../hooks/useNFTs"
import Modal from "./Modal"

interface ListNFTModalProps {
	isOpen: boolean
	onClose: () => void
	onSuccess?: () => void // Callback when listing succeeds
	item: NFTItem | null
}

export default function ListNFTModal({
	isOpen,
	onClose,
	onSuccess,
	item,
}: ListNFTModalProps) {
	const [price, setPrice] = useState("")
	const [listingMode, setListingMode] = useState<"standard" | "callback">(
		"standard",
	)
	const {
		listNFT,
		isPending,
		isConfirming,
		isConfirmed: isListingConfirmed,
		reset: resetListAction,
	} = useMarketActions()
	const {
		isApprovedForAll,
		approveForAll,
		isPending: isApproving,
		isConfirming: isApprovingConfirming,
		isConfirmed: isApprovalConfirmed,
		refetchApproval,
	} = useRuochenNFT()

	const isListingProcessing = isPending || isConfirming
	const isApprovingProcessing = isApproving || isApprovingConfirming

	// Refetch approval status when approval is confirmed
	useEffect(() => {
		if (isApprovalConfirmed) {
			refetchApproval()
		}
	}, [isApprovalConfirmed, refetchApproval])

	// Handle modal close
	const handleClose = useCallback(() => {
		onClose()
		setPrice("")
		setListingMode("standard")
		resetListAction()
	}, [onClose, resetListAction])

	// Reset on listing success and trigger parent refresh
	useEffect(() => {
		if (isListingConfirmed && isOpen) {
			onSuccess?.()
			handleClose()
		}
	}, [isListingConfirmed, isOpen, handleClose, onSuccess])

	const handleList = async () => {
		if (!item || !price) return
		try {
			await listNFT(item.tokenId, price)
		} catch (err) {
			console.error("Listing failed:", err)
		}
	}

	const handleApprove = async () => {
		try {
			await approveForAll()
		} catch (err) {
			console.error("Approval failed:", err)
		}
	}

	if (!isOpen || !item) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={`List ${item.metadata?.name || `Token #${item.tokenId.toString()}`}`}
		>
			<div className="space-y-4">
				{/* Listing Mode Selection */}
				<div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-4">
					<button
						onClick={() => setListingMode("standard")}
						className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
							listingMode === "standard"
								? "bg-white shadow text-gray-900"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Standard List
					</button>
					<button
						onClick={() => setListingMode("callback")}
						className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
							listingMode === "callback"
								? "bg-white shadow text-gray-900"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Direct Transfer
					</button>
				</div>

				{/* Callback mode info */}
				{listingMode === "callback" && (
					<div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm border border-blue-200">
						<p className="font-semibold">Coming Soon</p>
						<p>
							Direct transfer listing requires the NFT contract to implement
							ERC721 callback. This feature is not yet available for the current
							NFT contract.
						</p>
					</div>
				)}

				{/* Approval Warning (only for standard mode) */}
				{listingMode === "standard" && !isApprovedForAll && (
					<div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm border border-amber-200">
						<p className="font-semibold">Approval Required</p>
						<p>You need to approve the marketplace to sell your NFTs.</p>
					</div>
				)}

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Price
					</label>
					<div className="relative flex items-center">
						<input
							type="number"
							value={price}
							disabled={listingMode === "callback"}
							onChange={(e) => setPrice(e.target.value)}
							placeholder="0"
							className="w-full px-4 py-2 pr-14 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
						/>
						<span className="absolute right-4 text-gray-400 text-sm font-medium">
							RCH
						</span>
					</div>
				</div>

				<div className="flex justify-end gap-3 pt-4">
					<button
						onClick={handleClose}
						className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
					>
						Cancel
					</button>

					{listingMode === "callback" ? (
						<button
							disabled
							className="px-6 py-2 bg-gray-400 text-white rounded-xl font-medium min-w-30 cursor-not-allowed"
						>
							Not Available
						</button>
					) : !isApprovedForAll ? (
						<button
							onClick={handleApprove}
							disabled={isApprovingProcessing}
							className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium min-w-30 flex justify-center"
						>
							{isApprovingProcessing ? (
								<span className="flex items-center gap-2">
									<svg
										className="animate-spin h-4 w-4 text-white"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Approving...
								</span>
							) : (
								"Approve"
							)}
						</button>
					) : (
						<button
							onClick={handleList}
							disabled={!price || isListingProcessing}
							className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium min-w-30 flex justify-center"
						>
							{isListingProcessing ? (
								<span className="flex items-center gap-2">
									<svg
										className="animate-spin h-4 w-4 text-white"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Listing...
								</span>
							) : (
								"List Item"
							)}
						</button>
					)}
				</div>
			</div>
		</Modal>
	)
}
