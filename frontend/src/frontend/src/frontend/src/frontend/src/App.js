import React, { useState } from 'react';
import { auth } from './firebase.js'; // Firebase authentication instance
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false); // Toggle between Sign-Up and Log-In

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNewUser) {
        // If user is new, Sign-Up
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Account created successfully!');
      } else {
        // If user already has an account, Log-In
        await signInWithEmailAndPassword(auth, email, password);
        alert('Logged in successfully!');
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error:', error.message);
      alert(error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{isNewUser ? 'Sign Up' : 'Log In'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <br />
        <button type="submit">{isNewUser ? 'Create Account' : 'Log In'}</button>
      </form>
      <button onClick={() => setIsNewUser(!isNewUser)}>
        {isNewUser ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
      </button>
    </div>
  );
}

export default App;
