const fs = require('fs')
const path = require('path')

/**
 * Basic security audit script
 * This should be extended with more comprehensive checks
 */

const securityIssues = []

function checkForSecrets(filePath, content) {
  const secretPatterns = [
    /(?:password|passwd|pwd)\s*[:=]\s*["']([^"']+)["']/gi,
    /(?:secret|key|token)\s*[:=]\s*["']([^"']+)["']/gi,
    /(?:api[_-]?key)\s*[:=]\s*["']([^"']+)["']/gi,
    /(sk_live_[a-zA-Z0-9]+)/gi,
    /(pk_live_[a-zA-Z0-9]+)/gi,
    /([a-f0-9]{32,})/gi, // Potential MD5/SHA hashes
  ]

  secretPatterns.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      matches.forEach(match => {
        // Skip common false positives
        if (!match.includes('your_') && !match.includes('example') && !match.includes('test')) {
          securityIssues.push({
            type: 'potential_secret',
            file: filePath,
            issue: `Potential secret found: ${match}`,
            severity: 'high'
          })
        }
      })
    }
  })
}

function checkForSQLInjection(filePath, content) {
  const sqlPatterns = [
    /\$\{[^}]*\}/g, // Template literals in SQL
    /["']\s*\+\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\+\s*["']/g, // String concatenation
    /query\s*\(\s*["'`][^"'`]*["'`]\s*\+/gi,
  ]

  sqlPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      securityIssues.push({
        type: 'potential_sql_injection',
        file: filePath,
        issue: 'Potential SQL injection vulnerability detected',
        severity: 'high'
      })
    }
  })
}

function checkForXSS(filePath, content) {
  const xssPatterns = [
    /innerHTML\s*=.*\+/g,
    /document\.write\s*\(/g,
    /eval\s*\(/g,
    /dangerouslySetInnerHTML/g,
  ]

  xssPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      securityIssues.push({
        type: 'potential_xss',
        file: filePath,
        issue: 'Potential XSS vulnerability detected',
        severity: 'medium'
      })
    }
  })
}

function auditFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    
    checkForSecrets(filePath, content)
    checkForSQLInjection(filePath, content)
    checkForXSS(filePath, content)
    
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message)
  }
}

function auditDirectory(dir) {
  const items = fs.readdirSync(dir)
  
  items.forEach(item => {
    const fullPath = path.join(dir, item)
    const stats = fs.statSync(fullPath)
    
    if (stats.isDirectory()) {
      // Skip node_modules and other irrelevant directories
      if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
        auditDirectory(fullPath)
      }
    } else if (stats.isFile()) {
      // Audit relevant file types
      const ext = path.extname(fullPath)
      if (['.js', '.ts', '.tsx', '.jsx', '.env'].includes(ext)) {
        auditFile(fullPath)
      }
    }
  })
}

function generateReport() {
  console.log('\n=== Security Audit Report ===\n')
  
  if (securityIssues.length === 0) {
    console.log('✅ No security issues found!')
    return
  }
  
  // Group by severity
  const groupedIssues = securityIssues.reduce((acc, issue) => {
    acc[issue.severity] = acc[issue.severity] || []
    acc[issue.severity].push(issue)
    return acc
  }, {})
  
  Object.keys(groupedIssues).forEach(severity => {
    console.log(`\n🔴 ${severity.toUpperCase()} SEVERITY (${groupedIssues[severity].length} issues):`)
    groupedIssues[severity].forEach(issue => {
      console.log(`  - ${issue.file}: ${issue.issue}`)
    })
  })
  
  console.log(`\n📊 Total issues found: ${securityIssues.length}`)
}

// Run audit
console.log('Starting security audit...')
auditDirectory('./src')
generateReport()

module.exports = { auditDirectory, generateReport }