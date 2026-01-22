import { cookieStorage, createStorage } from "wagmi"
import { sepolia, mainnet, localhost } from "wagmi/chains"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { fallback, http, webSocket } from "viem"

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
// const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
// const infuraKey = process.env.NEXT_PUBLIC_INFURA_API_KEY

if (!projectId) {
	throw new Error("Project ID is not defined")
}

export const networks = [sepolia, mainnet, localhost]

export const wagmiAdapter = new WagmiAdapter({
	storage: createStorage({
		storage: cookieStorage,
	}),
	ssr: true,
	projectId,
	networks,
	// transports: {
	// 	[sepolia.id]: fallback([
	// 		webSocket(`wss://sepolia.infura.io/ws/v3/${infuraKey}`),
	// 		http(`https://sepolia.infura.io/v3/${infuraKey}`),
	// 		http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`),
	// 	]),
	// },
})

export const config = wagmiAdapter.wagmiConfig
