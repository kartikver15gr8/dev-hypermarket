// DepositStakeTnx.tsx
"use client";
import React, { useEffect, useState } from "react";
import { phantomWallet } from "@/store/atom/phantomWallet";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  clusterApiUrl,
  Commitment,
} from "@solana/web3.js";
import { toast } from "sonner";
import { solanaMarketplaceProgram } from "@/utils/constants";
import { BN } from "@coral-xyz/anchor";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { ProductInterface } from "@/lib/models";
import { getPdas } from "@/utils/helpers";
import { useRouter } from "next/navigation";

interface PhantomWindow extends Window {
  solana?: {
    isPhantom?: boolean;
    signTransaction(transaction: Transaction): Promise<Transaction>;
  };
}

declare const window: PhantomWindow;

export default function WithdrawStakeTnx() {
  const walletAddress = useRecoilValue(phantomWallet);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [transactionHash, setTransactionHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [amountToWithdraw, setAmountToWithdraw] = useState<number>(0);

  useEffect(() => {
    const commitment: Commitment = "confirmed";
    setConnection(new Connection(clusterApiUrl("devnet"), commitment));
  }, []);

  const makeWithdrawState = async () => {
    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!connection) {
      toast.error("Connection not established");
      return;
    }
    if (amountToWithdraw <= 0 || !amountToWithdraw) {
      toast.error("Enter some amount to withdraw");
      return;
    }

    try {
      setIsLoading(true);
      // validating query params
      // const url = new URL(req.url);
      // const { amount } = validatedQueryParams(url);
      const amount = 100;
      const amount_lamports = amountToWithdraw * LAMPORTS_PER_SOL;
      console.log(amount_lamports);

      const sellerPubKey = new PublicKey(walletAddress);
      console.log("sellerPubkey", sellerPubKey.toBase58());
      // getting pdas
      const pdas = await getPdas();
      console.log("PDAS: ", JSON.stringify(pdas));
      console.log("SellerLevelList", pdas.sellersLevelList.toBase58());

      // initiating transaction
      const tx = await solanaMarketplaceProgram.methods
        .withdrawStake({
          amountLamports: new BN(amount_lamports),
        })
        .accounts({
          seller: sellerPubKey,
          sellersLevelList: pdas.sellersLevelList,
        })
        .transaction();

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const transaction = new Transaction().add(tx);
      transaction.feePayer = sellerPubKey;
      transaction.recentBlockhash = blockhash;

      const { solana } = window;
      if (!solana?.isPhantom) {
        throw new Error("Phantom wallet is not installed!");
      }
      const signedTransaction = await solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      if (signature) {
        setTransactionHash(signature);
      }
      toast.info("Transaction sent", { description: signature });

      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });
      if (confirmation.value.err) {
        throw new Error(
          "Transaction failed: " + JSON.stringify(confirmation.value.err)
        );
      }

      toast.success("Transaction successful!", {
        description: signature,
      });
      setIsLoading(false);

      return signature;
    } catch (error) {
      setIsLoading(false);
      console.log(`You got an error while executing deposit stake: ${error}`);
    }
  };

  return (
    <div className="h-10">
      {/* <p>Withdraw Stake</p>
      <p>Seller Wallet Address: {walletAddress}</p> */}
      <input
        className="border h-full p-1 text-black text-xs sm:text-sm w-28 sm:w-32 outline-none rounded-l-md"
        type="number"
        placeholder="Amount in SOL"
        // value={amountToWithdraw}
        onChange={(e) => {
          setAmountToWithdraw(parseFloat(e.target.value));
        }}
      />
      <button
        onClick={makeWithdrawState}
        className="p-1 h-full px-2 bg-black text-white text-xs sm:text-sm w-20 sm:w-28 rounded-r-md"
      >
        {isLoading ? "processing…" : "withdraw"}
      </button>
    </div>
  );
}
