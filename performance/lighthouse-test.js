const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs')

async function runLighthouseTest(url, outputPath) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  }

  const runnerResult = await lighthouse(url, options)

  // Save the report
  const reportHtml = runnerResult.report
  fs.writeFileSync(outputPath, reportHtml)

  // Log scores
  const scores = runnerResult.lhr.categories
  console.log('Lighthouse Scores:')
  console.log('Performance:', scores.performance.score * 100)
  console.log('Accessibility:', scores.accessibility.score * 100)
  console.log('Best Practices:', scores['best-practices'].score * 100)
  console.log('SEO:', scores.seo.score * 100)

  await chrome.kill()
  return scores
}

// Test different pages
async function runAllTests() {
  const baseUrl = process.env.TEST_URL || 'http://localhost:3000'
  const pages = [
    { name: 'homepage', url: `${baseUrl}/` },
    { name: 'products', url: `${baseUrl}/products` },
    { name: 'brands', url: `${baseUrl}/brands` },
  ]

  for (const page of pages) {
    console.log(`\nTesting ${page.name}...`)
    try {
      await runLighthouseTest(page.url, `./performance/reports/lighthouse-${page.name}.html`)
    } catch (error) {
      console.error(`Error testing ${page.name}:`, error.message)
    }
  }
}

if (require.main === module) {
  runAllTests().catch(console.error)
}

module.exports = { runLighthouseTest }