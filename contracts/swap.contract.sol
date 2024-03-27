// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract DynamicTokenSwap {
    function swap(address token1, address token2, uint token1amount) public {
        uint token2Amount = token1amount*getExchangeRate();

        require(token2Amount > 0, "Invalid exchange rate");

        IERC20(token1).transferFrom(msg.sender, address(this), token1amount);
        IERC20(token2).transfer(msg.sender, token2Amount);
    }

    function getExchangeRate() public view returns (uint) {
            return(2);
    }
}
