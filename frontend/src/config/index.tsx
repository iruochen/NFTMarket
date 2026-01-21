import { cookieStorage, createStorage, http } from "wagmi"
import { sepolia, mainnet, localhost } from "wagmi/chains"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

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
})

export const config = wagmiAdapter.wagmiConfig
