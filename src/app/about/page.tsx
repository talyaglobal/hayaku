import { generatePageMetadata } from '@/lib/metadata'
import Founder from '@/components/sections/Founder'
import { blogPosts } from '@/lib/faq'

export const metadata = generatePageMetadata(
  'About Teo Guzel - 13-Year-Old Founder',
  'Meet Teo Guzel, the 13-year-old founder who created HAYAKU. Learn about his journey from frustrated student to tech entrepreneur.',
  '/about'
)

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Founder />
      
      {/* Additional founder content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
            The Journey Continues
          </h2>
          
          <div className="grid md:grid-cols-1 gap-8">
            {blogPosts.map((post, index) => (
              <article 
                key={post.slug}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags?.map((tag) => (
                    <span 
                      key={tag}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>By {post.author || 'Teo Guzel'}</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </article>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Want to follow the journey?
              </h3>
              <p className="text-gray-600 mb-6">
                Get updates on new products, behind-the-scenes stories, and lessons learned from building a company at 13.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                  Follow Along
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}