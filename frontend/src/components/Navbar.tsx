"use client"

import { useAppKit } from "@reown/appkit/react"
import { useBalance, useConnection } from "wagmi"
import { useEffect, useState, useCallback } from "react"
import { useRCHToken } from "@/hooks/useMarketplace"
import { formatEther } from "viem"

export default function Navbar() {
	const { open } = useAppKit()
	const { address, isConnected, chainId } = useConnection()
	const { balance: rchBalance, refetchBalance: refetchRCHBalance } =
		useRCHToken()
	const { data: ethBalance, refetch: refetchETHBalance } = useBalance({
		address: address,
		query: {
			enabled: !!address,
		},
	})
	const [mounted, setMounted] = useState(false)

	// Auto-refetch balances when address changes
	const refetchBalances = useCallback(() => {
		if (address) {
			refetchETHBalance()
			refetchRCHBalance()
		}
	}, [address, refetchETHBalance, refetchRCHBalance])

	useEffect(() => {
		refetchBalances()
	}, [address, refetchBalances])

	useEffect(() => {
		// Hack to avoid hydration mismatch and lint error
		const timer = setTimeout(() => setMounted(true), 0)
		return () => clearTimeout(timer)
	}, [])

	if (!mounted) {
		return (
			<nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-gray-100 z-50 relative">
				<div className="bg-linear-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent text-xl font-bold">
					NFT Market
				</div>
			</nav>
		)
	}

	const isWrongNetwork = isConnected && chainId !== 11155111

	return (
		<nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-gray-100 z-50 sticky top-0 backdrop-blur-md bg-opacity-90">
			<div className="flex items-center gap-4">
				<div
					className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent cursor-pointer"
					onClick={() => window.location.reload()}
				>
					NFT Market
				</div>

				{isWrongNetwork && (
					<span className="hidden md:inline-flex bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full items-center border border-red-100">
						Wrong Network
					</span>
				)}
			</div>

			<div className="flex items-center gap-2 md:gap-6">
				{isConnected && !isWrongNetwork && (
					<div className="hidden sm:flex items-center gap-6 pl-4 border-l border-gray-200">
						{/* ETH Balance */}
						<div className="flex flex-col items-end">
							<div className="flex items-center gap-1">
								<span className="text-lg font-bold text-gray-900">
									{ethBalance
										? Number(formatEther(ethBalance.value)).toFixed(4)
										: "0.00"}
								</span>
								<span className="text-xs text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
									{ethBalance?.symbol || "ETH"}
								</span>
							</div>
						</div>

						{/* RCH Balance */}
						<div className="flex flex-col items-end">
							<div className="flex items-center gap-1">
								<span className="text-lg font-bold text-gray-900">
									{Number(formatEther(rchBalance)).toFixed(2)}
								</span>
								<span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
									RCH
								</span>
							</div>
						</div>
					</div>
				)}

				{/* Custom Connect Button using useAppKit hook for better styling control */}
				<button
					onClick={() => open()}
					className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
				>
					{isConnected ? (
						<>
							<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
							<span>
								{address?.slice(0, 6)}...{address?.slice(-4)}
							</span>
						</>
					) : (
						"Connect Wallet"
					)}
				</button>
			</div>
		</nav>
	)
}
