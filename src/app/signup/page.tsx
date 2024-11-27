'use client';
import React, { useState } from 'react';
import styles from './page.module.css';
import { Input, Button, Form } from 'antd';
import { KeyOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeFirebase } from '../../../lib/firebaseClient';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// Initialize Firebase app and services
const app = initializeFirebase();
const auth = getAuth(app);
const db = getFirestore(app);

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [form] = Form.useForm();

  const handleClear = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async () => {
    const errors = [];

    // Check for each condition and push an error message if unmet
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long.');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must include at least one lowercase letter.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must include at least one uppercase letter.');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must include at least one number.');
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push(
        'Password must include at least one special character (e.g., @$!%*?&).',
      );
    }

    // Show error messages if there are any
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // Create a new user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      console.log('User created and Firestore document added:', {
        uid: user.uid,
        email: user.email,
      });
      handleClear();
      router.push('signup/user-information-form');
      form.resetFields();
    } catch (error) {
      console.error('Error creating user:', error);
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <div className={styles['big-container']}>
          <h1 className={styles.title}>SignUp</h1>

          <main className={styles.main}>
            <div className={styles.container}>
              <Input
                size="large"
                placeholder="Майл хаягаа оруулна уу!"
                prefix={<MailOutlined />}
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input.Password
                size="large"
                placeholder="Нууц үгээ оруулна уу!"
                prefix={<KeyOutlined />}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                visibilityToggle
              />
              <Input.Password
                size="large"
                placeholder="Нууц үгээ дахин оруулна уу!"
                prefix={<KeyOutlined />}
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                visibilityToggle
              />
              <Button
                type="primary"
                className={styles.submitBtn}
                htmlType="submit"
              >
                <UserAddOutlined /> Бүртгүүлэх
              </Button>
            </div>
          </main>
        </div>
      </Form>
    </div>
  );
}
