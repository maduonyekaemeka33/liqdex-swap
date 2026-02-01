import React from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Jupiter } from "@jup-ag/core";
import { useWallet } from "@solana/wallet-adapter-react";

const JupiterSwap = () => {
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const feeAccount = new PublicKey("YOUR_FEE_WALLET_PUBLIC_KEY");

  const handleSwap = async () => {
    const jupiter = await Jupiter.load({
      connection,
      cluster: "mainnet-beta",
      user: publicKey,
    });

    const routes = await jupiter.computeRoutes({
      inputMint: "So11111111111111111111111111111111111111112", // SOL
      outputMint: "EPjFWdd5AufqSSqeM2q2tq5Z75ePtD5xciSGyAmR9pE", // USDC
      amount: 1000000, // 0.001 SOL
    });

    if (routes.routesInfos.length === 0) return;

    const bestRoute = routes.routesInfos[0];

    const { swapTransaction } = await jupiter.exchange({
      routeInfo: bestRoute,
      userPublicKey: publicKey,
      feeAccount,
    });

    const txSignature = await sendTransaction(swapTransaction, connection);
    await connection.confirmTransaction(txSignature, "confirmed");

    alert("Swap complete! Fee goes to: " + feeAccount.toBase58());
  };

  return <button onClick={handleSwap}>Swap SOL → USDC</button>;
};

export default JupiterSwap;
