/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { fetchMessages } from '../../../../lib/fetchCategoryData';

export default function HeaderOfAuthentication() {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  useEffect(() => {
    const getMessages = async () => {
      const data = await fetchMessages();
      const texts = data
        .flatMap((message) => [message.m01, message.m02, message.m03])
        .filter(Boolean);
      setMessages(texts);
    };
    getMessages();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const interval = setInterval(() => {
        setCurrentMessageIndex(
          (prevIndex) => (prevIndex + 1) % messages.length,
        );
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [messages]);

  useEffect(() => {
    // Define global function for Google Translate
    (window as any).googleTranslateElementInit = function () {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: 'en' },
        'google_translate_element',
      );
    };

    const loadGoogleTranslate = () => {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src =
          'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
      }
    };

    loadGoogleTranslate();
  }, []);

  return (
    <div>
      <div id="google_translate_element" className={styles.translateBtn}></div>
      <div className={styles.top}>
        <div className={styles['info-section']}>
          <div className={styles.text}>
            <span className="text-rotate">{messages[currentMessageIndex]}</span>
          </div>
        </div>
      </div>
      <div className={styles.header}>
        <p className={styles.title}>SHOP NAME</p>
      </div>
    </div>
  );
}
