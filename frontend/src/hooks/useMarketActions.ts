import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import {
  NFT_MARKET_ADDRESS,
  NFT_MARKET_ABI,
  RCH_TOKEN_ADDRESS,
  RCH_ABI,
  NFT_ADDRESS,
  NFT_ABI,
} from "../constants";
import { parseEther, encodeAbiParameters, parseAbiParameters } from "viem";

export function useMarketActions() {
  const {
    writeContractAsync,
    data: hash,
    isPending,
    error,
    reset,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const listNFT = async (tokenId: bigint, price: string) => {
    try {
      await writeContractAsync({
        address: NFT_MARKET_ADDRESS,
        abi: NFT_MARKET_ABI,
        functionName: "list",
        args: [NFT_ADDRESS, tokenId, parseEther(price)],
      });
    } catch (err) {
      console.error("List NFT failed:", err);
      reset();
      throw err;
    }
  };

  const cancelListing = async (listingId: bigint) => {
    try {
      await writeContractAsync({
        address: NFT_MARKET_ADDRESS,
        abi: NFT_MARKET_ABI,
        functionName: "cancelListing",
        args: [listingId],
      });
    } catch (err) {
      console.error("Cancel listing failed:", err);
      reset();
      throw err;
    }
  };

  const buyNFT = async (listingId: bigint, price: bigint) => {
    try {
      const data = encodeAbiParameters(parseAbiParameters("uint256"), [
        listingId,
      ]);
      await writeContractAsync({
        address: RCH_TOKEN_ADDRESS,
        abi: RCH_ABI,
        functionName: "transferWithCallback",
        args: [NFT_MARKET_ADDRESS, price, data],
      });
    } catch (err) {
      console.error("Buy NFT failed:", err);
      reset();
      throw err;
    }
  };

  const mint = async (to: string, tokenURI: string) => {
    try {
      await writeContractAsync({
        address: NFT_ADDRESS,
        abi: NFT_ABI,
        functionName: "mint",
        args: [to, tokenURI],
      });
    } catch (err) {
      console.error("Mint failed:", err);
      reset();
      throw err;
    }
  };

  return {
    listNFT,
    cancelListing,
    buyNFT,
    mint,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
    reset,
  };
}
