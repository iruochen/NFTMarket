# Smart Contracts | 智能合约

[English](#english) | [中文](#中文)

## English

This directory contains the Solidity smart contracts for the NFT Marketplace, built using the Foundry framework.

### 📋 Contracts Overview

#### Core Contracts

1. **NFTMarket.sol** - Main marketplace contract
   - Handles NFT listing, purchasing, and cancellation
   - Uses ERC20 tokens (RCH) for payments
   - Implements ReentrancyGuard for security

2. **RCH.sol** - ERC20 Token Contract
   - Custom ERC20 token used for marketplace transactions
   - Standard OpenZeppelin ERC20 implementation

3. **Ruochen.sol** - NFT Contract
   - ERC721 NFT contract for minting unique tokens
   - Includes minting functionality

### 🛠 Development Setup

#### Prerequisites

- [Foundry](https://getfoundry.sh/) installed
- Node.js for additional tooling

#### Installation

```bash
# Install Foundry dependencies
forge install

# Install additional dependencies (if any)
forge install OpenZeppelin/openzeppelin-contracts
```

#### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Configure your environment variables
# SEPOLIA_RPC_URL=your_sepolia_rpc_url
# ETHERSCAN_API_KEY=your_etherscan_api_key
# PRIVATE_KEY=your_private_key
```

### 🔨 Building and Testing

```bash
# Compile contracts
forge build

# Run tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Run specific test
forge test --match-test testFunctionName
```

### 🚀 Deployment

#### Local Deployment (Anvil)

```bash
# Start local blockchain
anvil

# Deploy to local network
forge script script/DeployAll.s.sol --rpc-url http://localhost:8545 --broadcast
```

#### Testnet Deployment (Sepolia)

```bash
# Deploy to Sepolia
forge script script/DeployAll.s.sol --rpc-url sepolia --broadcast --verify

# Or using environment variable
forge script script/DeployAll.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

### 📊 Contract Addresses

Deployed contract addresses are automatically saved to the `deployments/` directory after deployment.

Example structure:

```
deployments/
├── NFTMarket_11155111.json    # Sepolia deployment
├── RCH_11155111.json          # RCH Token on Sepolia
└── RuochenNFT_11155111.json   # NFT Contract on Sepolia
```

### 🔍 Verification

Contracts are automatically verified during deployment when using the `--verify` flag. You can also verify manually:

```bash
forge verify-contract <contract-address> <contract-name> --chain-id <chain-id>
```

### 📖 Contract Documentation

#### NFTMarket

```solidity
struct Listing {
    address seller;
    address ntfContract;  // Note: typo in original contract
    uint256 tokenId;
    uint256 price;
    bool active;
}
```

**Key Functions:**

- `listNFT(address nftContract, uint256 tokenId, uint256 price)` - List an NFT for sale
- `purchaseNFT(uint256 listingId)` - Purchase a listed NFT
- `cancelListing(uint256 listingId)` - Cancel an active listing

#### Security Features

- ReentrancyGuard protection
- Access control for listing management
- Safe ERC20/ERC721 token transfers

### 🧪 Testing Strategy

Tests are organized in the `test/` directory:

```bash
test/
└── NFTMarket.t.sol    # Comprehensive marketplace tests
```

Run comprehensive tests:

```bash
forge test -vvv  # Verbose output for debugging
```

---

## 中文

此目录包含 NFT 市场的 Solidity 智能合约，使用 Foundry 框架构建。

### 📋 合约概览

#### 核心合约

1. **NFTMarket.sol** - 主要市场合约
   - 处理 NFT 上架、购买和取消
   - 使用 ERC20 代币 (RCH) 进行支付
   - 实现 ReentrancyGuard 安全保护

2. **RCH.sol** - ERC20 代币合约
   - 用于市场交易的自定义 ERC20 代币
   - 标准 OpenZeppelin ERC20 实现

3. **Ruochen.sol** - NFT 合约
   - 用于铸造独特代币的 ERC721 NFT 合约
   - 包含铸造功能

### 🛠 开发环境设置

#### 前置要求

- 安装 [Foundry](https://getfoundry.sh/)
- Node.js（用于附加工具）

#### 安装

```bash
# 安装 Foundry 依赖
forge install

# 安装额外依赖（如果有）
forge install OpenZeppelin/openzeppelin-contracts
```

#### 环境配置

```bash
# 复制环境模板
cp .env.example .env

# 配置您的环境变量
# SEPOLIA_RPC_URL=你的_sepolia_rpc_url
# ETHERSCAN_API_KEY=你的_etherscan_api_key
# PRIVATE_KEY=你的_私钥
```

### 🔨 构建和测试

```bash
# 编译合约
forge build

# 运行测试
forge test

# 运行测试并生成 gas 报告
forge test --gas-report

# 运行特定测试
forge test --match-test testFunctionName
```

### 🚀 部署

#### 本地部署 (Anvil)

```bash
# 启动本地区块链
anvil

# 部署到本地网络
forge script script/DeployAll.s.sol --rpc-url http://localhost:8545 --broadcast
```

#### 测试网部署 (Sepolia)

```bash
# 部署到 Sepolia
forge script script/DeployAll.s.sol --rpc-url sepolia --broadcast --verify

# 或使用环境变量
forge script script/DeployAll.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

### 📊 合约地址

部署后的合约地址会自动保存到 `deployments/` 目录。

示例结构:

```
deployments/
├── NFTMarket_11155111.json    # Sepolia 部署
├── RCH_11155111.json          # Sepolia 上的 RCH Token
└── RuochenNFT_11155111.json   # Sepolia 上的 NFT 合约
```

### 🔍 验证

使用 `--verify` 标志时，合约会在部署过程中自动验证。您也可以手动验证：

```bash
forge verify-contract <合约地址> <合约名称> --chain-id <链ID>
```

### 📖 合约文档

#### NFTMarket

```solidity
struct Listing {
    address seller;
    address ntfContract;  // 注意：原合约中的拼写错误
    uint256 tokenId;
    uint256 price;
    bool active;
}
```

**主要函数:**

- `listNFT(address nftContract, uint256 tokenId, uint256 price)` - 上架 NFT 出售
- `purchaseNFT(uint256 listingId)` - 购买已上架的 NFT
- `cancelListing(uint256 listingId)` - 取消活跃的上架

#### 安全特性

- ReentrancyGuard 重入保护
- 上架管理的访问控制
- 安全的 ERC20/ERC721 代币转移

### 🧪 测试策略

测试文件位于 `test/` 目录：

```bash
test/
└── NFTMarket.t.sol    # 综合市场测试
```

运行完整测试：

```bash
forge test -vvv  # 详细输出以便调试
```

### 📄 许可证

MIT License
