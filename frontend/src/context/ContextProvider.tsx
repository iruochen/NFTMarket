"use client"

import { wagmiAdapter, projectId } from "@/config"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createAppKit } from "@reown/appkit/react"
import { sepolia, mainnet, localhost } from "@reown/appkit/networks"
import { type ReactNode } from "react"
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi"

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
	throw new Error("Project ID is not defined")
}

// Create the modal
const appKit = createAppKit({
	adapters: [wagmiAdapter],
	projectId,
	networks: [sepolia, mainnet, localhost],
	defaultNetwork: sepolia,
	metadata: {
		name: "NFT Market",
		description: "A Simple NFT Marketplace",
		url: "https://nft.ruochen.app",
		icons: ["https://avatars.githubusercontent.com/u/37784886"],
	},
	features: {
		analytics: true, // Optional - defaults to your Cloud configuration
	},
})

export default function ContextProvider({
	children,
	cookies,
}: {
	children: ReactNode
	cookies: string | null
}) {
	const initialState = cookieToInitialState(
		wagmiAdapter.wagmiConfig as Config,
		cookies,
	)

	return (
		<WagmiProvider
			config={wagmiAdapter.wagmiConfig as Config}
			initialState={initialState}
		>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	)
}
