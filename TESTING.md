# Testing & Quality Assurance Guide

This document outlines the comprehensive testing strategy for the Hayaku e-commerce platform.

## Testing Framework Setup

### Unit Testing (Jest + React Testing Library)
```bash
npm run test              # Run unit tests
npm run test:watch        # Run in watch mode
npm run test:coverage     # Run with coverage report
```

### End-to-End Testing (Playwright)
```bash
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # Run with UI mode
```

### Performance Testing
```bash
npm run test:performance  # Lighthouse audit
npm run test:load         # Load testing with Artillery
```

### Security Testing
```bash
npm run test:security     # Custom security audit
npm run audit:security    # npm audit + security scan
```

### Accessibility Testing
```bash
npm run test:accessibility  # axe-core accessibility tests
npm run audit:accessibility # Full accessibility audit
```

### Run All Tests
```bash
npm run test:all          # Run unit, E2E, and security tests
```

## Test Structure

### Unit Tests (`__tests__/`)
- **Components**: Test React component rendering and behavior
- **Utils**: Test utility functions and helpers
- **API**: Test API route handlers

### E2E Tests (`e2e/`)
- **User Flows**: Complete user journeys (signup, purchase, etc.)
- **Cross-browser**: Chrome, Firefox, Safari, Mobile
- **Accessibility**: Screen reader compatibility, keyboard navigation

### Performance Tests (`performance/`)
- **Lighthouse**: Core Web Vitals and best practices
- **Load Testing**: Concurrent user simulation
- **Monitoring**: Response times and throughput

### Security Tests (`security/`)
- **Code Scanning**: Search for potential vulnerabilities
- **Dependency Audit**: Check for known security issues
- **Compliance**: OWASP top 10, data protection

## Coverage Goals

| Test Type | Coverage Goal | Current Status |
|-----------|---------------|----------------|
| Unit Tests | >80% | ⚠️ Setup complete |
| E2E Tests | Critical flows | ✅ Key flows covered |
| Performance | >90 Lighthouse | ⚠️ Setup complete |
| Security | Zero high/critical | ✅ Audit ready |
| Accessibility | WCAG 2.1 AA | ⚠️ Framework ready |

## CI/CD Integration

### Pre-commit Hooks
- Lint check
- Type check
- Unit tests
- Security scan

### Pull Request Checks
- Unit test coverage
- E2E test suite
- Performance regression
- Security audit

### Deployment Pipeline
- Full test suite
- Performance benchmarks
- Security verification
- Accessibility compliance

## Best Practices

### Writing Tests
1. **Unit Tests**: Focus on pure functions and component logic
2. **Integration Tests**: Test API endpoints with real database
3. **E2E Tests**: Test complete user workflows
4. **Performance**: Test under realistic load conditions

### Test Data Management
- Use factories for consistent test data
- Mock external services (Stripe, email)
- Clean up test data after runs
- Use separate test database

### Accessibility Testing
- Test with screen readers
- Verify keyboard navigation
- Check color contrast
- Test with various viewport sizes

### Performance Testing
- Test on different network speeds
- Monitor Core Web Vitals
- Test with realistic data volumes
- Monitor memory usage

## Continuous Monitoring

### Production Monitoring
- Real User Monitoring (RUM)
- Error tracking
- Performance monitoring
- Security monitoring

### Alerting
- Performance degradation
- Error rate increases
- Security incidents
- Accessibility issues

## Tools & Technologies

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **Lighthouse**: Performance auditing
- **Artillery**: Load testing
- **axe-core**: Accessibility testing
- **Custom**: Security scanning

## Running Tests Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up test environment**:
   ```bash
   cp .env.example .env.test
   # Update test environment variables
   ```

3. **Run tests**:
   ```bash
   npm run test:all
   ```

4. **View reports**:
   - Coverage: `open coverage/lcov-report/index.html`
   - E2E: `open playwright-report/index.html`
   - Performance: `open performance/reports/`

## Troubleshooting

### Common Issues
1. **Tests failing locally**: Check environment variables
2. **E2E timeouts**: Increase timeout in playwright.config.ts
3. **Performance issues**: Run tests with production build
4. **Security false positives**: Update security patterns

### Getting Help
- Review test logs for specific error messages
- Check documentation for each testing tool
- Run tests with verbose output for debugging
- Contact the development team for complex issues