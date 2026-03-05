"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Upload,
  User,
  Briefcase,
  DollarSign,
  Target,
  Loader2,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react"

export function FormalEvaluationForm() {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    // Financial Information
    monthlyIncome: "",
    employmentType: "",
    companyName: "",
    yearsEmployed: "",
    otherIncome: "",
    // Credit Details
    requestedAmount: "",
    loanPurpose: "",
    paymentTerm: "",
    creditType: "traditional",
    // Crypto Specific
    projectDescription: "",
  })

  const [files, setFiles] = useState({
    governmentId: null as File | null,
    proofOfAddress: null as File | null,
    bankStatements: null as File | null,
    additionalDocs: null as File | null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [fieldName]: e.target.files[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-xl shadow-lg p-12 text-center"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-card-foreground mb-4">Evaluación Enviada con Éxito</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Hemos recibido tu solicitud completa de crédito. Nuestro equipo la revisará en los próximos 2-3 días
            hábiles.
          </p>
          <p className="text-sm text-muted-foreground">
            Te contactaremos por teléfono o correo electrónico con la resolución.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-8">
          <div className="flex items-center gap-4 mb-4">
            <FileText className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Evaluación Formal de Crédito</h1>
          </div>
          <p className="text-white/90 text-lg">
            Completa este formulario detallado para que podamos realizar una evaluación completa de tu solicitud.
          </p>
        </div>

        {/* Trust Banners */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Protección de Datos</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Toda tu información está protegida con encriptación de nivel bancario y será utilizada únicamente para
                la evaluación de tu crédito.
              </p>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-green-900 dark:text-green-100 mb-1">Sin Buró de Crédito</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                No consultamos el Buró de Crédito. Tu historial no afectará tu solicitud.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Personal Information Section */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-card-foreground">Información Personal</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Fecha de Nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Dirección Completa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ciudad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Estado <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Código Postal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Financial Information Section */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
              <Briefcase className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-card-foreground">Información Financiera</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ingreso Mensual <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  required
                  placeholder="$"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tipo de Empleo <span className="text-red-500">*</span>
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                >
                  <option value="">Selecciona...</option>
                  <option value="asalariado">Empleado Asalariado</option>
                  <option value="independiente">Trabajador Independiente</option>
                  <option value="empresario">Empresario</option>
                  <option value="jubilado">Jubilado/Pensionado</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nombre de la Empresa/Negocio</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Años en el Empleo Actual</label>
                <input
                  type="number"
                  name="yearsEmployed"
                  value={formData.yearsEmployed}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Otros Ingresos (Opcional)</label>
                <input
                  type="text"
                  name="otherIncome"
                  value={formData.otherIncome}
                  onChange={handleChange}
                  placeholder="Ej: Rentas, inversiones, otros trabajos..."
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Credit Details Section */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
              <DollarSign className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-card-foreground">Detalles del Crédito</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Monto Solicitado <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="requestedAmount"
                  value={formData.requestedAmount}
                  onChange={handleChange}
                  required
                  placeholder="$"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Plazo Deseado <span className="text-red-500">*</span>
                </label>
                <select
                  name="paymentTerm"
                  value={formData.paymentTerm}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                >
                  <option value="">Selecciona...</option>
                  <option value="4">4 años (48 meses)</option>
                  <option value="8">8 años (96 meses)</option>
                  <option value="12">12 años (144 meses)</option>
                  <option value="16">16 años (192 meses)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tipo de Crédito <span className="text-red-500">*</span>
                </label>
                <select
                  name="creditType"
                  value={formData.creditType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                >
                  <option value="traditional">Crédito Tradicional</option>
                  <option value="crypto">Crédito en Criptomonedas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Purpose Section */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-card-foreground">Propósito del Crédito</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  ¿Para qué usarás este crédito? <span className="text-red-500">*</span>
                </label>
                <select
                  name="loanPurpose"
                  value={formData.loanPurpose}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                >
                  <option value="">Selecciona...</option>
                  <option value="vivienda">Compra de vivienda</option>
                  <option value="vehiculo">Compra de vehículo</option>
                  <option value="negocio">Iniciar o expandir negocio</option>
                  <option value="educacion">Educación</option>
                  <option value="remodelacion">Remodelación</option>
                  <option value="consolidacion">Consolidación de deudas</option>
                  <option value="personal">Uso personal</option>
                  <option value="proyecto-cripto">Proyecto de criptomonedas</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {/* Crypto Project Description */}
              {formData.creditType === "crypto" && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                  <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Descripción del Proyecto (Crédito Cripto)
                  </h4>
                  <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
                    Queremos conocer tu proyecto para evaluar cómo podemos apoyarte, tanto financiera como
                    profesionalmente. Cuéntanos sobre tu visión, objetivos y cómo este crédito te ayudará a alcanzar tus
                    metas.
                  </p>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleChange}
                    required={formData.creditType === "crypto"}
                    rows={6}
                    placeholder="Describe tu proyecto: objetivos, alcance, equipo, tecnología, plan de negocios, etc..."
                    className="w-full px-4 py-3 border border-purple-300 dark:border-purple-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-background text-foreground resize-none"
                  />
                  <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
                    Los créditos en criptomonedas ofrecen tasas más bajas y pagos flexibles. Queremos ser tu socio
                    financiero en el ecosistema digital.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Document Upload Section */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
              <Upload className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-card-foreground">Documentos Requeridos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Government ID */}
              <div className="p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors">
                <label className="block cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <Upload className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Identificación Oficial <span className="text-red-500">*</span>
                    </span>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "governmentId")}
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  {files.governmentId ? (
                    <p className="text-sm text-green-600 dark:text-green-400">{files.governmentId.name}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">INE, Pasaporte (ambos lados)</p>
                  )}
                </label>
              </div>

              {/* Proof of Address */}
              <div className="p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors">
                <label className="block cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <Upload className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Comprobante de Domicilio <span className="text-red-500">*</span>
                    </span>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "proofOfAddress")}
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  {files.proofOfAddress ? (
                    <p className="text-sm text-green-600 dark:text-green-400">{files.proofOfAddress.name}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">No mayor a 3 meses</p>
                  )}
                </label>
              </div>

              {/* Bank Statements */}
              <div className="p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors">
                <label className="block cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <Upload className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Estados de Cuenta <span className="text-red-500">*</span>
                    </span>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "bankStatements")}
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  {files.bankStatements ? (
                    <p className="text-sm text-green-600 dark:text-green-400">{files.bankStatements.name}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Últimos 3 meses</p>
                  )}
                </label>
              </div>

              {/* Additional Documents */}
              <div className="p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors">
                <label className="block cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <Upload className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Documentos Adicionales</span>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "additionalDocs")}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  {files.additionalDocs ? (
                    <p className="text-sm text-green-600 dark:text-green-400">{files.additionalDocs.name}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Opcional: Cartas laborales, etc.</p>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Enviando Evaluación Formal...
                </>
              ) : (
                <>
                  <FileText className="w-6 h-6" />
                  Enviar Evaluación Completa
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Al enviar este formulario, autorizas a Caja Valladolid a utilizar tu información para evaluar tu solicitud
              de crédito. Todos los documentos están protegidos y encriptados.
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
