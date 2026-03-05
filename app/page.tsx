import Hero from "@/components/hero"
import CreditCalculator from "@/components/credit-calculator"
import CryptoCalculator from "@/components/crypto-calculator"
import { AvailableAmounts } from "@/components/available-amounts"
import { ProcessExplanation } from "@/components/process-explanation"
import Testimonials from "@/components/testimonials"
import { AboutUs } from "@/components/about-us"
import FAQ from "@/components/faq"
import { ContactForm } from "@/components/contact-form"
import Footer from "@/components/footer"
import { Chatbot } from "@/components/chatbot"

export default function Home() {
  return (
    <>
      <Hero />
      <CreditCalculator />
      <CryptoCalculator />
      <AvailableAmounts />
      <ProcessExplanation />
      <Testimonials />
      <AboutUs />
      <FAQ />
      <ContactForm />
      <Footer />
      <Chatbot />
    </>
  )
}
