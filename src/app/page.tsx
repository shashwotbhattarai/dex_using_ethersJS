"use client";
import { useState } from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Swap } from "../components/swap";
import { Stake } from "../components/stake";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export default function Home() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | undefined>(undefined);
  const [selectedAccount,setSelectedAccount] = useState<string>("");

  async function connectToWallet() {
    if (window.ethereum) {
      console.log("detected");
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
        const accounts: any = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts[0]) {
          console.log("accounts", accounts);
          console.log("public key of selected account", accounts[0]);
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(newProvider);
          setSelectedAccount(accounts[0]);
        }
      } catch (error) {
        console.log("Error connecting...");
      }
    } else {
      alert("Meta Mask not detected");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold text-white mb-10">DEX Dapp</h1>
      
      {provider === undefined ? (
        <button
          onClick={connectToWallet}
          className="mb-6 py-2 px-10 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex flex-row justify-between items-center w-full p-4">
          <div className="flex-1 mr-2">
            <Swap provider={provider} />
          </div>
          <div className="flex-1 ml-2">
            <Stake provider={provider} selectedAccount={selectedAccount} />
          </div>
        </div>
      )}
    </div>
  );
}