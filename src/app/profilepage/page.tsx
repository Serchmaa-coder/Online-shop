'use client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import React, { useEffect, useState, useRef } from 'react';
import {
  CloseOutlined,
  ContainerOutlined,
  CreditCardOutlined,
  EditOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  PushpinOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { CreditCardIcon } from '@heroicons/react/16/solid';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBg1uKO4ZcczopU1XaIJgOuUdoNsX-67hk',
  authDomain: 'onlineshop-d6769.firebaseapp.com',
  projectId: 'onlineshop-d6769',
  storageBucket: 'onlineshop-d6769.appspot.com',
  messagingSenderId: '364574940309',
  appId: '1:364574940309:web:20a2ae05c900ffad8b8f9c',
  measurementId: 'G-L8M6HE7JWE',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function ProfilePage() {
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState<boolean>(false);
  const [photoUrlInput, setPhotoUrlInput] = useState<string>('');

  // Create a ref for the username input
  const usernameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfilePhoto(user.photoURL);
        setUsername(user.displayName || 'Username');
      } else {
        console.log('User logged out');
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleEditClick = () => {
    if (isEditing) {
      const user = auth.currentUser;
      if (user) {
        updateProfile(user, { displayName: username })
          .then(() => {
            console.log('Username updated successfully');
          })
          .catch((error) => {
            console.error('Error updating username:', error);
          });
      }
    } else {
      // Focus the input when switching to edit mode
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 0);
    }
    setIsEditing(!isEditing);
  };

  const handlePhotoUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoUrlInput(event.target.value);
  };

  const uploadPhotoUrl = async () => {
    const user = auth.currentUser;
    if (user && photoUrlInput) {
      try {
        // Update the profile photo URL in Firebase Authentication
        await updateProfile(user, { photoURL: photoUrlInput });

        // Update local state with new profile photo URL
        setProfilePhoto(photoUrlInput);
        setShowPhotoUpload(false);
        console.log('Profile photo updated successfully');
      } catch (error) {
        console.error('Error updating profile photo:', error);
      }
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles['main-container']}>
        <div className={styles['user-fullname-section']}>
          <button className={styles['edit-btn']} onClick={handleEditClick}>
            <EditOutlined />
          </button>
          <input
            ref={usernameInputRef}
            className={styles.title}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className={styles.con1}>
          <div
            className={styles['profile-photo']}
            onClick={() => setShowPhotoUpload(true)}
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className={styles['profile-photo']}
              />
            ) : (
              <UserOutlined className={styles['icon-profile']} />
            )}
          </div>
          <div className={styles['account-info']}>
            <div className={styles['outer-container']}>
              <div className={styles['info-section']}>
                <div className={styles['icon-section']}>
                  <PushpinOutlined />
                </div>
                <div className={styles['info-text']}>address information</div>
              </div>
              <button className={styles['edit-btn-of-info']}>
                <EditOutlined />
              </button>
            </div>
            <div className={styles['outer-container']}>
              <div className={styles['info-section']}>
                <div className={styles['icon-section']}>
                  <PhoneOutlined />
                </div>
                <div className={styles['info-text']}>phone number</div>
              </div>
              <button className={styles['edit-btn-of-info']}>
                <EditOutlined />
              </button>
            </div>
            <div className={styles['outer-container']}>
              <div className={styles['info-section']}>
                <div className={styles['icon-section']}>
                  <CreditCardOutlined />
                </div>
                <div className={styles['info-text']}>
                  credit card information
                </div>
              </div>
              <button className={styles['edit-btn-of-info']}>
                <EditOutlined />
              </button>
            </div>
            <div className={styles['outer-container']}>
              <div className={styles['info-section']}>
                <div className={styles['icon-section']}>
                  <MailOutlined />
                </div>
                <div className={styles['info-text']}>email information</div>
              </div>
              <button className={styles['edit-btn-of-info']}>
                <EditOutlined />
              </button>
            </div>
            <div className={styles['outer-container']}>
              <div className={styles['info-section']}>
                <div className={styles['icon-section']}>
                  <LockOutlined />
                </div>
                <div className={styles['info-text']}>password information</div>
              </div>
              <button className={styles['edit-btn-of-info']}>
                <EditOutlined />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['sale-history-section']}>
        <div className={styles['icon-section']}>
          <ContainerOutlined />
        </div>
        <h3 className={styles.title}>Sale History</h3>
      </div>

      {showPhotoUpload && (
        <div className={styles['photo-upload-section']}>
          <input
            type="text"
            className={styles['photo-url-input']}
            placeholder="Enter Photo URL"
            value={photoUrlInput}
            onChange={handlePhotoUrlChange}
          />
          <button onClick={uploadPhotoUrl}>Save it</button>
          <CloseOutlined
            className={styles['close-btn']}
            onClick={() => setShowPhotoUpload(false)}
          />
        </div>
      )}
    </main>
  );
}
