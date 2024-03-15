"use client";
import { Contract, ethers, formatEther, parseUnits } from "ethers";
import { useState } from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}

export default function Home() {
	async function connectToWallet() {
		if (window.ethereum) {
			console.log("detected");

			try {
				await window.ethereum.request({
					method: "wallet_requestPermissions",
					params: [{ eth_accounts: {} }],
				});
				const accounts = await window.ethereum.request({
					method: "eth_requestAccounts",
				});
				console.log(accounts);
				console.log("public key of selected account", accounts[0]);
			} catch (error) {
				console.log("Error connecting...");
			}
		} else {
			alert("Meta Mask not detected");
		}
	}

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
			<h1 className="text-4xl font-bold text-gray-800 mb-6">
				Welcome to Your DApp
			</h1>
			<button
				onClick={connectToWallet}
				className="text-white bg-blue-600 hover:bg-blue-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
			>
				Connect Wallet
			</button>
			<Swap />
		</div>
	);
}

export function Swap() {
	const [payToken, setPayToken] = useState("ETH");
	const [receiveToken, setReceiveToken] = useState("Select token");
	const [payAmount, setPayAmount] = useState("");

	const handlePayTokenChange = (event: any) => {
		setPayToken(event.target.value);
	};

	const handleReceiveTokenChange = (event: any) => {
		setReceiveToken(event.target.value);
	};

	const handlePayAmountChange = (event: any) => {
		setPayAmount(event.target.value);
	};

	const handleSubmit = async () => {
		const value: BigInt = BigInt(payAmount) * BigInt("1000000000000000000");
		const finalValue = value.toString();
		const payload = {
			token1: "0x9A4F639FF1c20Fe09371E07d0D48f8687B6Bed85",
			token2: "0x8c070420Fbe00D928d9AC558460676D9e5940C0A",
			token1value: finalValue,
		};

		console.log("Submitting swap payload:", payload);

		const provider = new ethers.BrowserProvider(window.ethereum);
		const signer = await provider.getSigner();
		const blockNumber = await provider.getBlockNumber();
		console.log("blockNumber", blockNumber);

		const balance = await provider.getBalance(
			"0xd06C215007bC67c65e18c8446b5aa9895C78306d"
		);
		console.log("balance", formatEther(balance));

		const abi = [
			{
				inputs: [],
				name: "getExchangeRate",
				outputs: [
					{
						internalType: "uint256",
						name: "",
						type: "uint256",
					},
				],
				stateMutability: "view",
				type: "function",
			},
			{
				inputs: [
					{
						internalType: "address",
						name: "token1",
						type: "address",
					},
					{
						internalType: "address",
						name: "token2",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "token1amount",
						type: "uint256",
					},
				],
				name: "swap",
				outputs: [],
				stateMutability: "nonpayable",
				type: "function",
			},
		];

		const contract = new Contract(
			"0xf3aaDD3D713269167c92b57958045142E2C889E0",
			abi,
			signer
		);

		// const tx = await contract.swap("0x9A4F639FF1c20Fe09371E07d0D48f8687B6Bed85","0x8c070420Fbe00D928d9AC558460676D9e5940C0A","1000000000000000000")
		const tx = await contract.swap(
			payload.token1,
			payload.token2,
			payload.token1value
		);

		await tx.wait();
	};

	return (
		<div className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
			<h1 className="text-4xl font-bold mb-8">Swap anytime, anywhere.</h1>
			<div className="bg-gray-800 p-6 rounded-lg">
				<div className="mb-4">
					<label className="block text-lg mb-2" htmlFor="pay">
						You pay
					</label>
					<div className="flex">
						<input
							id="pay"
							type="number"
							className="w-full rounded p-2 bg-gray-700 text-white"
							value={payAmount}
							onChange={handlePayAmountChange}
						/>
						<select
							className="rounded p-2 bg-blue-600 text-white ml-2"
							value={payToken}
							onChange={handlePayTokenChange}
						>
							<option value="Shashwot">Shashwot</option>
							{/* Add more options for payToken here */}
						</select>
					</div>
				</div>
				<div className="mb-4">
					<label className="block text-lg mb-2" htmlFor="receive">
						You receive
					</label>
					<div className="flex">
						<input
							id="receive"
							type="number"
							className="w-full rounded p-2 bg-gray-700 text-white"
							disabled
							placeholder="Amount you receive"
						/>
						<select
							className="rounded p-2 bg-blue-600 text-white ml-2"
							value={receiveToken}
							onChange={handleReceiveTokenChange}
						>
							<option value="Bhattarai">Bhattarai</option>
							{/* Add more options for receiveToken here */}
						</select>
					</div>
				</div>
				<button
					className="w-full bg-purple-700 rounded p-3 text-lg font-semibold"
					onClick={handleSubmit}
				>
					Submit Swap
				</button>
			</div>
		</div>
	);
}
