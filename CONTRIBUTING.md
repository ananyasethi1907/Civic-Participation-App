# Contributing to Civic Participation App

First off, thank you for considering contributing to the Civic Participation App! It's people like you that make this platform a great tool for civic engagement.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if possible**
* **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain the expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the JavaScript/Python style guides
* Include thoughtful commit messages
* Include tests when adding features
* Update documentation when needed

## Development Process

### 1. Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR-USERNAME/Civic-Participation-App.git
cd Civic-Participation-App
```

### 2. Create a Branch

```bash
git checkout -b feature/my-new-feature
# or
git checkout -b fix/issue-description
```

### 3. Setup Development Environment

#### Frontend
```bash
cd civic-frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```

#### Backend
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
python -m uvicorn main:app --reload
```

### 4. Make Your Changes

* Write clean, readable code
* Follow existing code style
* Add comments for complex logic
* Update tests if needed
* Keep commits atomic and well-described

### 5. Test Your Changes

#### Frontend
```bash
npm run lint
npm run test
```

#### Backend
```bash
pytest
pytest --cov  # For coverage report
```

### 6. Commit Your Changes

```bash
git add .
git commit -m "feat: add amazing new feature"
```

**Commit Message Format:**
* `feat:` - New feature
* `fix:` - Bug fix
* `docs:` - Documentation changes
* `style:` - Code style changes (formatting, etc.)
* `refactor:` - Code refactoring
* `test:` - Adding or updating tests
* `chore:` - Maintenance tasks

### 7. Push & Create Pull Request

```bash
git push origin feature/my-new-feature
```

Then create a Pull Request on GitHub.

## Style Guides

### JavaScript/React Style Guide

* Use functional components with hooks
* Use meaningful variable and function names
* Follow ESLint rules (`npm run lint`)
* Use Tailwind classes for styling
* Keep components small and focused
* Use PropTypes or TypeScript for type checking

**Example:**
```jsx
const IssueCard = ({ issue, onVote }) => {
  const [isVoting, setIsVoting] = useState(false)
  
  const handleVote = async (voteType) => {
    setIsVoting(true)
    try {
      await onVote(issue.id, voteType)
    } finally {
      setIsVoting(false)
    }
  }
  
  return (
    <div className="card">
      {/* Component JSX */}
    </div>
  )
}
```

### Python Style Guide

* Follow PEP 8
* Use type hints where appropriate
* Write docstrings for functions and classes
* Keep functions focused and small
* Use async/await for I/O operations

**Example:**
```python
async def create_issue(
    issue_data: IssueCreate,
    user_id: str
) -> Issue:
    """
    Create a new civic issue.
    
    Args:
        issue_data: Issue creation data
        user_id: ID of the user creating the issue
        
    Returns:
        Created issue object
        
    Raises:
        ValueError: If validation fails
    """
    # Function implementation
    pass
```

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

## Project Structure Guidelines

### Frontend Components

* Place reusable UI components in `src/components/ui/`
* Place page-specific components in `src/components/forms/` or `src/components/layout/`
* Place page components in `src/pages/`
* Use custom hooks in `src/hooks/`
* Keep services in `src/services/`

### Backend Modules

* Keep route handlers in `main.py`
* Place business logic in `services.py`
* Keep auth logic in `auth.py`
* Add database migrations in `migrations/`
* Write tests in `test_*.py` files

## Testing Guidelines

### Frontend Tests

* Write unit tests for utility functions
* Write integration tests for components
* Test user interactions
* Test error states
* Mock external API calls

### Backend Tests

* Write unit tests for services
* Write integration tests for endpoints
* Test authentication flows
* Test error handling
* Use fixtures for common test data

## Documentation

* Update README.md if you change setup/install procedures
* Add JSDoc comments for complex functions
* Update API documentation for new endpoints
* Include examples in documentation
* Keep CHANGELOG.md updated

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

## Recognition

Contributors will be recognized in our README.md. Thank you for making this project better!

---

Happy coding! 🎉
