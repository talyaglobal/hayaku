import { generatePageMetadata } from '@/lib/metadata'
import Safety from '@/components/sections/Safety'
import { faqs } from '@/lib/faq'

export const metadata = generatePageMetadata(
  'Battery Safety - LiFePO4 vs Li-ion',
  'Learn why HAYAKU uses LiFePO4 batteries for maximum safety. Complete comparison between dangerous Li-ion and safe LiFePO4 technology.',
  '/safety'
)

export default function SafetyPage() {
  const safetyFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes('safe') || 
    faq.question.toLowerCase().includes('battery') ||
    faq.question.toLowerCase().includes('parent')
  )

  return (
    <div className="min-h-screen">
      <Safety />
      
      {/* Additional safety information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
            Safety Questions Answered
          </h2>
          
          <div className="space-y-6">
            {safetyFaqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
              >
                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-green-50 border border-green-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-green-800 text-center">
              🛡️ Safety Certifications
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-4 rounded-xl">
                <div className="text-3xl mb-2">🏅</div>
                <div className="font-semibold text-gray-900">UL Certified</div>
                <div className="text-sm text-gray-600">Underwriters Laboratories safety testing</div>
              </div>
              <div className="bg-white p-4 rounded-xl">
                <div className="text-3xl mb-2">🌍</div>
                <div className="font-semibold text-gray-900">CE Marked</div>
                <div className="text-sm text-gray-600">European Conformity standards</div>
              </div>
              <div className="bg-white p-4 rounded-xl">
                <div className="text-3xl mb-2">📋</div>
                <div className="font-semibold text-gray-900">FCC Compliant</div>
                <div className="text-sm text-gray-600">Federal Communications Commission</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}