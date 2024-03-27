export const swapContractAbi = [
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