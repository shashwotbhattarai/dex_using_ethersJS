"use client";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { shashwotTokenAbi } from "../abi's/shashwotToken.abi";
import { swapContractAbi } from "../abi's/swapContract.abi";
import {
	shashwotTokenAddress,
	bhattaraiTokenAddress,
	swapContractAddress,
} from "../constants/addresses";

declare global {
	interface Window {
		ethereum?: MetaMaskInpageProvider;
	}
}
interface SwapProps {
	provider: ethers.BrowserProvider;
}

export function Swap({ provider}: SwapProps) {
	const [payToken, setPayToken] = useState("ETH");
	const [receiveToken, setReceiveToken] = useState("Select token");
	const [payAmount, setPayAmount] = useState("");

	const [isSwapLoading, setIsSwapLoading] = useState<boolean>(false);
	const [isSwapSuccessfull,setIsSwapSuccessfull]=useState<boolean>(false);

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
		setIsSwapLoading(true)
		try {
			const value: BigInt = BigInt(payAmount) * BigInt("1000000000000000000");
			const finalValue = value.toString();
			const payload = {
				token1: shashwotTokenAddress,
				token2: bhattaraiTokenAddress,
				token1value: finalValue,
			};
			console.log("Submitting swap payload:", payload);
	
			const signer = await provider?.getSigner();
	
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
	
			const swapContract = new Contract(
				swapContractAddress,
				swapContractAbi,
				signer
			);
	
			const swaptx = await swapContract.swap(
				payload.token1,
				payload.token2,
				payload.token1value
			);
	
			await swaptx.wait();
			setIsSwapSuccessfull(true)
		} catch (error) {
			console.log("error in swap",error)
			
		}finally{
			setIsSwapLoading(false)
		}
	};

	return (
		<div className="bg-gray-800 text-white max-w-md mx-auto rounded-xl shadow-md overflow-hidden p-6 space-y-8">
			<h2 className="text-white text-3xl font-semibold text-center mb-6">
				Swap
			</h2>
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
					{isSwapLoading ? <Loader /> : "Swap"}
				</button>
				{isSwapSuccessfull && <div className="text-white">Success</div>}
			</div>
		</div>
	);
}

const Loader = () => (
	<div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
);
