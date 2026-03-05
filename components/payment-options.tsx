"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Wallet, Check } from "lucide-react"

export function PaymentOptions() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card")
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    amount: "",
  })
  const [cryptoData, setCryptoData] = useState({
    network: "ethereum",
    address: "",
    amount: "",
    currency: "ETH",
  })
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Card payment:", cardData)
    setPaymentSuccess(true)
    setTimeout(() => setPaymentSuccess(false), 3000)
  }

  const handleCryptoPayment = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Crypto payment:", cryptoData)
    setPaymentSuccess(true)
    setTimeout(() => setPaymentSuccess(false), 3000)
  }

  return (
    <section id="pagos" className="py-20 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Opciones de Pago</h2>
          <p className="text-lg text-muted-foreground">Realiza pagos anticipados de forma fácil y segura</p>
        </motion.div>

        {/* Payment Method Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setPaymentMethod("card")}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              paymentMethod === "card"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card text-card-foreground hover:bg-muted"
            }`}
          >
            <CreditCard className="w-5 h-5" />
            Tarjeta de Débito/Crédito
          </button>
          <button
            onClick={() => setPaymentMethod("crypto")}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              paymentMethod === "crypto"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card text-card-foreground hover:bg-muted"
            }`}
          >
            <Wallet className="w-5 h-5" />
            Criptomonedas
          </button>
        </div>

        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <p className="text-green-800 dark:text-green-200 font-semibold">
              ¡Pago procesado exitosamente! (Simulación)
            </p>
          </motion.div>
        )}

        {/* Card Payment Form */}
        {paymentMethod === "card" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-xl shadow-lg p-8"
          >
            <h3 className="text-xl font-bold text-card-foreground mb-6">Pago con Tarjeta</h3>
            <form onSubmit={handleCardPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Número de Tarjeta</label>
                <input
                  type="text"
                  value={cardData.cardNumber}
                  onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Fecha de Expiración</label>
                  <input
                    type="text"
                    value={cardData.expiryDate}
                    onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                    placeholder="MM/AA"
                    maxLength={5}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">CVV</label>
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    placeholder="123"
                    maxLength={4}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nombre del Titular</label>
                <input
                  type="text"
                  value={cardData.cardholderName}
                  onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value })}
                  placeholder="JUAN PEREZ"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Monto a Pagar (MXN)</label>
                <input
                  type="number"
                  value={cardData.amount}
                  onChange={(e) => setCardData({ ...cardData, amount: e.target.value })}
                  placeholder="5000"
                  min="1"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Procesar Pago
              </button>
            </form>
          </motion.div>
        )}

        {/* Crypto Payment Form */}
        {paymentMethod === "crypto" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-xl shadow-lg p-8"
          >
            <h3 className="text-xl font-bold text-card-foreground mb-6">Pago con Criptomonedas</h3>
            <form onSubmit={handleCryptoPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Red Blockchain</label>
                <select
                  value={cryptoData.network}
                  onChange={(e) => setCryptoData({ ...cryptoData, network: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                >
                  <option value="ethereum">Ethereum (ERC-20)</option>
                  <option value="bsc">Binance Smart Chain (BEP-20)</option>
                  <option value="polygon">Polygon (MATIC)</option>
                  <option value="bitcoin">Bitcoin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Dirección de Destino</label>
                <input
                  type="text"
                  value={cryptoData.address}
                  onChange={(e) => setCryptoData({ ...cryptoData, address: e.target.value })}
                  placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Criptomoneda</label>
                  <select
                    value={cryptoData.currency}
                    onChange={(e) => setCryptoData({ ...cryptoData, currency: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                  >
                    <option value="ETH">ETH - Ethereum</option>
                    <option value="USDT">USDT - Tether</option>
                    <option value="BTC">BTC - Bitcoin</option>
                    <option value="BNB">BNB - Binance Coin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Cantidad</label>
                  <input
                    type="number"
                    value={cryptoData.amount}
                    onChange={(e) => setCryptoData({ ...cryptoData, amount: e.target.value })}
                    placeholder="0.025"
                    step="0.000001"
                    min="0"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Nota:</strong> Verifica cuidadosamente la dirección y la red antes de enviar. Las
                  transacciones en blockchain son irreversibles.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Procesar Pago Cripto
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  )
}
