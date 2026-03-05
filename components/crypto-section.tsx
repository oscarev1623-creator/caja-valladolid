"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Calculator } from "lucide-react"

interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change24h: number
}

export function CryptoSection() {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([
    { symbol: "USDT", name: "Tether", price: 20.5, change24h: 0.1 },
    { symbol: "ETH", name: "Ethereum", price: 55000, change24h: 2.3 },
    { symbol: "BTC", name: "Bitcoin", price: 1800000, change24h: 1.8 },
    { symbol: "BNB", name: "Binance Coin", price: 12000, change24h: -0.5 },
  ])

  const [loanAmount, setLoanAmount] = useState<number>(100000)

  const formatMXN = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value)

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-foreground mb-4">Créditos en Criptomonedas</h2>
          <p className="text-lg text-muted-foreground">
            Financia tus proyectos con las principales criptomonedas del mercado
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cryptoPrices.map((crypto, index) => (
            <motion.div
              key={crypto.symbol}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-card-foreground">{crypto.symbol}</h3>
                  <p className="text-sm text-muted-foreground">{crypto.name}</p>
                </div>
                <span className={`text-sm font-semibold ${crypto.change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {crypto.change24h >= 0 ? "+" : ""}
                  {crypto.change24h}%
                </span>
              </div>
              <p className="text-xl font-bold text-primary mb-2">{formatMXN(crypto.price)}</p>
              <p className="text-sm text-muted-foreground">
                Equivalente: {(loanAmount / crypto.price).toFixed(4)} {crypto.symbol}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-card rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold text-card-foreground">Calculadora de Conversión</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Monto en MXN</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
              />
            </div>
            <div className="flex items-end">
              <div className="w-full">
                <p className="text-sm text-muted-foreground mb-2">Equivalentes en cripto</p>
                <div className="space-y-2">
                  {cryptoPrices.map((crypto) => (
                    <p key={crypto.symbol} className="text-sm text-card-foreground">
                      <span className="font-semibold">{crypto.symbol}:</span> {(loanAmount / crypto.price).toFixed(6)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
