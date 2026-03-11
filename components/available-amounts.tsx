"use client"

import { motion } from "framer-motion"
import { DollarSign } from "lucide-react"

export function AvailableAmounts() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl mb-4 sm:mb-6"
          >
            <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
            Montos Disponibles
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Ofrecemos financiamiento flexible para tus necesidades
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl shadow-xl p-8 sm:p-12 border border-border/50 text-center"
        >
          <div className="mb-8">
            <p className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary mb-4">2.500 USD - 1.000,000 USD</p>
            <p className="text-xl sm:text-2xl text-muted-foreground">(o equivalente en criptomonedas)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Créditos Tradicionales</h3>
              <p className="text-sm text-muted-foreground">Pagos en MXN con tasa del 11% anual</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Créditos Cripto</h3>
              <p className="text-sm text-muted-foreground">Pagos en USD/Crypto con tasa del 5.4% anual</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Nota:</strong> Los montos son referenciales. Usa nuestras calculadoras para ver opciones
              específicas según tu necesidad.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
