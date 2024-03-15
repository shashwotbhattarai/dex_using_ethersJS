"use client";
import { Contract, ethers, formatEther, parseUnits } from "ethers";
import { useState } from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
	interface Window {
		ethereum?: MetaMaskInpageProvider;
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
		<div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center">
			<h1 className="text-5xl font-bold text-white mb-10">First DEX Dapp</h1>
			<button
				onClick={connectToWallet}
				className="mb-6 py-2 px-10 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
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
		const swapContractAddress = "0xf3aaDD3D713269167c92b57958045142E2C889E0";
		const shashwotTokenAddress = "0x9A4F639FF1c20Fe09371E07d0D48f8687B6Bed85";
		const bhattaraiTokenAddress = "0x8c070420Fbe00D928d9AC558460676D9e5940C0A";
		const payload = {
			token1: "0x9A4F639FF1c20Fe09371E07d0D48f8687B6Bed85",
			token2: "0x8c070420Fbe00D928d9AC558460676D9e5940C0A",
			token1value: finalValue,
		};
		console.log("Submitting swap payload:", payload);

		const provider = new ethers.BrowserProvider(window.ethereum);
		const signer = await provider.getSigner();

		const shashwotTokenAbi = [
			{
				inputs: [],
				stateMutability: "nonpayable",
				type: "constructor",
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: "address",
						name: "owner",
						type: "address",
					},
					{
						indexed: true,
						internalType: "address",
						name: "spender",
						type: "address",
					},
					{
						indexed: false,
						internalType: "uint256",
						name: "value",
						type: "uint256",
					},
				],
				name: "Approval",
				type: "event",
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: "address",
						name: "from",
						type: "address",
					},
					{
						indexed: true,
						internalType: "address",
						name: "to",
						type: "address",
					},
					{
						indexed: false,
						internalType: "uint256",
						name: "value",
						type: "uint256",
					},
				],
				name: "Transfer",
				type: "event",
			},
			{
				inputs: [
					{
						internalType: "address",
						name: "",
						type: "address",
					},
					{
						internalType: "address",
						name: "",
						type: "address",
					},
				],
				name: "allowance",
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
						name: "_spender",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "_value",
						type: "uint256",
					},
				],
				name: "approve",
				outputs: [
					{
						internalType: "bool",
						name: "success",
						type: "bool",
					},
				],
				stateMutability: "nonpayable",
				type: "function",
			},
			{
				inputs: [
					{
						internalType: "address",
						name: "",
						type: "address",
					},
				],
				name: "balanceOf",
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
				inputs: [],
				name: "decimals",
				outputs: [
					{
						internalType: "uint8",
						name: "",
						type: "uint8",
					},
				],
				stateMutability: "view",
				type: "function",
			},
			{
				inputs: [],
				name: "name",
				outputs: [
					{
						internalType: "string",
						name: "",
						type: "string",
					},
				],
				stateMutability: "view",
				type: "function",
			},
			{
				inputs: [],
				name: "symbol",
				outputs: [
					{
						internalType: "string",
						name: "",
						type: "string",
					},
				],
				stateMutability: "view",
				type: "function",
			},
			{
				inputs: [],
				name: "totalSupply",
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
						name: "_to",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "_value",
						type: "uint256",
					},
				],
				name: "transfer",
				outputs: [
					{
						internalType: "bool",
						name: "success",
						type: "bool",
					},
				],
				stateMutability: "nonpayable",
				type: "function",
			},
			{
				inputs: [
					{
						internalType: "address",
						name: "_from",
						type: "address",
					},
					{
						internalType: "address",
						name: "_to",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "_value",
						type: "uint256",
					},
				],
				name: "transferFrom",
				outputs: [
					{
						internalType: "bool",
						name: "success",
						type: "bool",
					},
				],
				stateMutability: "nonpayable",
				type: "function",
			},
		];

		const shashwotTokenContract = new Contract(
			shashwotTokenAddress,
			shashwotTokenAbi,
			signer
		);

		const approvetx = await shashwotTokenContract.approve(
			swapContractAddress,
			payload.token1value
		);

		await approvetx.wait();

		const swapAbi = [
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

		const swapContract = new Contract(swapContractAddress, swapAbi, signer);

		const swaptx = await swapContract.swap(
			payload.token1,
			payload.token2,
			payload.token1value
		);

		await swaptx.wait();
	};

	return (
		<div className="bg-gray-800 text-white max-w-md mx-auto rounded-xl shadow-md overflow-hidden p-6 space-y-8">
			<div>
				<div className="mb-4">
					<label className="block text-md mb-2" htmlFor="pay">
						You pay
					</label>
					<div className="flex">
						<input
							id="pay"
							type="number"
							className="flex-grow rounded-l p-4 bg-gray-700 focus:outline-none text-white"
							value={payAmount}
							onChange={handlePayAmountChange}
						/>
						<select
							className="bg-blue-500 rounded-r px-4 text-white focus:outline-none"
							value={payToken}
							onChange={handlePayTokenChange}
						>
							<option value="Shashwot">Shashwot</option>
							{/* Add more options for payToken here */}
						</select>
					</div>
				</div>
				<div className="mb-6">
					<label className="block text-md mb-2" htmlFor="receive">
						You receive
					</label>
					<div className="flex">
						<input
							id="receive"
							type="number"
							className="flex-grow rounded-l p-4 bg-gray-700 focus:outline-none text-white"
							disabled
							placeholder="Amount you receive"
						/>
						<select
							className="bg-blue-500 rounded-r px-4 text-white focus:outline-none"
							value={receiveToken}
							onChange={handleReceiveTokenChange}
						>
							<option value="Bhattarai">Bhattarai</option>
							{/* Add more options for receiveToken here */}
						</select>
					</div>
				</div>
				<button
					className="w-full bg-purple-600 rounded-md p-4 text-lg font-semibold hover:bg-purple-800 transition duration-300"
					onClick={handleSubmit}
				>
					Submit Swap
				</button>
			</div>
		</div>
	);
}
