'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import ReactTextRotator from 'react-text-rotator';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '../../lib/firebaseClient';
import { DocumentData } from 'firebase-admin/firestore';

const app = initializeFirebase();
const db = getFirestore(app);

export default function HeaderOfAuthentication() {
  const [messages, setMessages] = useState<DocumentData[]>([]);

  useEffect(() => {
    const loadGoogleTranslate = () => {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src =
          'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;

        script.onload = () => {
          window.googleTranslateElementInit = function () {
            new window.google.translate.TranslateElement(
              { pageLanguage: 'en' },
              'google_translate_element',
            );
          };
        };

        document.head.appendChild(script);
      }
    };

    loadGoogleTranslate();
  }, []);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesCol = collection(db, 'important messages');
        const messagesSnapshot = await getDocs(messagesCol);
        const messagesData = messagesSnapshot.docs.map((doc) => doc.data());
        console.log('Fetched messages: ', messagesData);
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching sale messages: ', error);
      }
    };

    fetchMessages();
  }, []);

  const content = messages
    .map((message) => [
      {
        text: message[`m01`],
        className: 'classA',
        animation: 'fade',
      },
      {
        text: message[`m02`],
        className: 'classB',
        animation: 'fade',
      },
      {
        text: message[`m03`],
        className: 'classC',
        animation: 'fade',
      },
    ])
    .flat();
  return (
    <div>
      <div id="google_translate_element" className={styles.translateBtn}></div>
      <div className={styles.top}>
        <div className={styles['info-section']}>
          <div className={styles.text}>
            <ReactTextRotator
              content={content}
              time={100000}
              startDelay={5000}
            />
          </div>
        </div>
      </div>
      <div className={styles.header}>
        <p className={styles.title}>SHOP NAME</p>
      </div>
    </div>
  );
}
