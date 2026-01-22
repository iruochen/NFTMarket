import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ContextProvider from "@/context/ContextProvider"
import { headers } from "next/headers"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Ruochen NFT Market",
	description: "A decentralized marketplace for Ruochen NFTs",
	icons: {
		icon: "/logo.svg",
	},
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const headersList = await headers()
	const cookies = headersList.get("cookie")

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
			>
				<ContextProvider cookies={cookies}>{children}</ContextProvider>
			</body>
		</html>
	)
}
