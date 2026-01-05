// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [user, setUser] = useState(null); // current authenticated user
  const [profile, setProfile] = useState(null); // user document from Firestore
  const [role, setRole] = useState('buyer'); // default role for signup (buyer/seller)

  useEffect(() => {
    // Listen for auth state changes
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // load user profile from Firestore
        const docRef = doc(db, 'users', u.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) setProfile(snap.data());
        else setProfile(null);
      } else {
        setProfile(null);
      }
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNewUser) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;
        // Create user document in Firestore
        await setDoc(doc(db, 'users', uid), {
          email,
          role, // 'buyer' or 'seller'
          createdAt: serverTimestamp(),
        });
        alert('Account created successfully!');
      } else {
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

  const handleLogout = async () => {
    await signOut(auth);
    alert('Logged out');
  };

  if (user) {
    // Simple dashboard for logged-in users
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h2>Welcome, {profile?.role ?? 'user'}</h2>
        <p>Email: {user.email}</p>
        <p>Role: {profile?.role ?? 'not set'}</p>

        {/* If seller, show link to seller actions (we'll implement these next) */}
        {profile?.role === 'seller' ? (
          <div>
            <h3>Seller Actions</h3>
            <p>(Upload products, manage listings — coming next)</p>
          </div>
        ) : (
          <div>
            <h3>Buyer Actions</h3>
            <p>(Browse products — coming next)</p>
          </div>
        )}

        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  // Not logged-in -> show auth form
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

        {isNewUser && (
          <>
            <label>
              Role:
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </label>
            <br />
          </>
        )}

        <button type="submit">{isNewUser ? 'Create Account' : 'Log In'}</button>
      </form>

      <button onClick={() => setIsNewUser(!isNewUser)} style={{ marginTop: '12px' }}>
        {isNewUser ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
      </button>
    </div>
  );
}

export default App;
