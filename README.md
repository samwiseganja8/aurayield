# 🏛️ AuraYield

> **Stake Your Health. Yield Your Wealth.**

DeFi-wellness protocol on Solana. Stake crypto on health goals verified by AI. Succeed and earn yield.

![AuraYield](https://img.shields.io/badge/Solana-362D59?style=for-the-badge&logo=solana&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

- **🎯 Health Goal Staking** - Stake USDC on steps, sleep, HRV, or calorie goals
- **🤖 AI Verification** - Claude AI validates wearable data to prevent cheating
- **⚔️ Prediction Markets** - Bet on whether others will achieve their goals
- **🏆 Aura Score** - On-chain reputation that grows with consistency
- **⌚ Multi-Wearable** - Supports Oura, Apple Watch, WHOOP, Garmin, Fitbit, Samsung

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/yourusername/aurayield.git
cd aurayield

# Install
npm install

# Configure
cp .env.example .env.local

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your wallet browser (Phantom, Backpack, Solflare).

## 📱 Designed for Wallet Browsers

AuraYield is a mobile-first web app optimized for opening inside crypto wallet apps:

- **Phantom** - iOS/Android
- **Backpack** - iOS/Android  
- **Solflare** - iOS/Android

No app store needed. No Apple/Google restrictions.

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Wallet**: Solana Wallet Adapter
- **Chain**: Solana (Devnet → Mainnet)
- **Design**: Roman/Greek aesthetic with glass morphism

## 📁 Project Structure

```
aurayield/
├── app/
│   ├── globals.css      # Tailwind + custom styles
│   ├── layout.tsx       # Root layout with wallet provider
│   ├── page.tsx         # Main app component
│   └── providers/
│       └── WalletProvider.tsx
├── public/
│   ├── favicon.ico
│   └── manifest.json
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 Configuration

Create `.env.local`:

```bash
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

## 🚢 Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/aurayield)

Or manually:

```bash
npm i -g vercel
vercel
```

### Other Platforms

Works with any platform that supports Next.js:
- Netlify
- Railway
- Render

## 🗺️ Roadmap

- [x] Core UI with Roman aesthetic
- [x] Wallet connection (Phantom, Backpack, Solflare)
- [x] Stake creation flow
- [x] Prediction markets UI
- [x] Leaderboard
- [ ] Oura OAuth integration
- [ ] Apple HealthKit bridge
- [ ] Smart contract deployment
- [ ] AI verification backend
- [ ] Mainnet launch

## 🤝 Contributing

PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT - see [LICENSE](LICENSE)

## 🔗 Links

- **Website**: [aurayield.xyz](https://aurayield.xyz)
- **Twitter**: [@AuraYield](https://twitter.com/AuraYield)
- **Discord**: Coming soon

---

<p align="center">
  <strong>Fortuna Favet Fortibus</strong><br>
  <em>Fortune Favors the Bold</em>
</p>
