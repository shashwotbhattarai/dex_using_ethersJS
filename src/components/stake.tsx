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

interface StakeProps {
	provider: ethers.BrowserProvider;
	selectedAccount: string;
}

export function Stake({ provider, selectedAccount }: StakeProps) {
	const [stakeAmount, setStake] = useState(0);
	const [unStakeAmount, setUnStake] = useState(0);
	const [totalStakedAmount, setTotalStakedAmount] = useState(0);

	const [isStakeLoading, setIsStakeLoading] = useState<boolean>(false);
	const [isStakingSuccessfull,setIsStakingSuccessfull]=useState<boolean>(false);

	const [isUnStakeLoading, setIsUnStakeLoading] = useState<boolean>(false);
	const [isUnStakingSuccessfull,setIsUnStakingSuccessfull]=useState<boolean>(false);

	const [isCheckStakedAmountLoading, setIsCheckStakedAmountLoading] =
		useState<boolean>(false);

	const handleStakeChange = (event: any) => {
		setStake(event.target.value);
	};

	const handleUnStakeChange = (event: any) => {
		setUnStake(event.target.value);
	};

	const handleSubmit = async () => {
		setIsStakeLoading(true);
		try {
			console.log("stakeamount", stakeAmount);

			const value: BigInt = BigInt(stakeAmount) * BigInt("1000000000000000000");
			const finalValue = value.toString();
			console.log("finalValueToStake", finalValue);

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
			setIsStakingSuccessfull(true);
		} catch (error) {
			console.error("Error while staking:", error);
		} finally {
			setIsStakeLoading(false);
		}
	};

	const checkReward = async () => {
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
		setIsCheckStakedAmountLoading(true);
		try {
			console.log("hello");
			const signer = await provider.getSigner();
			console.log("hello signer", signer);

			const stakeContract = new Contract(
				stakeContractAddress,
				stakeContractABI,
				signer
			);
			console.log("hello stack contract ", stakeContract);

			const stakedAmount = await stakeContract.balanceOf(selectedAccount);
			console.log("hello staked amount", selectedAccount);
			const stakedAmountBigInt = BigInt(stakedAmount.toString());

			// Convert the BigInt value to Ether (assuming 18 decimal places)
			const downsizedStakedAmount = stakedAmountBigInt / BigInt(10 ** 18);

			// Convert the BigInt back to a regular number (if needed)
			const downsizedStakedAmountNumber = Number(downsizedStakedAmount);

			setTotalStakedAmount(downsizedStakedAmountNumber);

			console.log("totalStakedAmount", downsizedStakedAmountNumber);
			console.log("stakedAmount", stakedAmount);
		} catch (error) {
			console.error("Error while checking staked amount:", error);
		} finally {
			setIsCheckStakedAmountLoading(false);
		}
	};

	const withdrawStakedAmount = async () => {
		setIsUnStakeLoading(true);
		try {
			const value: BigInt =
				BigInt(unStakeAmount) * BigInt("1000000000000000000");
			const finalValue = value.toString();
			console.log("finalValueToUnstake", finalValue);

			const signer = await provider.getSigner();

			const stakeContract = new Contract(
				stakeContractAddress,
				stakeContractABI,
				signer
			);
			const withdrawtx = await stakeContract.withdraw(finalValue);
			const withdrawStakedAmountResponse = await withdrawtx.wait();
			console.log("withdrawtx", withdrawStakedAmountResponse);
			setIsUnStakingSuccessfull(true)

		} catch (error) {
			console.error("Error while withdrawing staked amount:", error);
		} finally {
			setIsUnStakeLoading(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-xl bg-gray-800 rounded-lg shadow-xl">
			<h2 className="text-white text-3xl font-semibold text-center mb-6">
				Stake Shashwot Tokens
			</h2>

			<div className="space-y-4">
				<div className="flex items-center space-x-4">
					<input
						type="number"
						value={stakeAmount}
						onChange={handleStakeChange}
						placeholder="Enter amount to stake"
						className="flex-grow rounded-l p-4 bg-gray-700 focus:outline-none text-white"
					/>
					<button
						onClick={handleSubmit}
						className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center"
					>
						{isStakeLoading ? <Loader /> : "Stake"}
					</button>
					{isStakingSuccessfull && <div className="text-white">Success</div>}
				</div>

				<div className="flex items-center space-x-4">
					<input
						type="number"
						value={unStakeAmount}
						onChange={handleUnStakeChange}
						placeholder="Enter amount to unstake"
						className="flex-grow rounded-l p-4 bg-gray-700 focus:outline-none text-white"
					/>
					<button
						onClick={withdrawStakedAmount}
						className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center"
					>
						{isUnStakeLoading ? <Loader /> : "Unstake"}
					</button>
					{isUnStakingSuccessfull && <div className="text-white">Success</div>}
				</div>

				<div className="flex items-center justify-center pt-4">
					<button
						onClick={checkStakedAmount}
						className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded transition-colors duration-200"
					>
						{isCheckStakedAmountLoading ? <Loader /> : "Check Staked Amount"}
					</button>
					<span className="ml-4 p-2 bg-gray-700 text-white rounded">
						{totalStakedAmount}
					</span>
				</div>
			</div>
		</div>
	);
}

const Loader = () => (
	<div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
);
