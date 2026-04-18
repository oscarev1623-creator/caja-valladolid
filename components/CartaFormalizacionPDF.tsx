import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

// URL base para las imágenes
const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://cajavalladolid.com'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { 
    backgroundColor: '#059669', 
    padding: 20, 
    marginBottom: 20, 
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerLogo: { 
    width: 70, 
    height: 70, 
    marginRight: 15,
    objectFit: 'contain'
  },
  headerTextContainer: { flex: 1 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', fontFamily: 'Helvetica-Bold' },
  headerSubtitle: { color: '#d1fae5', fontSize: 12, marginTop: 5 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#059669', marginTop: 15, marginBottom: 10, fontFamily: 'Helvetica-Bold' },
  text: { fontSize: 11, marginBottom: 5, color: '#1f2937' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label: { fontSize: 11, color: '#6b7280' },
  value: { fontSize: 11, fontWeight: 'bold', color: '#1f2937', fontFamily: 'Helvetica-Bold' },
  highlightBox: { backgroundColor: '#fef3c7', padding: 12, borderRadius: 6, marginVertical: 15 },
  highlightText: { fontSize: 12, fontWeight: 'bold', color: '#f7931a', fontFamily: 'Helvetica-Bold' },
  signatures: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end',
    marginTop: 40 
  },
  signatureBlock: { 
    width: '30%',
    alignItems: 'center',
    textAlign: 'center'
  },
  signatureImage: { 
    width: 250,        // Ajusta este valor si quieres más ancho
    height: 100,        // Ajusta este valor si quieres más alto
    marginBottom: -30,   // ← 0 para que toque la línea
    objectFit: 'contain'
  },
  selloImage: { 
    width: 300,         // Ajusta este valor para tamaño del sello
    height: 300,        // Ajusta este valor para tamaño del sello
    objectFit: 'contain',
  },
  signatureLine: { 
    borderTopWidth: 1, 
    borderTopColor: '#1f2937', 
    width: '100%', 
    marginTop: 0,       // ← 0 para que la línea esté justo debajo de la firma
    marginBottom: 5 
  },
  signatureText: { fontSize: 8, color: '#6b7280' },
  signatureName: { fontSize: 9, fontWeight: 'bold', color: '#1f2937', fontFamily: 'Helvetica-Bold', marginTop: 2 },
  footer: { fontSize: 7, color: '#6b7280', textAlign: 'center', marginTop: 30 }
})

interface CartaFormalizacionPDFProps {
  lead: any
  monto: number
  plazo: number
  tasa: number
  polizaTipo: string
  polizaCosto: number
}

export const CartaFormalizacionPDF = ({ lead, monto, plazo, tasa, polizaTipo, polizaCosto }: CartaFormalizacionPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header con logo */}
      <View style={styles.header}>
        <Image src={`${BASE_URL}/logotipo.png`} style={styles.headerLogo} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>CARTA DE FORMALIZACIÓN</Text>
          <Text style={styles.headerSubtitle}>Etapa de Formalización Legal y Administrativa</Text>
          <Text style={styles.headerSubtitle}>
            Fecha: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>
      </View>

      {/* Datos del cliente */}
      <Text style={styles.sectionTitle}>DATOS DEL ACREDITADO</Text>
      <Text style={styles.text}>Nombre: {lead.fullName || 'N/A'}</Text>
      <Text style={styles.text}>Correo: {lead.email || 'N/A'}</Text>
      <Text style={styles.text}>Teléfono: {lead.phone || 'N/A'}</Text>
      <Text style={styles.text}>Folio: #{lead.id.slice(-8).toUpperCase()}</Text>

      {/* Saludo */}
      <Text style={[styles.text, { marginTop: 20 }]}>Estimado/a {lead.fullName?.split(' ')[0] || 'Cliente'}:</Text>
      <Text style={styles.text}>
        Para dar continuidad al proceso y proceder con la liberación de los fondos aprobados, 
        el siguiente paso consiste en la formalización legal y administrativa de la operación.
      </Text>

      {/* Detalles del crédito */}
      <Text style={styles.sectionTitle}>DETALLES DEL CRÉDITO</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Monto aprobado:</Text>
        <Text style={styles.value}>${monto.toLocaleString('es-MX')} MXN</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Plazo:</Text>
        <Text style={styles.value}>{plazo} meses</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tasa de interés:</Text>
        <Text style={styles.value}>{tasa}% anual fija</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tipo de crédito:</Text>
        <Text style={styles.value}>{lead.creditType === 'CRYPTO' ? 'Criptomonedas' : 'Tradicional'}</Text>
      </View>

      {/* Garantía */}
      <Text style={styles.sectionTitle}>REQUISITOS DE GARANTÍA</Text>
      <Text style={styles.text}>
        Se requiere respaldo mediante garantía real (bien mueble o inmueble) con cobertura mínima del 200% del monto solicitado.
      </Text>

      {/* Pólizas */}
      <Text style={styles.sectionTitle}>PÓLIZAS DE SEGURO</Text>
      <Text style={styles.text}>• Póliza Tipo I: Hasta $100,000 MXN → Prima: $1,132.82 MXN</Text>
      <Text style={styles.text}>• Póliza Tipo II: Más de $100,000 MXN → Prima: $2,211.82 MXN</Text>
      
      <View style={styles.highlightBox}>
        <Text style={styles.highlightText}>
          ✅ Aplica para usted: Póliza {polizaTipo} — Costo de prima: ${polizaCosto.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
        </Text>
      </View>

      {/* Próximos pasos */}
      <Text style={styles.sectionTitle}>PRÓXIMOS PASOS</Text>
      <Text style={styles.text}>1. Un asesor se comunicará en 24-48h.</Text>
      <Text style={styles.text}>2. Validación de garantía real.</Text>
      <Text style={styles.text}>3. Emisión de póliza.</Text>
      <Text style={styles.text}>4. Liberación de fondos.</Text>

      {/* Línea separadora */}
      <View style={{ borderTopWidth: 1, borderTopColor: '#059669', marginTop: 30, marginBottom: 20 }} />

      {/* Firmas */}
      <View style={styles.signatures}>
        {/* Presidente */}
        <View style={styles.signatureBlock}>
          {/* Firma */}
          <Image src={`${BASE_URL}/juanmendez.png`} style={styles.signatureImage} />
          {/* Línea */}
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>Presidente del Consejo</Text>
          <Text style={styles.signatureName}>Lic. Juan Carlos Méndez Pérez</Text>
        </View>

        {/* Sello */}
        <View style={styles.signatureBlock}>
  <Image src={`${BASE_URL}/sello.png`} style={[styles.selloImage, { marginTop: -10 }]} />
</View>

        {/* Cliente */}
        <View style={styles.signatureBlock}>
          {/* Espacio vacío para alinear con la firma */}
          <View style={{ height: 50, marginBottom: 0 }} />
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>El Acreditado</Text>
          <Text style={styles.signatureName}>
            {lead.fullName?.length > 28 ? lead.fullName.substring(0, 25) + '...' : lead.fullName || 'Cliente'}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Caja Popular San Bernardino de Siena Valladolid S.C. de A.P. de R.L. de C.V.</Text>
      <Text style={styles.footer}>Calle 40 #204B entre 41 y 43, Col. Centro, Valladolid, Yucatán</Text>
      <Text style={styles.footer}>Folio: #{lead.id.slice(-8).toUpperCase()} · Documento generado electrónicamente</Text>
    </Page>
  </Document>
)