# Frontend | 前端

[English](#english) | [中文](#中文)

## English

Modern NFT Marketplace frontend built with Next.js, TypeScript, and Web3 technologies.

### 🚀 Features

- **Modern UI/UX**: Clean and responsive design built with Tailwind CSS
- **Web3 Integration**: Seamless wallet connection using Reown AppKit (Web3Modal)
- **NFT Management**: Mint, list, buy, and manage NFTs
- **Multi-chain Support**: Support for Sepolia testnet and localhost development
- **Real-time Updates**: Dynamic marketplace data with automatic refreshing
- **Token Management**: RCH token approval and balance tracking
- **Responsive Design**: Mobile-first approach with desktop optimization

### 🛠 Tech Stack

**Framework & Libraries:**
- [Next.js 16.1.3](https://nextjs.org/) - React framework with App Router
- [React 19.2.3](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework

**Web3 Stack:**
- [Wagmi 3.3.2](https://wagmi.sh/) - React hooks for Ethereum
- [Viem 2.44.4](https://viem.sh/) - TypeScript interface for Ethereum
- [Reown AppKit 1.8.16](https://reown.com/appkit) - Wallet connection (formerly Web3Modal)

**State Management & Utils:**
- [TanStack Query 5.90.19](https://tanstack.com/query) - Data fetching and caching
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [clsx](https://github.com/lukeed/clsx) - Conditional classNames utility

### 📦 Project Structure

```
src/
├── app/                # Next.js App Router
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ListNFTModal.tsx    # NFT listing modal
│   ├── Modal.tsx           # Base modal component
│   ├── Navbar.tsx          # Navigation bar
│   └── NFTCard.tsx         # NFT display card
├── config/            # Configuration files
│   └── index.tsx      # Wagmi and Web3 config
├── context/           # React context providers
│   └── ContextProvider.tsx # Web3 context setup
├── contracts/         # Contract ABIs and addresses
│   ├── NFTMarket.json
│   ├── RCH.json
│   └── Ruochen.json
├── hooks/            # Custom React hooks
│   ├── useMarketActions.ts # Marketplace write operations
│   ├── useMarketplace.ts   # Marketplace read operations
│   └── useNFTs.ts         # NFT-related operations
├── lib/              # Utility functions
│   └── utils.ts      # Helper utilities
└── constants.ts      # Contract addresses and constants
```

### 🚀 Getting Started

#### Prerequisites

- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- pnpm package manager
- Web3 wallet (MetaMask, WalletConnect compatible wallets)

#### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
```

#### Environment Configuration

Create `.env.local` file with the following variables:

```env
# Required: Reown AppKit Project ID
# Get from: https://cloud.reown.com
NEXT_PUBLIC_PROJECT_ID=your_project_id_here

# Optional: RPC URLs for better performance
NEXT_PUBLIC_SEPOLIA_RPC_URL=your_sepolia_rpc_url
NEXT_PUBLIC_LOCAL_RPC_URL=http://localhost:8545
```

#### Development

```bash
# Start development server
pnpm dev

# Open http://localhost:3000 in your browser
```

#### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### 📋 Key Components

#### Navbar
- Wallet connection/disconnection
- RCH token balance display
- Token approval for marketplace
- Network switching

#### NFTCard
- NFT metadata display
- Price information
- Buy/Cancel listing actions
- Owner information

#### ListNFTModal
- NFT approval for marketplace
- Listing price input
- Transaction status tracking

### 🔧 Custom Hooks

#### useMarketplace
- Fetches all marketplace listings
- Handles listing data processing
- Provides refresh functionality

#### useMarketActions
- Handles listing creation
- Manages NFT purchases
- Processes listing cancellations

#### useNFTs
- Fetches user's NFT collection
- Handles NFT metadata
- Manages NFT approval status

### 🌐 Supported Networks

- **Sepolia Testnet** (Chain ID: 11155111)
- **Localhost** (Chain ID: 1337) - For development

### 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1536px+)

### 🔗 Contract Integration

The frontend integrates with three main contracts:

1. **NFT Market Contract**: Marketplace operations
2. **RCH Token Contract**: Payment token management
3. **Ruochen NFT Contract**: NFT minting and management

Contract addresses are automatically loaded from deployment files in the `contracts/deployments/` directory.

### 🎨 Styling

- **Tailwind CSS 4**: Utility-first styling approach
- **CSS Custom Properties**: For theme customization
- **Mobile-first**: Responsive design principles
- **Dark Mode Ready**: Prepared for dark mode implementation

### 📄 License

MIT License

---

## 中文

使用 Next.js、TypeScript 和 Web3 技术构建的现代 NFT 市场前端。

### 🚀 功能特性

- **现代化 UI/UX**: 使用 Tailwind CSS 构建的简洁响应式设计
- **Web3 集成**: 使用 Reown AppKit (Web3Modal) 无缝钱包连接
- **NFT 管理**: 铸造、上架、购买和管理 NFT
- **多链支持**: 支持 Sepolia 测试网和本地开发环境
- **实时更新**: 动态市场数据自动刷新
- **代币管理**: RCH 代币授权和余额跟踪
- **响应式设计**: 移动端优先，桌面端优化

### 🛠 技术栈

**框架和库:**
- [Next.js 16.1.3](https://nextjs.org/) - 带有 App Router 的 React 框架
- [React 19.2.3](https://react.dev/) - UI 库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS 4](https://tailwindcss.com/) - 实用工具优先的 CSS 框架

**Web3 技术栈:**
- [Wagmi 3.3.2](https://wagmi.sh/) - 以太坊 React hooks
- [Viem 2.44.4](https://viem.sh/) - 以太坊 TypeScript 接口
- [Reown AppKit 1.8.16](https://reown.com/appkit) - 钱包连接（原 Web3Modal）

**状态管理和工具:**
- [TanStack Query 5.90.19](https://tanstack.com/query) - 数据获取和缓存
- [Lucide React](https://lucide.dev/) - 精美图标
- [clsx](https://github.com/lukeed/clsx) - 条件 className 工具

### 📦 项目结构

```
src/
├── app/                # Next.js App Router (应用路由)
│   ├── globals.css     # 全局样式
│   ├── layout.tsx      # 根布局
│   └── page.tsx        # 首页
├── components/         # React 组件
│   ├── ListNFTModal.tsx    # NFT 上架模态框
│   ├── Modal.tsx           # 基础模态框组件
│   ├── Navbar.tsx          # 导航栏
│   └── NFTCard.tsx         # NFT 展示卡片
├── config/            # 配置文件
│   └── index.tsx      # Wagmi 和 Web3 配置
├── context/           # React 上下文提供者
│   └── ContextProvider.tsx # Web3 上下文设置
├── contracts/         # 合约 ABI 和地址
│   ├── NFTMarket.json
│   ├── RCH.json
│   └── Ruochen.json
├── hooks/            # 自定义 React hooks
│   ├── useMarketActions.ts # 市场写入操作
│   ├── useMarketplace.ts   # 市场读取操作
│   └── useNFTs.ts         # NFT 相关操作
├── lib/              # 工具函数
│   └── utils.ts      # 助手工具
└── constants.ts      # 合约地址和常量
```

### 🚀 快速开始

#### 前置要求

- Node.js 18+（推荐使用 [nvm](https://github.com/nvm-sh/nvm)）
- pnpm 包管理器
- Web3 钱包（MetaMask，支持 WalletConnect 的钱包）

#### 安装

```bash
# 安装依赖
pnpm install

# 复制环境变量
cp .env.example .env.local
```

#### 环境配置

创建 `.env.local` 文件并配置以下变量：

```env
# 必需：Reown AppKit 项目 ID
# 获取地址：https://cloud.reown.com
NEXT_PUBLIC_PROJECT_ID=your_project_id_here

# 可选：RPC URLs 以获得更好性能
NEXT_PUBLIC_SEPOLIA_RPC_URL=your_sepolia_rpc_url
NEXT_PUBLIC_LOCAL_RPC_URL=http://localhost:8545
```

#### 开发

```bash
# 启动开发服务器
pnpm dev

# 在浏览器中打开 http://localhost:3000
```

#### 生产构建

```bash
# 生产环境构建
pnpm build

# 启动生产服务器
pnpm start
```

### 📋 关键组件

#### Navbar（导航栏）
- 钱包连接/断开
- RCH 代币余额显示
- 市场代币授权
- 网络切换

#### NFTCard（NFT 卡片）
- NFT 元数据显示
- 价格信息
- 购买/取消上架操作
- 所有者信息

#### ListNFTModal（上架 NFT 模态框）
- 市场 NFT 授权
- 上架价格输入
- 交易状态跟踪

### 🔧 自定义 Hooks

#### useMarketplace
- 获取所有市场上架信息
- 处理上架数据逻辑
- 提供刷新功能

#### useMarketActions
- 处理上架创建
- 管理 NFT 购买
- 处理上架取消

#### useNFTs
- 获取用户的 NFT 集合
- 处理 NFT 元数据
- 管理 NFT 授权状态

### 🌐 支持的网络

- **Sepolia 测试网**（链 ID: 11155111）
- **本地网络**（链 ID: 1337）- 用于开发

### 📱 响应式设计

应用程序完全支持响应式，并针对以下设备进行了优化：
- 移动端 (320px+)
- 平板端 (768px+)
- 桌面端 (1024px+)
- 大屏显示器 (1536px+)

### 🔗 合约集成

前端与三个主要合约集成：

1. **NFT Market Contract**: 市场交易操作
2. **RCH Token Contract**: 支付代币管理
3. **Ruochen NFT Contract**: NFT 铸造和管理

合约地址从 `contracts/deployments/` 目录下的部署文件中自动加载。

### 🎨 样式设计

- **Tailwind CSS 4**: 实用工具优先的样式方案
- **CSS 自定义属性**: 用于主题定制
- **移动端优先**: 响应式设计原则
- **深色模式就绪**: 为深色模式实现做好了准备

### 📄 许可证

MIT License
