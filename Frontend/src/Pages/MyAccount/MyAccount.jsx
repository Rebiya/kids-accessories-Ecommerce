import React, { useState } from 'react';
import styles from './MyAccount.module.css';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { RiEdit2Fill, RiSaveFill } from 'react-icons/ri';

const MyAccount = () => {
  const [user, setUser] = useState({
    name: 'Rebuma Kedir',
    email: 'rebum.19@gmail.com',
    phone: '+2510993044432',
    address: 'Addis Ababa, Ethiopia',
    password: '••••••••'
  });
  
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Add validation and API call here
    setEditMode(false);
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Add password validation and API call here
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className={styles.accountContainer}>
      <div className={styles.accountHeader}>
        <h1><FaUser className={styles.headerIcon} /> My Account</h1>
        <p>Manage your profile and account settings</p>
      </div>

      <div className={styles.accountContent}>
        {/* Profile Section */}
        <div className={styles.profileSection}>
          <div className={styles.sectionHeader}>
            <h2>Personal Information</h2>
            {editMode ? (
              <button 
                onClick={handleSave}
                className={styles.goldButton}
              >
                <RiSaveFill /> Save Changes
              </button>
            ) : (
              <button 
                onClick={() => setEditMode(true)}
                className={styles.goldButton}
              >
                <RiEdit2Fill /> Edit Profile
              </button>
            )}
          </div>

          <div className={styles.profileForm}>
            <div className={styles.formGroup}>
              <label><FaUser /> Full Name</label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              ) : (
                <div className={styles.infoText}>{user.name}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label><FaEnvelope /> Email Address</label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              ) : (
                <div className={styles.infoText}>{user.email}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label><FaPhone /> Phone Number</label>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              ) : (
                <div className={styles.infoText}>{user.phone}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label><FaMapMarkerAlt /> Address</label>
              {editMode ? (
                <textarea
                  name="address"
                  value={user.address}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                />
              ) : (
                <div className={styles.infoText}>{user.address}</div>
              )}
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className={styles.passwordSection}>
          <div className={styles.sectionHeader}>
            <h2>Change Password</h2>
          </div>

          <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
            <div className={styles.formGroup}>
              <label><FaLock /> Current Password</label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={styles.formInput}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label><FaLock /> New Password</label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label><FaLock /> Confirm New Password</label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.goldButton}>
              Update Password
            </button>
          </form>
        </div>

        {/* Account Actions */}
        <div className={styles.actionsSection}>
          <div className={styles.sectionHeader}>
            <h2>Account Actions</h2>
          </div>
          <div className={styles.actionsGrid}>
            <button className={styles.actionButton}>
              Order History
            </button>
            <button className={styles.actionButton}>
              Saved Addresses
            </button>
            <button className={styles.actionButton}>
              Payment Methods
            </button>
            <button className={styles.actionButton}>
              Wishlist
            </button>
            <button className={styles.actionButtonDanger}>
              Deactivate Account
            </button>
            <button className={styles.actionButtonDanger}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;