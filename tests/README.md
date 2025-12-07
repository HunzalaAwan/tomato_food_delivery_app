# Tomato Food Delivery App - Selenium Test Suite

## Overview
This test suite contains 10 comprehensive Selenium test cases for the Tomato Food Delivery MERN stack application.

## Test Cases Included

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | **Homepage Loading and Verification** | Verifies homepage loads correctly, displays navbar, logo, and navigation menu |
| 2 | **User Registration** | Tests user signup functionality with form validation |
| 3 | **User Login** | Tests user login with valid credentials |
| 4 | **Menu Exploration and Category Filtering** | Tests menu categories display and food filtering |
| 5 | **Adding Items to Cart** | Tests adding food items to cart and cart indicator |
| 6 | **Removing Items from Cart** | Tests removing/decreasing item quantity |
| 7 | **Cart Page Functionality** | Tests cart page display, totals, and promo code section |
| 8 | **Checkout Navigation** | Tests navigation to checkout and order form display |
| 9 | **User Logout** | Tests profile dropdown and logout functionality |
| 10 | **Footer and Page Elements** | Tests footer, app download section, and navigation links |

## Prerequisites

1. **Node.js** - Version 14 or higher
2. **Chrome Browser** - Latest version
3. **ChromeDriver** - Automatically installed via npm

## Installation

```bash
cd tests
npm install
```

## Running Tests

### Run all tests (headless mode - default)
```bash
npm test
```

### Run tests with browser visible
```bash
# On Windows PowerShell
$env:HEADLESS='false'; npm test

# On Linux/Mac
HEADLESS=false npm test
```

### Run with custom base URL
```bash
# On Windows PowerShell
$env:BASE_URL='http://localhost:3000'; npm test

# On Linux/Mac
BASE_URL=http://localhost:3000 npm test
```

## Configuration

Edit the following variables in `test_suite.js` to customize:

```javascript
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const TIMEOUT = 10000;

const TEST_USER = {
    name: 'Test User',
    email: `testuser${Date.now()}@test.com`,
    password: 'Test@123456'
};
```

## Important Notes

1. **Start the application first**: Ensure your MERN stack app is running before executing tests
   ```bash
   # In the root directory
   # Start backend
   cd backend && npm start
   
   # Start frontend (in another terminal)
   cd frontend && npm run dev
   ```

2. **Database**: Tests create real users and data. Use a test database if needed.

3. **Unique Emails**: Registration tests use timestamp-based emails to ensure uniqueness.

4. **Test Order**: Some tests depend on previous test results (e.g., login after registration).

## Troubleshooting

### ChromeDriver Issues
If you encounter ChromeDriver version mismatch:
```bash
npm uninstall chromedriver
npm install chromedriver --detect_chromedriver_version
```

### Timeout Issues
Increase timeout in `test_suite.js`:
```javascript
const TIMEOUT = 20000; // Increase from 10000
```

### Element Not Found
- Ensure the application is running
- Check if CSS selectors match your app's structure
- Add more wait time with `await sleep(1000)`

## Test Output

Tests will output results like:
```
✓ Homepage loaded successfully
✓ Navigation menu displayed correctly
✓ Header section displayed correctly
...
```

## Extending Tests

To add new test cases:

1. Create a new `describe` block:
```javascript
describe('Test Case 11: New Feature', function() {
    it('should do something', async function() {
        // Your test code
    });
});
```

2. Use helper functions:
- `waitForElement(selector)` - Wait for element to exist
- `waitAndClick(selector)` - Wait and click element
- `waitAndType(selector, text)` - Wait and type text
- `sleep(ms)` - Add delay

## CI/CD Integration

For Jenkins/GitHub Actions, tests run in headless mode by default:

```yaml
# GitHub Actions example
- name: Run Selenium Tests
  run: |
    cd tests
    npm install
    npm test
  env:
    BASE_URL: http://localhost:5173
```
