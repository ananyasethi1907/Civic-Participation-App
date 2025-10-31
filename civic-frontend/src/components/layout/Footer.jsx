const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-semibold">CivicApp</span>
            </div>
            <p className="text-secondary-300 text-sm">
              Empowering communities through civic participation and transparent governance.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-secondary-300">
              <li><a href="/issues" className="hover:text-white">Browse Issues</a></li>
              <li><a href="/issues/create" className="hover:text-white">Report Issue</a></li>
              <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-secondary-300">
              <li>Infrastructure</li>
              <li>Safety</li>
              <li>Sanitation</li>
              <li>Transportation</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-secondary-300">
              Email: support@civicapp.com<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className="border-t border-secondary-700 mt-8 pt-8 text-center text-sm text-secondary-400">
          <p>&copy; 2024 CivicApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer