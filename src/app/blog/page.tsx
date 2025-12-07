import { generatePageMetadata } from '@/lib/metadata'
import { blogPosts } from '@/lib/faq'

export const metadata = generatePageMetadata(
  'Teo\'s Journey - HAYAKU Blog',
  'Follow Teo Guzel\'s journey building HAYAKU at 13. Behind-the-scenes stories, lessons learned, and the reality of being a teenage entrepreneur.',
  '/blog'
)

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Teo's Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Behind-the-scenes stories, lessons learned, and the reality of building a company at 13. 
              Real talk from a real teenager changing the world.
            </p>
          </div>

          <div className="space-y-12">
            {blogPosts.map((post, index) => (
              <article 
                key={post.slug}
                className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags?.map((tag) => (
                    <span 
                      key={tag}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 hover:text-red-600 transition-colors cursor-pointer">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>By {post.author || 'Teo Guzel'}</span>
                    <span>•</span>
                    <span>{new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <button className="text-red-600 hover:text-red-700 font-semibold transition-colors">
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-4">
                📧 Get Updates from Teo
              </h3>
              <p className="text-red-100 mb-6 text-lg">
                New posts, product updates, and lessons from the journey. 
                No spam, just real stories from building HAYAKU.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-300"
                />
                <button className="bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}