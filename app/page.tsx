'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface Wearable {
  id: string
  name: string
  emoji: string
}

interface Goal {
  id: string
  name: string
  unit: string
  icon: string
  default: number
}

interface Stake {
  id: string
  goal: string
  target: number
  amount: number
  days: number
  currentDay: number
  progress: number[]
  verified: boolean[]
  confidence: number
  yield: number
  wearable: string
}

interface Market {
  id: string
  owner: string
  desc: string
  goal: string
  yes: number
  no: number
  ends: string
  aura: number
}

const WEARABLES: Record<string, Wearable> = {
  oura: { id: 'oura', name: 'Oura Ring', emoji: '💍' },
  apple: { id: 'apple', name: 'Apple Watch', emoji: '⌚' },
  whoop: { id: 'whoop', name: 'WHOOP', emoji: '📿' },
  garmin: { id: 'garmin', name: 'Garmin', emoji: '⌚' },
  fitbit: { id: 'fitbit', name: 'Fitbit', emoji: '⌚' },
  samsung: { id: 'samsung', name: 'Samsung', emoji: '⌚' },
}

const GOALS: Record<string, Goal> = {
  steps: { id: 'steps', name: 'Steps', unit: 'steps', icon: '🏛️', default: 10000 },
  sleep: { id: 'sleep', name: 'Sleep', unit: 'hours', icon: '🌙', default: 7 },
  hrv: { id: 'hrv', name: 'HRV', unit: 'ms', icon: '💓', default: 50 },
  calories: { id: 'calories', name: 'Calories', unit: 'cal', icon: '🔥', default: 500 },
}

// ============================================================================
// COMPONENTS
// ============================================================================

const Laurel = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 22s-8-4-8-10c0-4 2-8 8-10 6 2 8 6 8 10 0 6-8 10-8 10z"/>
    <path d="M12 2v20M7 7c0 0 2 2 5 2M17 7c0 0-2 2-5 2M6 12c0 0 3 1 6 1M18 12c0 0-3 1-6 1"/>
  </svg>
)

const GlassCard = ({ 
  children, 
  className = "", 
  onClick 
}: { 
  children: React.ReactNode
  className?: string
  onClick?: () => void 
}) => (
  <div 
    onClick={onClick} 
    className={`glass-card rounded-2xl transition-all duration-300 ${onClick ? 'cursor-pointer btn-press' : ''} ${className}`}
  >
    {children}
  </div>
)

const GoldBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-50 border border-amber-200/60 text-amber-800 text-xs font-semibold rounded-full shadow-sm">
    {children}
  </span>
)

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  children 
}: { 
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode 
}) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl animate-slide-up safe-bottom">
        <div className="p-6 border-b border-stone-100 text-center">
          <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-stone-800">{title}</h2>
          {subtitle && <p className="text-sm text-stone-500 mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN APP
// ============================================================================

export default function AuraYield() {
  // Wallet
  const { publicKey, connected, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  
  // UI State
  const [activeTab, setActiveTab] = useState('home')
  const [showModal, setShowModal] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // User State
  const [wearables, setWearables] = useState<string[]>([])
  const [stats, setStats] = useState({ aura: 847, staked: 150, earned: 23.5, streak: 12, balance: 234.56 })
  
  // Form State
  const [newStake, setNewStake] = useState({ goal: 'steps', target: 10000, days: 7, amount: 50, wearable: '' })
  const [betAmount, setBetAmount] = useState(25)
  const [betSide, setBetSide] = useState<'yes' | 'no'>('yes')
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)
  
  // Data
  const [stakes, setStakes] = useState<Stake[]>([
    { 
      id: '1', goal: 'steps', target: 10000, amount: 50, days: 7, currentDay: 5,
      progress: [10234, 11456, 9876, 10543, 8901, 0, 0],
      verified: [true, true, true, true, false, false, false],
      confidence: 94, yield: 6.20, wearable: 'oura'
    },
  ])
  
  const [markets] = useState<Market[]>([
    { id: '1', owner: 'Aurelius.sol', desc: 'Complete 50K steps this week', goal: 'steps', yes: 340, no: 160, ends: '4d 12h', aura: 1247 },
    { id: '2', owner: 'Seneca.sol', desc: 'Maintain HRV above 55ms', goal: 'hrv', yes: 180, no: 120, ends: '2d 18h', aura: 2103 },
    { id: '3', owner: 'Maximus.sol', desc: 'Avg 8hr sleep for 7 days', goal: 'sleep', yes: 220, no: 280, ends: '5d 3h', aura: 892 },
  ])

  // Format wallet address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  // Connect wearable (mock OAuth)
  const connectWearable = async (id: string) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setWearables(prev => [...prev, id])
    if (!newStake.wearable) setNewStake(s => ({ ...s, wearable: id }))
    setLoading(false)
  }

  // Create stake
  const createStake = async () => {
    if (!newStake.wearable) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    
    const stake: Stake = {
      id: Date.now().toString(),
      goal: newStake.goal,
      target: newStake.target,
      amount: newStake.amount,
      days: newStake.days,
      currentDay: 1,
      progress: Array(newStake.days).fill(0),
      verified: Array(newStake.days).fill(false),
      confidence: 0,
      yield: newStake.amount * 0.12 * (newStake.days / 365),
      wearable: newStake.wearable
    }
    
    setStakes(prev => [stake, ...prev])
    setStats(s => ({ ...s, staked: s.staked + newStake.amount, balance: s.balance - newStake.amount }))
    setLoading(false)
    setShowModal(null)
  }

  // Place bet
  const placeBet = async () => {
    if (!selectedMarket) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setStats(s => ({ ...s, balance: s.balance - betAmount }))
    setLoading(false)
    setShowModal(null)
  }

  return (
    <div className="min-h-screen font-sans">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-amber-100/40 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-stone-200/60">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-200/50">
              <span className="text-lg">🏛️</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-stone-800 leading-none">AuraYield</h1>
              <p className="text-[8px] text-stone-400 uppercase tracking-[0.2em]">Fortuna Favet</p>
            </div>
          </div>
          
          {connected && publicKey ? (
            <div className="flex items-center gap-2">
              <GoldBadge>
                <span>◎</span> {stats.balance.toFixed(0)}
              </GoldBadge>
              <button 
                onClick={() => disconnect()}
                className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-medium text-stone-600 hover:bg-stone-200 transition-colors"
              >
                {formatAddress(publicKey.toBase58()).slice(0, 2)}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setVisible(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-amber-200/50 hover:shadow-amber-300/50 transition-all btn-press"
            >
              Connect
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-lg mx-auto px-4 pb-24 pt-6">
        {!connected ? (
          // Landing / Not Connected
          <div className="text-center pt-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200/50 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-100/50">
              <span className="text-4xl">🏛️</span>
            </div>
            
            <GoldBadge>
              <Laurel className="w-3 h-3" /> Built on Solana
            </GoldBadge>
            
            <h1 className="text-3xl font-light text-stone-800 mt-4 mb-1">
              Stake Your Health.
            </h1>
            <h2 className="text-3xl font-light">
              <span className="gold-text font-normal">Yield Your Wealth.</span>
            </h2>
            
            <p className="text-stone-500 text-sm mt-4 mb-8 max-w-xs mx-auto leading-relaxed">
              The ancients knew: greatness requires sacrifice. Stake coin on your virtues. 
              Prove your discipline. Earn your triumph.
            </p>

            <button 
              onClick={() => setVisible(true)}
              className="w-full max-w-xs py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-2xl shadow-xl shadow-amber-200/50 hover:shadow-amber-300/60 transition-all btn-press flex items-center justify-center gap-2"
            >
              <span>Enter the Arena</span>
              <span>→</span>
            </button>

            <div className="flex justify-center gap-3 mt-8">
              {Object.values(WEARABLES).map(w => (
                <div key={w.id} className="w-10 h-10 rounded-xl bg-white/80 border border-stone-200/60 flex items-center justify-center shadow-sm text-lg">
                  {w.emoji}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-stone-400 mt-2 uppercase tracking-wider">All Major Wearables Supported</p>
          </div>
        ) : activeTab === 'home' ? (
          // Home Tab
          <div className="space-y-6">
            {/* Aura Score Card */}
            <GlassCard className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Laurel className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Your Aura</span>
                  <Laurel className="w-4 h-4 text-amber-600 scale-x-[-1]" />
                </div>
                <div className="text-5xl font-light text-stone-800 tracking-tight">{stats.aura.toLocaleString()}</div>
                <p className="text-xs text-emerald-600 mt-1 font-medium">↑ 12% this week</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200/60 text-center">
                <div>
                  <p className="text-xl font-light text-stone-800">${stats.staked}</p>
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider">Staked</p>
                </div>
                <div>
                  <p className="text-xl font-light text-emerald-600">+${stats.earned}</p>
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider">Earned</p>
                </div>
                <div>
                  <p className="text-xl font-light text-stone-800">{stats.streak}d</p>
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider">Streak</p>
                </div>
              </div>
            </GlassCard>

            {/* Wearables / Stakes */}
            {wearables.length === 0 ? (
              <GlassCard className="p-6 text-center" onClick={() => setShowModal('wearable')}>
                <div className="w-14 h-14 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto mb-4 text-2xl">
                  ⌚
                </div>
                <h3 className="font-semibold text-stone-800 mb-1">Connect Your Oracle</h3>
                <p className="text-sm text-stone-500 mb-3">Link your wearable to begin</p>
                <span className="text-amber-600 text-sm font-semibold">Connect →</span>
              </GlassCard>
            ) : (
              <>
                {/* Connected wearables */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    {wearables.map(id => (
                      <span key={id} className="px-3 py-1.5 bg-white/80 border border-stone-200/60 rounded-full text-xs font-medium text-stone-600 shadow-sm">
                        {WEARABLES[id]?.emoji} {WEARABLES[id]?.name}
                      </span>
                    ))}
                    <button 
                      onClick={() => setShowModal('wearable')}
                      className="w-7 h-7 rounded-full bg-white/60 border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowModal('stake')}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-amber-200/40 btn-press"
                  >
                    + New Trial
                  </button>
                </div>

                {/* Active Stakes */}
                <div className="space-y-4">
                  <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Trials</h2>
                  
                  {stakes.length === 0 ? (
                    <GlassCard className="p-8 text-center" onClick={() => setShowModal('stake')}>
                      <div className="text-4xl mb-3">🏛️</div>
                      <h3 className="font-semibold text-stone-800 mb-2">No Active Trials</h3>
                      <p className="text-sm text-stone-500">Begin your first trial to prove your discipline</p>
                    </GlassCard>
                  ) : (
                    stakes.map(stake => (
                      <GlassCard key={stake.id} className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200/50 flex items-center justify-center text-xl">
                              {GOALS[stake.goal]?.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-stone-800">
                                {stake.target.toLocaleString()} {GOALS[stake.goal]?.unit}
                              </h3>
                              <p className="text-xs text-stone-500">
                                Day {stake.currentDay}/{stake.days} · {WEARABLES[stake.wearable]?.name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-emerald-600">+${stake.yield.toFixed(2)}</p>
                            <p className="text-[10px] text-stone-400">Projected</p>
                          </div>
                        </div>

                        {/* Progress dots */}
                        <div className="flex gap-1.5 mb-4">
                          {stake.progress.map((v, i) => {
                            const isFuture = i >= stake.currentDay
                            const met = v >= stake.target
                            const isToday = i === stake.currentDay - 1
                            
                            return (
                              <div 
                                key={i} 
                                className={`
                                  flex-1 h-9 rounded-lg flex items-center justify-center text-xs font-semibold transition-all
                                  ${isToday ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-white' : ''}
                                  ${isFuture 
                                    ? 'bg-stone-100 text-stone-300' 
                                    : met 
                                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-sm' 
                                      : v > 0 
                                        ? 'bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-sm' 
                                        : 'bg-stone-100 text-stone-400'}
                                `}
                              >
                                {isFuture ? '–' : met ? '✓' : v > 0 ? '✗' : '?'}
                              </div>
                            )
                          })}
                        </div>

                        <div className="flex justify-between text-xs pt-3 border-t border-stone-100">
                          <span className="text-stone-500">
                            Staked: <span className="text-stone-800 font-semibold">${stake.amount}</span>
                          </span>
                          <span className="text-stone-500">
                            AI Confidence: <span className="text-emerald-600 font-semibold">{stake.confidence}%</span>
                          </span>
                        </div>
                      </GlassCard>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        ) : activeTab === 'arena' ? (
          // Arena Tab - Prediction Markets
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-stone-800">The Arena</h2>
              <p className="text-xs text-stone-500">Wager on the trials of others</p>
            </div>

            {markets.map(market => {
              const total = market.yes + market.no
              const yesPct = Math.round((market.yes / total) * 100)
              const yesOdds = (total / market.yes).toFixed(2)
              const noOdds = (total / market.no).toFixed(2)

              return (
                <GlassCard key={market.id} className="p-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-stone-400">{market.owner}</span>
                    <GoldBadge>
                      <Laurel className="w-3 h-3" /> {market.aura}
                    </GoldBadge>
                  </div>
                  
                  <h3 className="font-semibold text-stone-800 mb-3">"{market.desc}"</h3>
                  
                  {/* Odds bar */}
                  <div className="h-2 rounded-full bg-stone-200 mb-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all" 
                      style={{ width: `${yesPct}%` }} 
                    />
                  </div>

                  {/* Bet buttons */}
                  <div className="flex gap-3 mb-3">
                    <button 
                      onClick={() => { setSelectedMarket(market); setBetSide('yes'); setShowModal('bet') }}
                      className="flex-1 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center hover:border-emerald-300 transition-colors btn-press"
                    >
                      <p className="text-lg font-semibold text-emerald-700">{yesPct}%</p>
                      <p className="text-[10px] text-emerald-600 uppercase">Yes · {yesOdds}×</p>
                    </button>
                    <button 
                      onClick={() => { setSelectedMarket(market); setBetSide('no'); setShowModal('bet') }}
                      className="flex-1 py-3 bg-rose-50 border border-rose-200 rounded-xl text-center hover:border-rose-300 transition-colors btn-press"
                    >
                      <p className="text-lg font-semibold text-rose-700">{100 - yesPct}%</p>
                      <p className="text-[10px] text-rose-600 uppercase">No · {noOdds}×</p>
                    </button>
                  </div>

                  <div className="flex justify-between text-xs text-stone-500">
                    <span>${total} pool</span>
                    <span>{market.ends}</span>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        ) : (
          // Rank Tab - Leaderboard
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-stone-800">Hall of Champions</h2>
              <p className="text-xs text-stone-500">Those who have proven their virtue</p>
            </div>

            <GlassCard className="overflow-hidden">
              {[
                { rank: 1, name: 'MarcusAurelius.sol', aura: 2847, medal: '🥇' },
                { rank: 2, name: 'Seneca.sol', aura: 2103, medal: '🥈' },
                { rank: 3, name: 'Epictetus.sol', aura: 1892, medal: '🥉' },
                { rank: 4, name: publicKey ? formatAddress(publicKey.toBase58()) : 'You', aura: stats.aura, isYou: true },
                { rank: 5, name: 'Cicero.sol', aura: 654 },
              ].sort((a, b) => b.aura - a.aura).map((user, i) => (
                <div 
                  key={user.name}
                  className={`flex items-center gap-3 p-4 border-b border-stone-100 last:border-0 ${user.isYou ? 'bg-amber-50/50' : ''}`}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    ${i === 0 ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-lg' :
                      i === 1 ? 'bg-gradient-to-br from-stone-300 to-stone-400 text-white' :
                      i === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-white' :
                      'bg-stone-100 text-stone-500 border border-stone-200'}
                  `}>
                    {user.medal || i + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${user.isYou ? 'text-amber-700' : 'text-stone-800'}`}>
                      {user.name}
                      {user.isYou && <span className="text-xs font-normal text-stone-500 ml-1">(You)</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Laurel className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-stone-800">{user.aura.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </GlassCard>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      {connected && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-stone-200/60 safe-bottom">
          <div className="max-w-lg mx-auto flex">
            {[
              { id: 'home', icon: '🏛️', label: 'Home' },
              { id: 'arena', icon: '⚔️', label: 'Arena' },
              { id: 'rank', icon: '🏆', label: 'Rank' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? 'text-amber-700' : 'text-stone-400'}`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 w-8 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Connect Wearable Modal */}
      <Modal 
        isOpen={showModal === 'wearable'} 
        onClose={() => setShowModal(null)}
        title="Connect Your Oracle"
        subtitle="Choose your source of truth"
      >
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {Object.values(WEARABLES).map(w => {
            const isConnected = wearables.includes(w.id)
            return (
              <button
                key={w.id}
                onClick={() => !isConnected && connectWearable(w.id)}
                disabled={isConnected || loading}
                className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all btn-press ${
                  isConnected ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-stone-200 hover:border-stone-300'
                } ${loading ? 'opacity-50' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-2xl">
                  {w.emoji}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-stone-800">{w.name}</p>
                  <p className="text-xs text-stone-500">Sync health data</p>
                </div>
                {isConnected ? (
                  <span className="text-emerald-600 text-sm font-medium">✓</span>
                ) : (
                  <span className="text-stone-400">→</span>
                )}
              </button>
            )
          })}
        </div>
        <div className="p-4 border-t border-stone-100">
          <button onClick={() => setShowModal(null)} className="w-full py-3 text-stone-600 font-medium">
            Done
          </button>
        </div>
      </Modal>

      {/* Create Stake Modal */}
      <Modal
        isOpen={showModal === 'stake'}
        onClose={() => setShowModal(null)}
        title="Begin New Trial"
      >
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Goal Type */}
          <div className="grid grid-cols-2 gap-3">
            {Object.values(GOALS).map(g => (
              <button
                key={g.id}
                onClick={() => setNewStake(s => ({ ...s, goal: g.id, target: g.default }))}
                className={`p-4 rounded-2xl border text-left transition-all btn-press ${
                  newStake.goal === g.id ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-200' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <span className="text-2xl">{g.icon}</span>
                <p className="font-semibold text-stone-800 mt-1">{g.name}</p>
                <p className="text-xs text-stone-500">{g.default.toLocaleString()} {g.unit}</p>
              </button>
            ))}
          </div>

          {/* Target */}
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-wider block mb-2">Daily Target</label>
            <input
              type="number"
              value={newStake.target}
              onChange={e => setNewStake(s => ({ ...s, target: +e.target.value }))}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
            />
          </div>

          {/* Duration */}
          <div className="flex gap-2">
            {[7, 14, 21, 30].map(d => (
              <button
                key={d}
                onClick={() => setNewStake(s => ({ ...s, days: d }))}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all btn-press ${
                  newStake.days === d 
                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                    : 'bg-stone-50 border border-stone-200 text-stone-600'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-wider block mb-2">Stake (USDC)</label>
            <input
              type="number"
              value={newStake.amount}
              onChange={e => setNewStake(s => ({ ...s, amount: Math.max(1, Math.min(500, +e.target.value)) }))}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
            />
          </div>

          {/* Wearable */}
          <div className="flex flex-wrap gap-2">
            {wearables.map(id => (
              <button
                key={id}
                onClick={() => setNewStake(s => ({ ...s, wearable: id }))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all btn-press ${
                  newStake.wearable === id 
                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                    : 'bg-stone-50 border border-stone-200 text-stone-600'
                }`}
              >
                {WEARABLES[id]?.emoji} {WEARABLES[id]?.name}
              </button>
            ))}
          </div>

          {/* Risk */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            ⚠️ Failure forfeits 20% (${(newStake.amount * 0.2).toFixed(0)}) to the treasury
          </div>
        </div>
        <div className="p-4 border-t border-stone-100">
          <button
            onClick={createStake}
            disabled={loading || !newStake.wearable}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-2xl disabled:opacity-50 btn-press"
          >
            {loading ? 'Creating...' : 'Begin Trial →'}
          </button>
        </div>
      </Modal>

      {/* Place Bet Modal */}
      <Modal
        isOpen={showModal === 'bet'}
        onClose={() => setShowModal(null)}
        title={selectedMarket ? `"${selectedMarket.desc}"` : 'Place Bet'}
        subtitle={selectedMarket?.owner}
      >
        <div className="p-6 space-y-5">
          {/* Side */}
          <div className="flex gap-3">
            <button
              onClick={() => setBetSide('yes')}
              className={`flex-1 py-4 rounded-2xl border-2 font-semibold transition-all btn-press ${
                betSide === 'yes' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'border-stone-200 text-stone-500'
              }`}
            >
              ✓ YES
            </button>
            <button
              onClick={() => setBetSide('no')}
              className={`flex-1 py-4 rounded-2xl border-2 font-semibold transition-all btn-press ${
                betSide === 'no' ? 'bg-rose-50 border-rose-400 text-rose-700' : 'border-stone-200 text-stone-500'
              }`}
            >
              ✗ NO
            </button>
          </div>

          {/* Amount */}
          <input
            type="number"
            value={betAmount}
            onChange={e => setBetAmount(Math.max(1, +e.target.value))}
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
          <div className="flex gap-2">
            {[10, 25, 50, 100].map(a => (
              <button
                key={a}
                onClick={() => setBetAmount(a)}
                className="flex-1 py-2 bg-stone-100 rounded-lg text-sm text-stone-600 hover:bg-stone-200 transition-colors btn-press"
              >
                ${a}
              </button>
            ))}
          </div>

          {/* Payout */}
          {selectedMarket && (
            <div className="p-4 bg-stone-50 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Potential Payout</span>
                <span className="font-semibold text-stone-800">
                  ${(betAmount * (selectedMarket.yes + selectedMarket.no) / (betSide === 'yes' ? selectedMarket.yes : selectedMarket.no)).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-stone-100">
          <button
            onClick={placeBet}
            disabled={loading}
            className={`w-full py-4 font-semibold rounded-2xl btn-press ${
              betSide === 'yes' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}
          >
            {loading ? 'Placing...' : `Wager $${betAmount} on ${betSide.toUpperCase()}`}
          </button>
        </div>
      </Modal>
    </div>
  )
}
