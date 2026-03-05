import { FormalEvaluationForm } from "@/components/formal-evaluation-form"

export const metadata = {
  title: "Evaluación Formal de Crédito | Caja Valladolid",
  description: "Completa tu solicitud de crédito con el formulario de evaluación formal",
}

export default function FormalEvaluationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="py-8">
        <FormalEvaluationForm />
      </div>
    </div>
  )
}
