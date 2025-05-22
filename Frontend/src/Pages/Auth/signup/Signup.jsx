import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Components/DataProvider/DataProvider';
import { ClipLoader } from 'react-spinners';
import styles from './Signup.module.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const { state, register } = useAuth();
  const navigate = useNavigate();

  // Create floating stars
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const createStars = () => {
      const starCount = window.innerWidth < 600 ? 15 : 30;
      const newStars = Array.from({ length: starCount }).map(() => ({
        id: Math.random().toString(36).substr(2, 9),
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
        color: Math.random() > 0.7 ? '#000000' : '#d4af37'
      }));
      setStars(newStars);
    };

    createStars();
    window.addEventListener('resize', createStars);
    return () => window.removeEventListener('resize', createStars);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await register(formData);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.starBackground}>
      {stars.map(star => (
        <div 
          key={star.id}
          className={styles.star}
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`
          }}
        />
      ))}
      
      <section className={styles.signupContainer}>
        <div className={styles.signupHeader}>
          <h1>Create Account</h1>
          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
        
        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={state.isLoading} 
            className={styles.submitButton}
          >
            {state.isLoading ? (
              <ClipLoader size={15} color="#ffffff" />
            ) : 'Register'}
          </button>
        </form>

        <div className={styles.loginRedirect}>
          <p>Already have an account? <Link to="/auth" className={styles.loginLink}>Sign in</Link></p>
        </div>
      </section>
    </div>
  );
};

export default Signup;