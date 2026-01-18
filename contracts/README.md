# NFTMarket Project / NFTMarket 项目

[English](#english) | [中文](#chinese)

<a name="english"></a>

## English

### Overview

A decentralized NFT Marketplace built on Ethereum, featuring a complete ecosystem with a custom ERC20 payment token and an ERC721 NFT collection. Users can mint NFTs, list them for sale, and purchase them using the native RCH token.

### Features

- **NFT Marketplace (`NFTMarket.sol`)**
  - **List**: Sellers can list their NFTs for sale at a specific price.
  - **Buy**: Buyers can purchase listed NFTs using RCH tokens.
  - **Cancel**: Sellers can cancel their active listings.
  - **Security**: Implements `ReentrancyGuard` for secure transactions.

- **ERC20 Token (`RCH.sol`)**
  - Standard ERC20 token implementation.
  - **Name**: Ruochen (RCH).
  - **Extended Functionality**: Implements `transferWithCallback` for seamless integration allowing token transfers to trigger actions in receiving contracts.

- **ERC721 NFT (`Ruochen.sol`)**
  - Standard ERC721 NFT implementation.
  - **Name**: Ruochen (RC).
  - **Metadata**: Supports per-token URI storage for metadata.
  - **Minting**: Owner-only minting capability.

### Project Structure

```
contracts/
├── src/
│   ├── NFTMarket.sol   # Marketplace Contract
│   ├── RCH.sol         # Payment Token Contract
│   └── Ruochen.sol     # NFT Contract
├── script/
│   └── DeployAll.s.sol # Deployment Script
└── test/               # Foundry Tests
```

### Getting Started

#### Prerequisites

- **Foundry**: A blazing fast, portable and modular toolkit for Ethereum application development.
- **Git**

#### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/iruochen/NFTMarket
   cd NFTMarket/contracts
   ```

2. Install dependencies:
   ```bash
   forge install
   ```

#### Usage

**Build Contracts:**

```bash
forge build
```

**Run Tests:**

```bash
forge test
```

**Deploy:**
To deploy to a network (e.g., Sepolia), set up your environment variables or pass them directly (not recommended for production keys).

```bash
forge script script/DeployAll.s.sol:DeployAll --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast
```

---

<a name="chinese"></a>

## 中文

### 概览

一个基于以太坊构建的去中心化 NFT 交易市场项目。该项目包含了一个完整的生态系统，包括自定义的 ERC20 支付代币、ERC721 NFT 系列以及核心的市场交易合约。用户可以铸造 NFT，将其上架出售，并使用 RCH 代币进行购买。

### 功能特性

- **NFT 交易市场 (`NFTMarket.sol`)**
  - **上架 (List)**: 卖家可以设定价格上架 NFT。
  - **购买 (Buy)**: 买家可以使用 RCH 代币购买已上架的 NFT。
  - **取消 (Cancel)**: 卖家可以随时取消当前的上架订单。
  - **安全性**: 实现了 `ReentrancyGuard` 防重入攻击保护。

- **ERC20 代币 (`RCH.sol`)**
  - 标准 ERC20 代币实现。
  - **名称**: Ruochen (RCH)。
  - **扩展功能**: 实现了 `transferWithCallback`，允许转账时触发接收合约的回调函数，提升交互体验。

- **ERC721 NFT (`Ruochen.sol`)**
  - 标准 ERC721 NFT 实现。
  - **名称**: Ruochen (RC)。
  - **元数据**: 支持为每个 Token 单独设置 URI 存储元数据。
  - **铸造**: 仅合约拥有者可进行铸造。

### 项目结构

```
contracts/
├── src/
│   ├── NFTMarket.sol   # 市场核心合约
│   ├── RCH.sol         # 支付代币合约
│   └── Ruochen.sol     # NFT 合约
├── script/
│   └── DeployAll.s.sol # 部署脚本
└── test/               # Foundry 测试文件
```

### 快速开始

#### 前置要求

- **Foundry**: 一个用 Rust 编写的极速、便携且模块化的以太坊开发工具包。
- **Git**

#### 安装

1. 克隆仓库：

   ```bash
   git clone https://github.com/iruochen/NFTMarket
   cd NFTMarket/contracts
   ```

2. 安装依赖：
   ```bash
   forge install
   ```

#### 使用说明

**编译合约:**

```bash
forge build
```

**运行测试:**

```bash
forge test
```

**部署合约:**
要部署到网络（例如 Sepolia），请配置环境变量或直接传入参数（注意保护私钥安全）。

```bash
forge script script/DeployAll.s.sol:DeployAll --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast
```

### 许可证 / License

MIT
