// Test utilities for API and route testing

export const testRoutes = [
  { path: '/', name: 'Home' },
  { path: '/issues', name: 'Issues' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
]

export const protectedRoutes = [
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/issues/create', name: 'Create Issue' },
  { path: '/my-reports', name: 'My Reports' },
]

export const testAPI = {
  async testConnection() {
    try {
      const response = await fetch('/api/health')
      return response.ok
    } catch (error) {
      console.error('API connection test failed:', error)
      return false
    }
  },

  async testAuth() {
    try {
      // Test registration
      const registerResponse = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123',
          name: 'Test User',
          ward: 'Test Ward'
        })
      })

      // Test login
      const loginResponse = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123'
        })
      })

      return loginResponse.ok
    } catch (error) {
      console.error('Auth test failed:', error)
      return false
    }
  },

  async testIssues() {
    try {
      const response = await fetch('/api/issues')
      return response.ok
    } catch (error) {
      console.error('Issues API test failed:', error)
      return false
    }
  }
}

export const accessibility = {
  checkFocusManagement() {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    return {
      total: focusableElements.length,
      withoutTabIndex: Array.from(focusableElements).filter(el => !el.hasAttribute('tabindex')).length
    }
  },

  checkAltText() {
    const images = document.querySelectorAll('img')
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '')
    
    return {
      total: images.length,
      withoutAlt: imagesWithoutAlt.length,
      missingAlt: imagesWithoutAlt
    }
  },

  checkAriaLabels() {
    const interactiveElements = document.querySelectorAll('button, [role="button"], input, select, textarea')
    const elementsWithoutLabels = Array.from(interactiveElements).filter(el => 
      !el.getAttribute('aria-label') && 
      !el.getAttribute('aria-labelledby') && 
      !el.querySelector('label')
    )
    
    return {
      total: interactiveElements.length,
      withoutLabels: elementsWithoutLabels.length
    }
  }
}

export const performance = {
  measurePageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0]
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      }
    }
    return null
  },

  measureImageLoading() {
    const images = document.querySelectorAll('img')
    const loadTimes = []
    
    images.forEach(img => {
      if (img.complete) {
        const entry = performance.getEntriesByName(img.src)[0]
        if (entry) {
          loadTimes.push(entry.duration)
        }
      }
    })
    
    return {
      totalImages: images.length,
      averageLoadTime: loadTimes.length > 0 ? loadTimes.reduce((a, b) => a + b) / loadTimes.length : 0,
      loadTimes
    }
  }
}

// Run comprehensive tests
export const runAllTests = async () => {
  console.log('🧪 Running comprehensive tests...')
  
  const results = {
    api: {
      connection: await testAPI.testConnection(),
      auth: await testAPI.testAuth(),
      issues: await testAPI.testIssues()
    },
    accessibility: {
      focus: accessibility.checkFocusManagement(),
      altText: accessibility.checkAltText(),
      ariaLabels: accessibility.checkAriaLabels()
    },
    performance: {
      pageLoad: performance.measurePageLoad(),
      imageLoading: performance.measureImageLoading()
    }
  }
  
  console.log('Test Results:', results)
  return results
}