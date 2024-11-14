'use client';
import React, { useState } from 'react';
import SignUpLayout from './layout';
import styles from './page.module.css';
import { Input, Button, Form } from 'antd';
import {
  CheckCircleFilled,
  KeyOutlined,
  MailOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import HeaderOfAuthentication from '../../../component/header2/page';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Footer from '../../../component/footer/page';
import Link from 'next/link';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBg1uKO4ZcczopU1XaIJgOuUdoNsX-67hk',
  authDomain: 'onlineshop-d6769.firebaseapp.com',
  projectId: 'onlineshop-d6769',
  storageBucket: 'onlineshop-d6769.firebasestorage.app',
  messagingSenderId: '364574940309',
  appId: '1:364574940309:web:20a2ae05c900ffad8b8f9c',
  measurementId: 'G-L8M6HE7JWE',
};

// Initialize Firebase app and auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function SignupPage() {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [form] = Form.useForm();

  const handleClear = () => {
    setLastName('');
    setFirstName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (values) => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      console.log('User created:', {
        uid: user.uid,
        lastName,
        firstName,
        email: user.email,
      });
      setShowSuccess(true);
      form.resetFields();
    } catch (error) {
      console.error('Error creating user:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div
      style={{
        margin: '0px',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '1800px',
        minWidth: '1800px',
      }}
    >
      <SignUpLayout>
        <HeaderOfAuthentication />
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <div className={styles['big-container']}>
            <h1 className={styles.title}>Бүртгүүлэх</h1>

            <main className={styles.main}>
              <div className={styles.container}>
                <Input
                  size="large"
                  placeholder="Овгоо оруулна уу!"
                  prefix={<UserOutlined />}
                  className={styles.input}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <Input
                  size="large"
                  placeholder="Нэрээ оруулна уу!"
                  prefix={<UserOutlined />}
                  className={styles.input}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  size="large"
                  placeholder="Майл хаягаа оруулна уу!"
                  prefix={<MailOutlined />}
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  size="large"
                  placeholder="Нууц үгээ оруулна уу!"
                  prefix={<KeyOutlined />}
                  className={styles.input}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  size="large"
                  placeholder="Нууц үгээ дахин оруулна уу!"
                  prefix={<KeyOutlined />}
                  className={styles.input}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  type="primary"
                  className={styles.submitBtn}
                  htmlType="submit"
                >
                  <UserAddOutlined /> Бүртгүүлэх
                </Button>
              </div>
              {showSuccess && (
                <div className={styles.background}>
                  <div className={styles['success-alert']}>
                    <CheckCircleFilled className={styles['alert-icon']} />
                    <h2>Амжилттай бүртгэгдлээ!</h2>
                    <div className={styles['alert-btns']}>
                      <Link href="/login">
                        <button className={styles['login-btn']}>Нэвтрэх</button>
                      </Link>
                      <button
                        className={styles['dismiss-btn']}
                        onClick={() => {
                          setShowSuccess(false);
                          handleClear();
                        }}
                      >
                        Буцах
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </Form>
        <Footer />
      </SignUpLayout>
    </div>
  );
}
