# Dex DApp

## Installations

- Clone this repository using git clone `https://github.com/ShashwotBhattarai/eth_dex.git`
- Make sure you have node installed on your machine.
- Install the required dependencies with `npm install`
- Run the application with `npm run dev`
- The application will be running on `http://localhost:3000` or check your terminal if different post is choosen for some reason.

## Setup process
- Install meta mask and create a account and choose sepolia test net in networks.
- Choosing sepolia test net is important because all our contracts are deployed there.
- For swapping you need to have some sepolia test ethers in your account, so you can get some test ethers from faucets.
- Then import tokens to your metamask account by clicking on add token button and add the token address "0x9A4F639FF1c20Fe09371E07d0D48f8687B6Bed85","0x8c070420Fbe00D928d9AC558460676D9e5940C0A". You will be able to see the tokens in your account but the quantity will be zero. Please ping me on telegram +977 9802317570 for some shashwot and bhattarai tokens with your account address.
- Now you can go ahead and connect your metamask wallet and choose the acoount that has some shashwot token and test sepolia eth.
- Finally you can perform swap by typing an amount of shashwot token in the input box and click on swap button.
- Give metamask couple of approvals and watch shashwot token being swapped for bhattarai token in your metamask wallet account.
- For staking you dont need to do anything you can directly start staking from connected walllet.


## Architecture

A high-level architecture of a decentralized exchange (DEX) application built on the Sepolia test net. The core components include:

- **Frontend**: Developed using Next.js and ethers.js, the frontend serves as the user interface for interacting with the swap functionality. It allows users to connect their MetaMask wallets, select tokens to swap(currently swapping only bhattarai token for shashwot token is possible), and view estimated exchange rates(this is not implemented yet).
  
- **Smart Contracts**:
  - **Shashwot Token Contract**: This smart contract manages the Shashwot token, including minting, burning(not yet), and token approval for swapping.
  - **Bhattarai Token Contract**: Similar to the Shashwot token contract, this smart contract governs the Bhattarai token.
  - **Swap Contract**: The core functionality of the DEX lies within this smart contract. It facilitates token swapping between two given tokens. Given that the token to be returned is in liquidity pool of this swap contract.
  - **Stake Contract**: This contract provides the staking feature for our application, it also provides reward features.


## Work Flow

- First the user connects to the metamask wallet and desired account.User can reconnect to different account if required.
- Then the user selects the token to be swapped (currently fixed).
- Then the user selects the amount of token to be swapped.
- Then user presses the swap button.
- Metamask ask for the approval to provide swap contract approval of the desired amount of tokens being paid for swap.
- After the this initial approval the token1(shashwot token in this case) contract's approve function is called to provide the swap contract approval of the desired amount of tokens being paid for swap.
- After metamask ask for another approval to conduct swap and after the approval the swap smartcontract's swap function is called to conduct the swap.
- Similarly for staking and unstaking features too.


## Current Limitations

- **Limited Swap Pair**: Currently, the DEX only supports swapping Bhattarai for Shashwot tokens. Extending functionality to include additional token pairs would require modifications to both the frontend and smart contract logic.
- **Fixed Exchange Rate**: The exchange rate for swaps appears to be fixed for now.
- **Missing Features**: Liquidity pools and staking features are not yet implemented. Integration of these functionalities would enhance the overall usability and attractiveness of the DEX.
- **Reward Mechanishms**: Reward mechanishms are still to be integrated.

## Future Considerations

- Implement additional token pairs for swapping.
- Integrate a dynamic pricing mechanism to determine exchange rates.
- Develop liquidity pool functionalities to enable users to contribute tokens and earn rewards.
- Design and incorporate a staking mechanism to incentivize users to hold tokens.

