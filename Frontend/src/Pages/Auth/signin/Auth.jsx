import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Components/DataProvider/DataProvider';
import { ClipLoader } from 'react-spinners';
import styles from './Auth.module.css';
import img from '../../../assets/images/golden.png';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { state, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await login(email, password);
      if (response.user.role_id === 3) {
        navigate("/admin/welcome", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Create floating stars
  useEffect(() => {
    const createStar = () => {
      const star = document.createElement('div');
      star.className = styles.star;
      
      // Random size between 2px and 5px
      const size = Math.random() * 3 + 2;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random animation duration
      const duration = Math.random() * 10 + 10;
      star.style.animationDuration = `${duration}s`;
      
      // Random color (gold or black)
      star.style.backgroundColor = Math.random() > 0.3 ? '#d4af37' : '#333';
      
      document.querySelector(`.${styles.starContainer}`).appendChild(star);
    };

    // Create 50 stars
    for (let i = 0; i < 50; i++) {
      createStar();
    }
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.starContainer}></div>
      
      <section className={styles.authContainer}>
        <div className={styles.logoContainer}>
          <Link to="/">
            <img src={img} alt="Kids Accessories Logo" className={styles.logo} />
          </Link>
        </div>
        
        <div className={styles.authForm}>
          <h1>Welcome Back!</h1>
          
          {location.state?.message && (
            <div className={styles.errorMessage}>
              {location.state.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {state.authError && <div className={styles.errorMessage}>{state.authError}</div>}

            <button 
              type="submit" 
              disabled={state.isLoading} 
              className={styles.submitButton}
            >
              {state.isLoading ? (
                <ClipLoader size={15} color="#ffffff" />
              ) : 'Sign In'}
            </button>
          </form>

          <div className={styles.terms}>
            <p>
              By continuing, you agree to our{' '}
              <a href="#" className={styles.link}>Terms of Service</a> and{' '}
              <a href="#" className={styles.link}>Privacy Policy</a>.
            </p>
          </div>
        </div>

        <div className={styles.signupSection}>
          <p className={styles.newHere}>New to our store?</p>
          <button 
            onClick={() => navigate('/register')} 
            className={styles.signupButton}
          >
            Create your account
          </button>
        </div>
      </section>
    </div>
  );
};

export default Auth;