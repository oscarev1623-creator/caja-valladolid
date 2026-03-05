// app/components/pre-evaluation-form.tsx
'use client';

import { useState } from 'react';

export default function PreEvaluationForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    monto: '15000',
    plazo: '12',
    nombre: '',
    email: '',
    telefono: '',
    edad: '',
    ingresos: '',
    proposito: '',
    terminos: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Solicitud enviada:', formData);
    alert('¡Pre-evaluación enviada! Te contactaremos pronto.');
    setIsOpen(false);
    setStep(1);
    // Reset form
    setFormData({
      monto: '15000',
      plazo: '12',
      nombre: '',
      email: '',
      telefono: '',
      edad: '',
      ingresos: '',
      proposito: '',
      terminos: false
    });
  };

  // Estilos como constantes para reutilizar
  const modalOverlayStyle = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50";
  const modalContentStyle = "relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden";
  const inputStyle = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent";
  const buttonPrimaryStyle = "px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium";
  const buttonSecondaryStyle = "px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors";

  return (
    <>
      {/* Botón para abrir el formulario */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        <span className="mr-3 text-xl">📋</span>
        Iniciar Pre-Evaluación Gratuita
      </button>

      {/* Modal del formulario */}
      {isOpen && (
        <div className={modalOverlayStyle} style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div className={modalContentStyle} style={{ animation: 'slideUp 0.3s ease-out' }}>
            
            {/* Encabezado */}
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Pre-Evaluación de Crédito</h2>
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mr-3">
                      ✓ Sin revisión de Buró
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                      ⚡ Respuesta en 24h
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-3xl text-gray-500 hover:text-gray-800 transition-colors hover:bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Contenido del formulario */}
            <div className="px-6 md:px-8 py-6 max-h-[70vh] overflow-y-auto">
              {/* Indicador de pasos */}
              <div className="mb-8">
                <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                          step === num
                            ? 'bg-green-600 border-green-600 text-white'
                            : step > num
                            ? 'bg-green-100 border-green-600 text-green-600'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}
                      >
                        {step > num ? '✓' : num}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${
                        step === num ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {num === 1 ? 'Monto' : num === 2 ? 'Datos' : 'Confirmar'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Paso 1: Información del crédito */}
                {step === 1 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">¿Cuánto dinero necesitas?</h3>
                    
                    {/* Slider de monto */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-gray-700 font-medium">Monto solicitado</label>
                        <span className="text-2xl font-bold text-green-600">
                          ${parseInt(formData.monto).toLocaleString('es-MX')}
                        </span>
                      </div>
                      <input
                        type="range"
                        name="monto"
                        min="1000"
                        max="50000"
                        step="1000"
                        value={formData.monto}
                        onChange={handleChange}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between mt-3 text-sm text-gray-500">
                        <span>$1,000</span>
                        <span className="font-medium">$25,000</span>
                        <span>$50,000</span>
                      </div>
                    </div>

                    {/* Selector de plazo */}
                    <div className="mb-8">
                      <label className="block mb-3 text-gray-700 font-medium">
                        Plazo de pago
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[6, 12, 18, 24, 36].map((meses) => (
                          <button
                            key={meses}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, plazo: meses.toString() }));
                            }}
                            className={`py-3 rounded-lg border-2 transition-all ${
                              formData.plazo === meses.toString()
                                ? 'border-green-600 bg-green-50 text-green-700 font-bold'
                                : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
                            }`}
                          >
                            {meses} meses
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Propósito del crédito */}
                    <div className="mb-6">
                      <label className="block mb-3 text-gray-700 font-medium">
                        ¿Para qué necesitas el crédito?
                      </label>
                      <select
                        name="proposito"
                        value={formData.proposito}
                        onChange={handleChange}
                        className={inputStyle}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="negocio">Para mi negocio</option>
                        <option value="deudas">Pagar deudas</option>
                        <option value="salud">Gastos de salud</option>
                        <option value="educacion">Educación</option>
                        <option value="hogar">Mejoras del hogar</option>
                        <option value="vehiculo">Compra de vehículo</option>
                        <option value="vacaciones">Vacaciones</option>
                        <option value="otros">Otros</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Paso 2: Información personal */}
                {step === 2 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">Tus datos personales</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block mb-2 text-gray-700 font-medium">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          className={inputStyle}
                          placeholder="Juan Pérez García"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block mb-2 text-gray-700 font-medium">Edad *</label>
                          <input
                            type="number"
                            name="edad"
                            min="18"
                            max="70"
                            value={formData.edad}
                            onChange={handleChange}
                            className={inputStyle}
                            placeholder="30"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-2 text-gray-700 font-medium">
                            Ingresos mensuales *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <input
                              type="number"
                              name="ingresos"
                              value={formData.ingresos}
                              onChange={handleChange}
                              className={`${inputStyle} pl-8`}
                              placeholder="15,000"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block mb-2 text-gray-700 font-medium">Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputStyle}
                            placeholder="ejemplo@correo.com"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-2 text-gray-700 font-medium">Teléfono *</label>
                          <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className={inputStyle}
                            placeholder="55 1234 5678"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Paso 3: Resumen y términos */}
                {step === 3 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">Confirma tu solicitud</h3>
                    
                    {/* Resumen */}
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 mb-8 shadow-sm">
                      <h4 className="font-bold text-gray-700 mb-4 text-lg">Resumen de tu solicitud</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <span className="text-gray-600">Monto solicitado:</span>
                          <span className="font-bold text-lg text-green-600">
                            ${parseInt(formData.monto).toLocaleString('es-MX')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <span className="text-gray-600">Plazo:</span>
                          <span className="font-bold">{formData.plazo} meses</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <span className="text-gray-600">Propósito:</span>
                          <span className="font-bold capitalize">{formData.proposito || 'No especificado'}</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-gray-600">Solicitante:</span>
                          <span className="font-bold text-right">{formData.nombre || 'No ingresado'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Términos y condiciones */}
                    <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="terminos"
                          checked={formData.terminos}
                          onChange={handleChange}
                          className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          required
                        />
                        <span className="text-sm text-gray-700">
                          Acepto los{' '}
                          <a href="/terminos" className="text-green-600 hover:text-green-800 underline font-medium">
                            términos y condiciones
                          </a>
                          . Autorizo el tratamiento de mis datos para la evaluación de mi solicitud.{' '}
                          <strong className="text-green-700">✓ No revisamos Buró de Crédito.</strong>
                        </span>
                      </label>
                    </div>

                    {/* Información de contacto estimada */}
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
                      <p className="text-green-700 font-medium">
                        📞 Te contactaremos al teléfono proporcionado en las próximas 24 horas hábiles.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de navegación */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => step > 1 ? setStep(step - 1) : setIsOpen(false)}
                  className={buttonSecondaryStyle}
                >
                  {step > 1 ? '← Anterior' : 'Cancelar'}
                </button>
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className={buttonPrimaryStyle}
                  >
                    Continuar →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!formData.terminos}
                    className={`${buttonPrimaryStyle} ${
                      !formData.terminos ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    ✅ Enviar Solicitud
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos CSS para animaciones */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}