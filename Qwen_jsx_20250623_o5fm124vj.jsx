import React, { useState, useRef } from 'react';

// Main component
export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Section states
  const [activeSection, setActiveSection] = useState('upload');
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedEmails, setParsedEmails] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  
  // Email composer state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [hasNameColumn, setHasNameColumn] = useState(false);
  
  // Scheduling state
  const [scheduleTime, setScheduleTime] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  
  // Sending state
  const [isSending, setIsSending] = useState(false);
  const [sendSummary, setSendSummary] = useState(null);
  
  // Handle Google login
  const handleGoogleLogin = () => {
    // In a real app, this would integrate with Google OAuth
    setIsAuthenticated(true);
    // Set mock user data
    setUserMetadata();
  };
  
  // Set user metadata after login
  const setUserMetadata = () => {
    // Mock user data - in a real app this would come from Google OAuth
    const mockUser = {
      email: 'user@example.com',
      loginTimestamp: new Date().toISOString()
    };
    // Save to localStorage or context
    console.log('User metadata set:', mockUser);
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    // Validate file type and size
    if (!file || !['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type)) {
      alert('Please upload a CSV or XLSX file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }
    
    setUploadedFile(file);
    
    // Parse file (mock implementation)
    parseMockEmails(file);
  };
  
  // Mock parsing function (would use PapaParse or similar in real app)
  const parseMockEmails = (file) => {
    // Simulate async parsing
    setTimeout(() => {
      // Generate mock parsed emails
      const mockEmails = [
        { email: 'john@example.com', name: 'John Doe', isValid: true },
        { email: 'jane@example.com', name: 'Jane Smith', isValid: true },
        { email: 'invalid-email', isValid: false },
        { email: 'duplicate@example.com', name: 'Duplicate User', isValid: true },
        { email: 'duplicate@example.com', name: 'Duplicate User', isValid: false }
      ];
      
      setParsedEmails(mockEmails);
      
      // Generate validation results
      const validEmails = mockEmails.filter(e => e.isValid);
      const invalidEmails = mockEmails.filter(e => !e.isValid);
      const uniqueValidEmails = Array.from(new Map(validEmails.map(email => [email.email, email])).values());
      
      setValidationResults({
        total: mockEmails.length,
        valid: uniqueValidEmails.length,
        invalid: invalidEmails.length,
        duplicates: mockEmails.length - uniqueValidEmails.length
      });
      
      // Check if 'Name' column exists
      setHasNameColumn(mockEmails.some(e => e.name));
      
      setActiveSection('compose');
    }, 800);
  };
  
  // Validate email format
  const validateEmailFormat = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Handle email body change
  const handleEmailBodyChange = (e) => {
    const text = e.target.value;
    setEmailBody(text);
    
    // Calculate word count
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Check for word limit
    if (words.length > 100) {
      alert('Email body must not exceed 100 words');
    }
  };
  
  // Schedule email sending
  const scheduleEmails = () => {
    if (!scheduleTime) {
      alert('Please select a date and time to schedule the email campaign');
      return;
    }
    
    if (!validationResults || validationResults.valid <= 0) {
      alert('No valid emails to send. Please check your file.');
      return;
    }
    
    if (wordCount > 100) {
      alert('Email body exceeds 100 words limit');
      return;
    }
    
    if (!emailSubject.trim()) {
      alert('Please enter an email subject');
      return;
    }
    
    // Confirm scheduling
    if (window.confirm(`Schedule ${validationResults.valid} emails to be sent at ${new Date(scheduleTime).toLocaleString()}?`)) {
      setActiveSection('schedule');
    }
  };
  
  // Send emails
  const sendEmails = () => {
    if (!validationResults || validationResults.valid <= 0) {
      alert('No valid emails to send. Please check your file.');
      return;
    }
    
    if (wordCount > 100) {
      alert('Email body exceeds 100 words limit');
      return;
    }
    
    if (!emailSubject.trim()) {
      alert('Please enter an email subject');
      return;
    }
    
    // Show loading state
    setIsSending(true);
    
    // Simulate sending process
    setTimeout(() => {
      // Create mock summary
      const summary = {
        totalUploaded: validationResults.total,
        sentSuccessfully: validationResults.valid,
        invalidSkipped: validationResults.invalid + validationResults.duplicates,
        dateTimeSent: new Date().toLocaleString(),
        scheduledFor: scheduleTime ? new Date(scheduleTime).toLocaleString() : 'Immediate'
      };
      
      setSendSummary(summary);
      setIsSending(false);
      setActiveSection('summary');
    }, 3000);
  };
  
  // Logout handler
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      setIsAuthenticated(false);
      setUploadedFile(null);
      setParsedEmails([]);
      setValidationResults(null);
      setEmailSubject('');
      setEmailBody('');
      setWordCount(0);
      setScheduleTime('');
      setSendSummary(null);
      setActiveSection('upload');
    }
  };
  
  // Render login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-2xl duration-300">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-red-500 rounded-full p-3 mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.7998 10H13.2998V14H18.3998C17.6455 17.242 14.818 19.701 11.2998 20C6.43477 20 2.49976 15.527 2.49976 10C2.49976 4.473 6.43477 0 11.2998 0C16.1648 0 20.1178 4.49 20.2688 9.95L20.2998 10H20.7998ZM11.2998 4C8.69976 4 6.59976 6.1 6.59976 8.7C6.59976 11.3 8.69976 13.4 11.2998 13.4C13.8998 13.4 15.9998 11.3 15.9998 8.7C15.9998 6.1 13.8998 4 11.2998 4Z" fill="currentColor"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Smart Email Sender</h1>
              <p className="text-gray-600 mt-2">Send personalized email campaigns with ease</p>
            </div>
            
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.908 8.908 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" fill="#4285F4"/>
              </svg>
              Sign in with Google
            </button>
          </div>
          
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 mr-2 text-green-500">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span>Secure Gmail authentication</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 mr-2 text-green-500">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span>Send up to 100 emails per day</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 mr-2 text-green-500">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span>Simple email validation & deduplication</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Render main application UI
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-red-500 rounded-full p-2">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.7998 10H13.2998V14H18.3998C17.6455 17.242 14.818 19.701 11.2998 20C6.43477 20 2.49976 15.527 2.49976 10C2.49976 4.473 6.43477 0 11.2998 0C16.1648 0 20.1178 4.49 20.2688 9.95L20.2998 10H20.7998ZM11.2998 4C8.69976 4 6.59976 6.1 6.59976 8.7C6.59976 11.3 8.69976 13.4 11.2998 13.4C13.8998 13.4 15.9998 11.3 15.9998 8.7C15.9998 6.1 13.8998 4 11.2998 4Z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Smart Email Sender</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="text-sm text-gray-600">
                Logged in as <span className="font-medium">user@example.com</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-x-auto py-3">
            <button
              onClick={() => setActiveSection('upload')}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                activeSection === 'upload' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm'
              } transition-colors duration-200`}
            >
              Upload Emails
            </button>
            <button
              onClick={() => setActiveSection('compose')}
              disabled={!parsedEmails.length}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                activeSection === 'compose'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm'
              } ${!parsedEmails.length ? 'opacity-50 cursor-not-allowed' : ''} transition-colors duration-200`}
            >
              Compose Message
            </button>
            <button
              onClick={() => setActiveSection('schedule')}
              disabled={!parsedEmails.length || !emailSubject || !emailBody}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                activeSection === 'schedule'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm'
              } ${(!parsedEmails.length || !emailSubject || !emailBody) ? 'opacity-50 cursor-not-allowed' : ''} transition-colors duration-200`}
            >
              Schedule Campaign
            </button>
            <button
              onClick={() => setActiveSection('summary')}
              disabled={!sendSummary}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                activeSection === 'summary'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm'
              } ${!sendSummary ? 'opacity-50 cursor-not-allowed' : ''} transition-colors duration-200`}
            >
              Delivery Summary
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        {activeSection === 'upload' && (
          <div className="animate-fadeIn">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Email List</h2>
              <p className="text-gray-600 mb-6">Upload a CSV or Excel file containing up to 100 email addresses.</p>
              
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
                  <input 
                    type="file" 
                    accept=".csv,.xlsx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-4">
                      <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
                        <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 16.2091 19.2091 18 17 18H7C4.79086 18 3 16.2091 3 14C3 11.7909 4.79086 10 7 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 16H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700">Drag and drop your file here</p>
                        <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                        <p className="text-xs text-gray-400 mt-2">CSV or XLSX files only (max 10MB)</p>
                      </div>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 animate-slideIn">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M20 7L9 18L4 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{uploadedFile.name}</h3>
                        <p className="text-sm text-gray-500">{Math.round(uploadedFile.size / 1024)} KB • CSV file</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setUploadedFile(null);
                        setParsedEmails([]);
                        setValidationResults(null);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  
                  {validationResults && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-md">
                      <h4 className="font-medium text-blue-800 mb-2">Validation Results:</h4>
                      <ul className="space-y-1 text-sm text-blue-700">
                        <li className="flex justify-between">
                          <span>Total emails uploaded:</span>
                          <span>{validationResults.total}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-green-700">Valid emails:</span>
                          <span className="text-green-700">{validationResults.valid}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-red-700">Invalid/duplicate emails:</span>
                          <span className="text-red-700">{validationResults.invalid + validationResults.duplicates}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={() => setActiveSection('compose')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Continue to Email Composer
                    </button>
                  </div>
                </div>
              )}
              
              <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="font-medium text-gray-800 mb-4">Requirements</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 mr-2 text-green-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Must contain a column named "Email"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 mr-2 text-green-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Maximum of 100 rows per upload</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 mr-2 text-green-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Email addresses must be properly formatted</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 mr-2 text-green-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Duplicate email addresses will be removed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Email Composer Section */}
        {activeSection === 'compose' && (
          <div className="animate-fadeIn">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Compose Your Message</h2>
              <p className="text-gray-600 mb-6">Write a short message to send to your contacts.</p>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Enter your email subject line"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message Body
                  </label>
                  <textarea
                    id="message"
                    rows={8}
                    value={emailBody}
                    onChange={handleEmailBodyChange}
                    placeholder="Type your message here... You can include {First Name} if your file has a 'Name' column."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500 mb-6">
                  <div>
                    {hasNameColumn && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                        Supports first name personalization
                      </span>
                    )}
                  </div>
                  <div>
                    Word count: <span className={`${wordCount > 100 ? 'text-red-500' : ''}`}>{wordCount}/100</span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => setActiveSection('schedule')}
                    disabled={wordCount > 100 || wordCount === 0 || !emailSubject.trim()}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                      wordCount > 100 || wordCount === 0 || !emailSubject.trim() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Continue to Schedule
                  </button>
                </div>
              </div>
              
              <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="font-medium text-gray-800 mb-4">Best Practices</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 mr-2 text-green-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Keep your message concise and clear</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 mr-2 text-green-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Personalize messages using the {`{First Name}`} tag</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 mr-2 text-green-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Avoid HTML formatting and special characters</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Section */}
        {activeSection === 'schedule' && (
          <div className="animate-fadeIn">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Schedule Your Campaign</h2>
              <p className="text-gray-600 mb-6">Choose when you'd like your emails to be sent.</p>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="datetime"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                      Time Zone
                    </label>
                    <select
                      id="timezone"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="PST">Pacific Standard Time</option>
                      <option value="EST">Eastern Standard Time</option>
                      <option value="GMT">Greenwich Mean Time</option>
                      <option value="IST">India Standard Time</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-yellow-50 rounded-md">
                  <h4 className="font-medium text-yellow-800 mb-2">Important Note:</h4>
                  <p className="text-sm text-yellow-700">
                    Gmail API has daily sending limits. Free accounts are limited to 100 emails per day.
                    If you have more than 100 valid emails, please split them into multiple campaigns.
                  </p>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button 
                    onClick={() => setActiveSection('compose')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  >
                    Back to Message
                  </button>
                  
                  <button 
                    onClick={scheduleEmails}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Schedule Campaign
                  </button>
                </div>
              </div>
              
              <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="font-medium text-gray-800 mb-4">Scheduled Preview</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Number of emails to send:</span>
                    <span className="font-medium">{validationResults?.valid || 0}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Message length:</span>
                    <span className="font-medium">{wordCount} words</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Scheduled for:</span>
                    <span className="font-medium">
                      {scheduleTime ? new Date(scheduleTime).toLocaleString() : 'Not yet scheduled'}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Time zone:</span>
                    <span className="font-medium">{timezone}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Section */}
        {activeSection === 'summary' && (
          <div className="animate-fadeIn">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Campaign Summary</h2>
              <p className="text-gray-600 mb-6">Review the details of your email campaign.</p>
              
              <div className="bg-white rounded-lg shadow p-6">
                {isSending ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg text-gray-700">Sending emails...</p>
                    <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
                  </div>
                ) : sendSummary ? (
                  <>
                    <div className="rounded-md bg-green-50 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Campaign successfully scheduled</h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <p className="text-gray-600">
                        Your campaign has been successfully scheduled to send {sendSummary.sentSuccessfully} emails.
                      </p>
                      
                      <div className="border rounded-md divide-y">
                        <div className="p-4">
                          <h4 className="text-sm font-medium text-gray-500">Total uploaded</h4>
                          <p className="text-lg font-medium text-gray-900">{sendSummary.totalUploaded}</p>
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-medium text-gray-500">Sent successfully</h4>
                          <p className="text-lg font-medium text-green-600">{sendSummary.sentSuccessfully}</p>
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-medium text-gray-500">Invalid/skipped</h4>
                          <p className="text-lg font-medium text-red-600">{sendSummary.invalidSkipped}</p>
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-medium text-gray-500">Scheduled for</h4>
                          <p className="text-lg font-medium text-gray-900">{sendSummary.scheduledFor}</p>
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-medium text-gray-500">Date/time sent</h4>
                          <p className="text-lg font-medium text-gray-900">{sendSummary.dateTimeSent}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button 
                        onClick={() => {
                          // Reset all fields
                          setUploadedFile(null);
                          setParsedEmails([]);
                          setValidationResults(null);
                          setEmailSubject('');
                          setEmailBody('');
                          setWordCount(0);
                          setScheduleTime('');
                          setSendSummary(null);
                          setActiveSection('upload');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                      >
                        Start New Campaign
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <button 
                      onClick={sendEmails}
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Send Emails Now
                    </button>
                    <p className="text-sm text-gray-500 mt-3">Or schedule for later</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="font-medium text-gray-800 mb-4">Next Steps</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 mr-2 text-green-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Your emails will be sent via your Gmail account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 mr-2 text-green-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>You'll receive a confirmation email once delivery is complete</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 mr-2 text-green-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>You can view your campaign history in the dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-red-500 rounded-full p-1">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.7998 10H13.2998V14H18.3998C17.6455 17.242 14.818 19.701 11.2998 20C6.43477 20 2.49976 15.527 2.49976 10C2.49976 4.473 6.43477 0 11.2998 0C16.1648 0 20.1178 4.49 20.2688 9.95L20.2998 10H20.7998ZM11.2998 4C8.69976 4 6.59976 6.1 6.59976 8.7C6.59976 11.3 8.69976 13.4 11.2998 13.4C13.8998 13.4 15.9998 11.3 15.9998 8.7C15.9998 6.1 13.8998 4 11.2998 4Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-sm text-gray-600">© 2023 Smart Email Sender</span>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}