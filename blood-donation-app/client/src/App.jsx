import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- Global Axios Setup ---
/*
  NOTE: The API calls are commented out to allow the app to run in this
  preview environment. When you run this on your local machine with
  `npm run dev`, you can uncomment this section and the 'try/catch'
  blocks in the page components.
*/
// const api = axios.create({
//   baseURL: 'http://localhost:5000/api', // Base URL for all requests
// });
//
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['x-auth-token'] = token;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


// --- Main App Component ---
function App() {
  const [page, setPage] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('token'));

  // --- MOCK DATABASE STATE ---
  // We use this state to simulate a real backend for the preview.
  const [mockDonationCount, setMockDonationCount] = useState(123);
  const [mockRecentDonors, setMockRecentDonors] = useState(['Vaibhav', 'Alice', 'Bob']);
  // --- END MOCK DATABASE STATE ---

  // Simple navigation function
  const navigate = (targetPage) => {
    setPage(targetPage);
  };

  // Logout function
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    // delete api.defaults.headers['x-auth-token']; // Uncomment for local dev
    navigate('home');
  };

  // This effect runs when the token changes
  useEffect(() => {
    if (token) {
      // api.defaults.headers['x-auth-token'] = token; // Uncomment for local dev
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <NavBar navigate={navigate} token={token} handleLogout={handleLogout} />
      <div className="container mx-auto p-4 md:p-8">
        {/* Page routing */}
        {/* Pass mock data to components */}
        {page === 'home' && <HomePage navigate={navigate} token={token} donationCount={mockDonationCount} />}
        {page === 'about' && <AboutPage />}
        {page === 'donors' && <DonorsPage recentDonors={mockRecentDonors} />}
        {page === 'login' && <LoginPage setToken={setToken} navigate={navigate} />}
        {page === 'register' && <RegisterPage setToken={setToken} navigate={navigate} />}
        {/* Pass functions to update mock data to the donation form */}
        {page === 'donate' && (
          <DonationFormPage
            navigate={navigate}
            onDonationSuccess={(newDonorName) => {
              setMockDonationCount(c => c + 1);
              setMockRecentDonors(donors => [newDonorName, ...donors]);
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

// --- Components ---

function NavBar({ navigate, token, handleLogout }) {
  return (
    <nav className="bg-white shadow-md w-full">
      <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        <div
          className="text-2xl font-bold text-red-600 cursor-pointer"
          onClick={() => navigate('home')}
        >
          Blood<span className="text-gray-800">Donors</span>
        </div>
        <div className="flex flex-wrap items-center space-x-4 md:space-x-6 mt-4 md:mt-0">
          <NavItem navigate={navigate} target="home" label="Home" />
          <NavItem navigate={navigate} target="about" label="About" />
          <NavItem navigate={navigate} target="donors" label="Donors" />
          {token ? (
            <>
              <button
                onClick={() => navigate('donate')}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition duration-300"
              >
                Donate Now
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <NavItem navigate={navigate} target="login" label="Login / Register" />
          )}
        </div>
      </div>
    </nav>
  );
}

function NavItem({ navigate, target, label }) {
  return (
    <button
      onClick={() => navigate(target)}
      className="text-gray-600 hover:text-red-600 font-medium transition duration-300"
    >
      {label}
    </button>
  );
}

// --- Page Components ---

// Receive donationCount as a prop
function HomePage({ navigate, token, donationCount }) {
  // const [donationCount, setDonationCount] = useState(0); // Mock data now comes from App.jsx

  useEffect(() => {
    // Fetch the total donation count
    const fetchDonationCount = async () => {
      // try {
      //   const res = await api.get('/donations/count');
      //   setDonationCount(res.data.count);
      // } catch (err) {
      //   console.error('Error fetching donation count:', err);
      // }
    };
    // fetchDonationCount();
    // We don't need to fetch, as the count is passed as a prop
  }, []); // Note: dataVersion is no longer needed here

  return (
    <div className="text-center bg-white p-8 md:p-16 rounded-lg shadow-lg">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
        Welcome to BloodDonors
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Your donation can save a life. Join our community of heroes.
      </p>
      <div className="mb-8">
        {/* Display the count from props */}
        <h2 className="text-3xl font-bold text-red-600">{donationCount}</h2>
        <p className="text-gray-700 font-medium">Donations Made So Far</p>
      </div>
      {token ? (
        <button
          onClick={() => navigate('donate')}
          className="px-8 py-3 bg-red-600 text-white text-lg rounded-md font-semibold hover:bg-red-700 transition duration-300"
        >
          Donate Now
        </button>
      ) : (
        <button
          onClick={() => navigate('login')}
          className="px-8 py-3 bg-red-600 text-white text-lg rounded-md font-semibold hover:bg-red-700 transition duration-300"
        >
          Login to Donate
        </button>
      )}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">About Us</h1>
      <p className="text-gray-700 mb-4">
        We are a non-profit organization dedicated to connecting blood donors
        with those in need. Our mission is to ensure a safe and stable blood
        supply for hospitals and patients.
      </p>
      <p className="text-gray-700">
        By registering as a donor, you become part of a life-saving network.
        Your single donation can help save up to three lives.
      </p>
    </div>
  );
}

// Receive recentDonors as a prop
function DonorsPage({ recentDonors }) {
  // const [recentDonors, setRecentDonors] = useState([]); // Mock data now comes from App.jsx
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent donor names
    const fetchRecentDonors = async () => {
      // try {
      //   setLoading(true);
      //   const res = await api.get('/donations/recent');
      //   setRecentDonors(res.data);
      // } catch (err) {
      //   console.error('Error fetching recent donors:', err);
      // } finally {
      //   setLoading(false);
      // }
    };
    // fetchRecentDonors();
    
    // Simulate loading
    setTimeout(() => setLoading(false), 300);
  }, []); // dataVersion no longer needed

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Recent Donors</h1>
      <p className="text-gray-700 mb-6">
        A huge thank you to our heroes who donated in the last week!
      </p>
      {loading ? (
        <p className="text-gray-500">Loading donors...</p>
      ) : (
        <ul className="list-disc list-inside space-y-2">
          {recentDonors.length > 0 ? (
            recentDonors.map((name, index) => (
              <li key={index} className="text-gray-800 font-medium">
                {name}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No recent donations. Be the first!</p>
          )}
        </ul>
      )}
    </div>
  );
}

function LoginPage({ setToken, navigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    // try {
    //   // Use the global 'api' instance
    //   const res = await api.post('/auth/login', { username, password });
    //   setToken(res.data.token);
    //   localStorage.setItem('token', res.data.token);
    //   navigate('home');
    // } catch (err) {
    //   console.error('Login error:', err);
    //   const errorMsg = err.response && err.response.data ? err.response.data.msg : 'An error occurred. Please try again.';
    //   setError(errorMsg);
    // }

    // --- MOCK LOGIN ---
    if (username === 'vaibhav@gmail.com' && password === '12345') {
      const mockToken = 'mock-token-12345';
      setToken(mockToken);
      localStorage.setItem('token', mockToken);
      navigate('home');
    } else if (username === 'vaibhav@gmail.com') {
      setError('Invalid credentials');
    } else {
      setError('User not found');
    }
    // --- END MOCK LOGIN ---
  };

  return (
    <AuthForm
      title="Login"
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      error={error}
      footerText="Don't have an account?"
      footerLinkText="Register"
      onFooterLinkClick={() => navigate('register')}
    />
  );
}

function RegisterPage({ setToken, navigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // try {
    //   // Use the global 'api' instance
    //   const res = await api.post('/auth/register', { username, password });
    //   setToken(res.data.token);
    //   localStorage.setItem('token', res.data.token);
    //   navigate('home');
    // } catch (err) {
    //   console.error('Register error:', err);
    //   const errorMsg = err.response && err.response.data ? err.response.data.msg : 'An error occurred. Please try again.';
    //   setError(errorMsg);
    // }

    // --- MOCK REGISTER ---
    if (username === 'vaibhav@gmail.com') {
      setError('User already exists');
    } else if (username && password) {
      const mockToken = 'mock-token-abcdef';
      setToken(mockToken);
      localStorage.setItem('token', mockToken);
      navigate('home');
    } else {
      setError('Please fill in all fields.');
    }
    // --- END MOCK REGISTER ---
  };

  return (
    <AuthForm
      title="Register"
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      error={error}
      footerText="Already have an account?"
      footerLinkText="Login"
      onFooterLinkClick={() => navigate('login')}
    />
  );
}

// Receive onDonationSuccess prop
function DonationFormPage({ navigate, onDonationSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'A+',
    weight: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Simple frontend validation
    if (formData.age < 18) {
      setError("You aren't eligible to give blood (under 18).");
      return;
    }
    if (formData.weight < 60) {
      setError("You aren't eligible to give blood (under 60kg).");
      return;
    }

    // try {
    //   const res = await api.post('/donations', formData);
    //   setSuccess(res.data.msg); // Show success message from server
    //   onDonationSuccess(formData.name); // Call refresh with the new name
    //   setFormData({ name: '', age: '', gender: 'Male', bloodGroup: 'A+', weight: '', phone: '' });
    //   setTimeout(() => navigate('home'), 3000);
    // } catch (err) {
    //   console.error('Donation error:', err);
    //   const errorMsg = err.response && err.response.data ? err.response.data.msg : 'An error occurred. Please try again.';
    //   setError(errorMsg);
    // }

    // --- MOCK DONATION SUBMIT ---
    setSuccess('Thanks for filling data, You are eligible to donate!');
    // Call the success function passed from App.jsx
    onDonationSuccess(formData.name);
    // Clear form
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      bloodGroup: 'A+',
      weight: '',
      phone: '',
    });
    // Redirect after a delay
    setTimeout(() => {
      navigate('home');
    }, 3000);
    // --- END MOCK DONATION SUBMIT ---
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Donation Form
      </h1>

      {/* --- Error/Success Messages --- */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6" role="alert">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Weight (in kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={['Male', 'Female', 'Other']}
          />
          <FormSelect
            label="Blood Group"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
          />
        </div>
        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-semibold text-lg hover:bg-red-700 transition duration-300"
        >
          Submit Donation
        </button>
      </form>
    </div>
  );
}

// --- Reusable Form Components ---

function AuthForm({
  title,
  username,
  setUsername,
  password,
  setPassword,
  handleSubmit,
  error,
  footerText,
  footerLinkText,
  onFooterLinkClick,
}) {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        {title}
      </h1>

      {/* --- Error Message --- */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-semibold text-lg hover:bg-red-700 transition duration-3D00"
        >
          {title}
        </button>
      </form>
      <div className="text-center mt-6">
        <p className="text-gray-600">
          {footerText}{' '}
          <button
            onClick={onFooterLinkClick}
            className="text-red-600 hover:underline font-medium"
          >
            {footerLinkText}
          </button>
        </p>
      </div>
    </div>
  );
}

function FormInput({ label, name, type = 'text', value, onChange, required = false }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
      />
    </div>
  );
}

function FormSelect({ label, name, value, onChange, options, required = false }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Footer() {
  return (
    <footer className="text-center py-8 mt-12 border-t border-gray-200">
      <p className="text-gray-500">
        &copy; {new Date().getFullYear()} BloodDonors. All rights reserved.
      </p>
    </footer>
  );
}

export default App;

