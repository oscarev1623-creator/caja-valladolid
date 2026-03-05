"use client"

import { motion } from "framer-motion"
import { Building2, Target, Eye, ShieldCheck, Users, ExternalLink, Shield, MapPin, Navigation, Clock } from "lucide-react"

export function AboutUs() {
  return (
    <section id="quienes-somos" className="py-20 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-foreground mb-4">Quiénes Somos</h2>
          <p className="text-lg text-muted-foreground">Una institución comprometida con tu bienestar financiero</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <ShieldCheck className="w-12 h-12" />
            <h3 className="text-3xl font-bold">Sin Consulta a Buró de Crédito</h3>
          </div>
          <p className="text-center text-lg leading-relaxed max-w-3xl mx-auto">
            En Caja Valladolid, creemos en segundas oportunidades. Tu historial crediticio no define tu futuro. No
            consultamos el Buró de Crédito, por lo que problemas financieros pasados no serán un obstáculo para obtener
            el crédito que necesitas. Todos merecen una oportunidad para crecer y prosperar.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-card rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-card-foreground mb-4">Razón Social</h3>
              <p className="text-card-foreground mb-2 text-lg">
                <strong>Caja Popular San Bernardino de Siena Valladolid</strong>
              </p>
              <p className="text-muted-foreground mb-6">S.C. de A.P. de R.L. de C.V. • Registro: 29198</p>
              
              {/* Botón CONDUSEF */}
              <a
                href="https://webapps.condusef.gob.mx/SIPRES_N/jsp/home_publico.jsp?idins=4930"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group mb-4"
              >
                <Shield className="w-5 h-5" />
                <span>Ver registro en CONDUSEF</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <p className="text-sm text-muted-foreground">
                <Shield className="w-4 h-4 inline mr-2 text-green-500" />
                Institución regulada y supervisada por la CONDUSEF
              </p>
            </div>
            
            {/* LOGO CONDUSEF */}
            <div className="md:w-1/3 flex flex-col items-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
              <div className="text-center w-full">
                <div className="mb-4 p-2">
                  <img 
                    src="/condusef-logo.png" 
                    alt="Logo CONDUSEF" 
                    className="w-56 h-auto mx-auto"
                  />
                </div>
                
                <div className="text-yellow-800 font-bold text-lg">CONDUSEF</div>
                <div className="text-yellow-700 text-sm mt-1">Comisión Nacional para la Protección</div>
                <div className="text-yellow-700 text-sm">y Defensa de los Usuarios</div>
                <div className="text-xs text-yellow-600 mt-3 bg-yellow-100 px-3 py-1 rounded-full">
                  ID de Institución: 4930
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Users className="w-10 h-10 text-primary" />
            <h3 className="text-2xl font-bold text-card-foreground">Experiencia Humana y Real</h3>
          </div>
          <p className="text-card-foreground leading-relaxed mb-4">
            No somos un proceso automatizado. Cada solicitud es revisada por un asesor financiero real que te acompañará
            desde el primer contacto hasta la aprobación de tu crédito.
          </p>
          <p className="text-card-foreground leading-relaxed">
            Creemos en relaciones genuinas, transparencia total y un servicio que coloca tu bienestar financiero en el
            centro de todo. Por eso usamos un proceso en dos etapas: primero te conocemos, luego evaluamos juntos.
          </p>
        </motion.div>

        {/* 📍 SECCIÓN DE UBICACIÓN CON MAPA REAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 border border-blue-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-8 h-8 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Nuestra Ubicación</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dirección y botón */}
            <div className="flex flex-col justify-center">
              <p className="text-lg text-gray-800 mb-2 font-medium">
                Calle 40 #204B x 41 y 43
              </p>
              <p className="text-lg text-gray-800 mb-2">
                Col. Centro, Valladolid, Yucatán
              </p>
              <p className="text-gray-600 mb-6">
                C.P. 97780
              </p>
              
              <a
                href="https://www.seccionamarilla.com.mx/mapas/como-llegar/caja-popular-san-bernardino-de-siena-valladolid/casas-de-bolsa/yuc/valladolid/412419645"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group text-lg"
              >
                <Navigation className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span>Cómo llegar</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            {/* 🗺️ MAPA REAL DE GOOGLE MAPS */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 h-64 md:h-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!4v1771341996021!6m8!1m7!1s4kwa5DwfnIhdUFhz6nG86Q!2m2!1d20.68968110511916!2d-88.20497256455387!3f267.05122819800255!4f1.7441493766623068!5f0.7820865974627469"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[250px]"
              ></iframe>
            </div>
          </div>
          
          {/* Horario de atención */}
          <div className="mt-6 flex items-center gap-4 text-sm text-gray-600 bg-white bg-opacity-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span><strong>Horario:</strong> Lun-Vie: 9:00 - 18:00, Sáb: 9:00 - 14:00</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl shadow-lg p-8"
          >
            <Target className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold text-card-foreground mb-4">Misión</h3>
            <p className="text-card-foreground leading-relaxed">
              Brindar créditos claros, confiables y rápidos que mejoren la calidad de vida de las personas, con
              transparencia y compromiso social.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl shadow-lg p-8"
          >
            <Eye className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold text-card-foreground mb-4">Visión</h3>
            <p className="text-card-foreground leading-relaxed">
              Ser la financiera líder en soluciones accesibles y transparentes, reconocida por la confianza y
              satisfacción de nuestros clientes.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}