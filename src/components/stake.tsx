"use client";
import { Contract, ethers, formatEther, parseUnits } from "ethers";
import { useEffect, useState } from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { shashwotTokenAbi } from "../abi's/shashwotToken.abi";
import { stakeContractABI } from "../abi's/stakeContract.abi";
import {
	shashwotTokenAddress,
	stakeContractAddress,
} from "../constants/addresses";

declare global {
	interface Window {
		ethereum?: MetaMaskInpageProvider;
	}
}

export function Stake() {
	const [stakeAmount, setStake] = useState(0);
	const [unStakeAmount, setUnStake] = useState(0);
	const [totalStakedAmount, setTotalStakedAmount] = useState(0);

	let selectedAccount: any;
	let provider: any;

	async function getAccounts() {
		if (window.ethereum) {
			const accounts: any = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			selectedAccount = accounts[0];
			console.log("selectedAccount", selectedAccount);
			provider = new ethers.BrowserProvider(window.ethereum);
		}
	}

	const handleStakeChange = (event: any) => {
		setStake(event.target.value);
	};

	const handleUnStakeChange = (event: any) => {
		setUnStake(event.target.value);
	};

	const handleSubmit = async () => {
		console.log("stakeamount", stakeAmount);

		const value: BigInt = BigInt(stakeAmount) * BigInt("1000000000000000000");
		const finalValue = value.toString();
		console.log("finalValueToStake", finalValue);
		await getAccounts();

		const signer = await provider.getSigner();

		const shashwotTokenContract = new Contract(
			shashwotTokenAddress,
			shashwotTokenAbi,
			signer
		);

		const stakeContract = new Contract(
			stakeContractAddress,
			stakeContractABI,
			signer
		);

		const approvetx = await shashwotTokenContract.approve(
			stakeContractAddress,
			finalValue
		);

		const approveResponse = await approvetx.wait();

		console.log("approveResponse", approveResponse);

		const staketx = await stakeContract.stake(finalValue);

		const stakeResponse = await staketx.wait();

		console.log("stakeResponse", stakeResponse);
	};

	const checkReward = async () => {
		await getAccounts();
		const signer = await provider.getSigner();

		const stakeContract = new Contract(
			stakeContractAddress,
			stakeContractABI,
			signer
		);
		const reward = await stakeContract.rewards(selectedAccount);

		console.log("reward", reward);
	};

	const withdrawReward = async () => {
		await getAccounts();
		const signer = await provider.getSigner();

		const stakeContract = new Contract(
			stakeContractAddress,
			stakeContractABI,
			signer
		);
		const withdrawtx = await stakeContract.withDrawReward();
		const withdrawRewardResponse = await withdrawtx.wait();
		console.log("withdrawtx", withdrawRewardResponse);
	};

	const checkStakedAmount = async () => {
		await getAccounts();
		const signer = await provider.getSigner();

		const stakeContract = new Contract(
			stakeContractAddress,
			stakeContractABI,
			signer
		);
		const stakedAmount = await stakeContract.balanceOf(selectedAccount);
		const stakedAmountBigInt = BigInt(stakedAmount.toString());

		// Convert the BigInt value to Ether (assuming 18 decimal places)
		const downsizedStakedAmount = stakedAmountBigInt / BigInt(10 ** 18);

		// Convert the BigInt back to a regular number (if needed)
		const downsizedStakedAmountNumber = Number(downsizedStakedAmount);

		setTotalStakedAmount(downsizedStakedAmountNumber);

		console.log("totalStakedAmount", downsizedStakedAmountNumber);
		console.log("stakedAmount", stakedAmount);
	};

	const withdrawStakedAmount = async () => {
		const value: BigInt = BigInt(unStakeAmount) * BigInt("1000000000000000000");
		const finalValue = value.toString();
		console.log("finalValueToUnstake", finalValue);
		await getAccounts();
		const signer = await provider.getSigner();

		const stakeContract = new Contract(
			stakeContractAddress,
			stakeContractABI,
			signer
		);
		const withdrawtx = await stakeContract.withdraw(finalValue);
		const withdrawStakedAmountResponse = await withdrawtx.wait();
		console.log("withdrawtx", withdrawStakedAmountResponse);
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-xl bg-gray-800 rounded-lg shadow-xl">
			<h2 className="text-white text-3xl font-semibold text-center mb-6">
				Stake Your Tokens
			</h2>

			<div className="space-y-4">
				<div className="flex items-center space-x-4">
					<input
						type="number"
						value={stakeAmount}
						onChange={handleStakeChange}
						placeholder="Enter amount to stake"
						className="flex-grow p-2 border-2 border-blue-500 bg-gray-900 text-white rounded focus:outline-none focus:border-blue-700"
					/>
					<button
						onClick={handleSubmit}
						className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center"
					>
						Stake
					</button>
				</div>

				<div className="flex items-center space-x-4">
					<input
						type="number"
						value={unStakeAmount}
						onChange={handleUnStakeChange}
						placeholder="Enter amount to unstake"
						className="flex-grow p-2 border-2 border-blue-500 bg-gray-900 text-white rounded focus:outline-none focus:border-blue-700"
					/>
					<button
						onClick={withdrawStakedAmount}
						className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center"
					>
						Unstake
					</button>
				</div>

				<div className="flex items-center justify-center pt-4">
					<button
						onClick={checkStakedAmount}
						className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded transition-colors duration-200"
					>
						Check Staked Amount
					</button>
					<span className="ml-4 p-2 bg-blue-500 text-white rounded">
						{totalStakedAmount}
					</span>
				</div>
			</div>
		</div>
	);
}
