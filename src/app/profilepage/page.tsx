'use client';
import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeFirebase } from '../../../lib/firebaseClient';
import Image from 'next/image';
import {
  CloseOutlined,
  CreditCardOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  PushpinOutlined,
  UserOutlined,
} from '@ant-design/icons';
import styles from './page.module.css';

const app = initializeFirebase();
const auth = getAuth(app);
const db = getFirestore(app);

export default function ProfilePage() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [creditCardInfo, setCreditCardInfo] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState<boolean>(false);
  const [photoUrlInput, setPhotoUrlInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const usernameInputRef = useRef<HTMLInputElement>(null);

  const fetchUserData = async (user) => {
    const userDocRef = doc(db, 'users', user.uid);
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setAddress(userData?.address || 'No address');
        setPhoneNumber(userData?.phoneNumber || 'No phone number');
        setCreditCardInfo(userData?.creditCardInfo || 'No credit card info');
        setEmail(userData?.email || user.email || 'No email');
        setUsername(userData?.username || user.username || 'No username');
        setLoading(false);
      } else {
        setError('No such document in Firestore!');
        setLoading(false);
      }
    } catch (error) {
      setError(`Error fetching user data: ${error}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setError('No user logged in');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Second useEffect - Handle profile photo and update based on auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.photoURL) {
          setProfilePhoto(user.photoURL);
        } else {
          try {
            // Fetch profilePictureUrl from Firestore
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              setProfilePhoto(userData.profilePictureUrl || null);
            } else {
              console.log('User document does not exist in Firestore');
            }
          } catch (error) {
            console.error('Error fetching user document:', error);
          }
        }
      } else {
        console.log('User logged out');
        // You might want to redirect here if necessary
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []); // This runs only once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleEditClick = () => {
    if (isEditing) {
      const user = auth.currentUser;
      if (user) {
        // Update username on Firebase Authentication
        updateProfile(user, { displayName: username })
          .then(() => {
            console.log('Username updated successfully');
            // Also update Firestore with new username
            const userDocRef = doc(db, 'users', user.uid);
            updateDoc(userDocRef, { username }).catch((error) => {
              console.error('Error updating username in Firestore:', error);
            });
          })
          .catch((error) => {
            console.error('Error updating username:', error);
          });
      }
    } else {
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

        // Update Firestore to store the new profile picture URL
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { profilePictureUrl: photoUrlInput });

        // Update local state with the new profile photo URL
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
              <Image
                height={350}
                width={300}
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
                <div className={styles['info-text']}>{address}</div>
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
                <div className={styles['info-text']}>{phoneNumber}</div>
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
                <div className={styles['info-text']}>{creditCardInfo}</div>
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
                <div className={styles['info-text']}>{email}</div>
              </div>
              <button className={styles['edit-btn-of-info']}>
                <EditOutlined />
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPhotoUpload && (
        <div className={styles['photo-upload']}>
          <input
            className={styles['photot-upload-section']}
            type="text"
            placeholder="Enter Photo URL"
            value={photoUrlInput}
            onChange={handlePhotoUrlChange}
          />
          <button
            onClick={uploadPhotoUrl}
            className={styles['upload-photo-btn']}
          >
            Upload
          </button>
          <button
            onClick={() => setShowPhotoUpload(false)}
            className={styles['exit-btn']}
          >
            <CloseOutlined />
          </button>
        </div>
      )}
    </main>
  );
}
