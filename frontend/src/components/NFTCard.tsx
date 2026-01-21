import { formatEther } from "viem"
import { NFTItem } from "../hooks/useNFTs"
import { useConnection } from "wagmi"
import { cn } from "@/lib/utils"
import { Tag, ShoppingCart, Ban, Loader2 } from "lucide-react"

interface NFTCardProps {
	item: NFTItem
	variant?: "market" | "profile"
	onAction: (item: NFTItem, action: "buy" | "cancel" | "list") => void
	disabled?: boolean
	isLoading?: boolean
}

export default function NFTCard({
	item,
	variant = "market",
	onAction,
	disabled,
	isLoading = false,
}: NFTCardProps) {
	const { address } = useConnection()
	const isOwner = address && item.owner?.toLowerCase() === address.toLowerCase()

	// Placeholder image generation based on ID
	const seed = Number(item.tokenId) % 5
	const bgColors = [
		"from-pink-500 to-rose-500",
		"from-purple-500 to-indigo-500",
		"from-blue-400 to-cyan-300",
		"from-emerald-400 to-teal-500",
		"from-orange-400 to-amber-500",
	]
	const bgClass = bgColors[seed]

	return (
		<div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
			{/* Image / Visual Area */}
			<div
				className={cn(
					"relative h-64 w-full flex items-center justify-center bg-linear-to-br p-6",
					bgClass,
				)}
			>
				<div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

				{/* ID Badge */}
				<div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
					#{item.tokenId.toString()}
				</div>

				<div className="text-center text-white drop-shadow-md">
					<div className="text-6xl mb-2">👾</div>
					<div className="font-bold text-lg opacity-90">
						Ruochen # {item.tokenId.toString()}
					</div>
				</div>
			</div>

			{/* Info Area */}
			<div className="p-5 grow flex flex-col justify-between">
				<div className="mb-4">
					<h3 className="text-lg font-bold text-gray-900 line-clamp-1">
						{item.metadata?.name || `Ruochen NFT #${item.tokenId}`}
					</h3>
					<p className="text-sm text-gray-500 mt-1">
						Owner:{" "}
						{isOwner ? (
							<span className="text-indigo-600 font-medium">You</span>
						) : (
							item.owner?.slice(0, 6) + "..." + item.owner?.slice(-4)
						)}
					</p>
				</div>
				{/* Price section (only if listed) */}
				{/* // TODO isListed 怎么来的？ */}
				{item.isListed && item.price && (
					<div className="flex items-end gap-1 mb-4">
						<span className="text-2xl font-bold text-gray-900">
							{formatEther(item.price)}
						</span>
						<span className="text-sm font-medium text-gray-500 mb-1">RCH</span>
					</div>
				)}
				{/* Action Button */}
				<div className="mt-auto pt-4 border-t border-gray-50">
					{variant === "market" && item.isListed && !isOwner && (
						<button
							onClick={() => onAction(item, "buy")}
							disabled={disabled || isLoading}
							className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<>
									<Loader2 className="animate-spin" size={18} />
									Processing...
								</>
							) : (
								<>
									<ShoppingCart size={18} />
									Buy Now
								</>
							)}
						</button>
					)}

					{variant === "market" && item.isListed && isOwner && (
						<button
							disabled
							className="w-full py-2.5 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed flex items-center justify-center gap-2"
						>
							<Tag size={18} />
							Listed by You
						</button>
					)}

					{variant === "profile" && (
						<>
							{item.isListed ? (
								<button
									onClick={() => onAction(item, "cancel")}
									disabled={disabled || isLoading}
									className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 disabled:bg-gray-100 text-rose-600 disabled:text-gray-400 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
								>
									{isLoading ? (
										<>
											<Loader2 className="animate-spin" size={18} />
											Processing...
										</>
									) : (
										<>
											<Ban size={18} />
											Cancel Listing
										</>
									)}
								</button>
							) : (
								<button
									onClick={() => onAction(item, "list")}
									disabled={disabled || isLoading}
									className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 disabled:bg-gray-100 text-indigo-600 disabled:text-gray-400 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
								>
									<Tag size={18} />
									List for Sale
								</button>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	)
}
