// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface ITokenReceiver {
    /**
     * @dev 代币接收回调函数
     * @param from 代币发送地址
     * @param amount 代币数量
     * @param data 携带数据
     * @return 返回函数选择器以确认接收
     */
    function tokenReceived(
        address from,
        uint256 amount,
        bytes calldata data
    ) external returns (bytes4);
}

contract RCH is ERC20 {
    event TransferWithCallback(
        address indexed from,
        address indexed to,
        uint256 amount,
        bytes data
    );

    string private constant NAME = "Ruochen";
    string private constant SYMBOL = "RCH";
    uint256 private constant MAX_TOTAL_SUPPLY = 1_000_000_000 * 10 ** 18;

    constructor(address recipient) ERC20(NAME, SYMBOL) {
        _mint(recipient, MAX_TOTAL_SUPPLY);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        _spendAllowance(from, msg.sender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @dev 带回调的转账函数
     * @param to 接收地址
     * @param amount 转账数量
     * @param data 携带数据
     * @return 返回是否成功
     */
    function transferWithCallback(
        address to,
        uint256 amount,
        bytes calldata data
    ) external returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _transfer(msg.sender, to, amount);

        // 如果接收方是合约，调用其 tokenReceived 回调函数
        if (_isContract(to)) {
            try
                ITokenReceiver(to).tokenReceived(msg.sender, amount, data)
            returns (bytes4 selector) {
                require(
                    selector == ITokenReceiver.tokenReceived.selector,
                    "Invalid callback selector"
                );
            } catch {
                revert(
                    "Safe receive failed: callback reverted or invalid selector"
                );
            }
        }

        emit TransferWithCallback(msg.sender, to, amount, data);
        return true;
    }

    /**
     * @dev 检查地址是否为合约
     * @param account 地址
     * @return 返回是否为合约地址
     */
    function _isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}
