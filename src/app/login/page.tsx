'use client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Alert, Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, LoginOutlined, MailOutlined } from '@ant-design/icons';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

export default function LoginPage() {
  const router = useRouter(); // Initialize router inside the component
  const [showAlert, setShowAlert] = useState(false);
  const onFinish: (
    values: FieldType,
    router: ReturnType<typeof useRouter>,
  ) => Promise<void> = async (values, router) => {
    const { email, password } = values;
    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email || '',
        password || '',
      );
      const user = userCredential.user;

      console.log('User logged in:', user);
      setShowAlert(true); // Show alert message

      setTimeout(() => {
        setShowAlert(false); // Hide alert before redirecting
        router.push('/homepage'); // Navigate to homepage
      }, 2000); // 1000 ms = 2 seconds
    } catch (error) {
      console.error('Error logging in:', error);
      alert(`Login failed: ${error.message}`);
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Нэвтрэх</h1>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={(values) => onFinish(values, router)} // Pass router to onFinish
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className={styles.form}
      >
        <div className={styles['small-con']}>
          <Form.Item<FieldType>
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              type="email"
              placeholder="Имайл хаягаа оруулна уу!"
              className={styles['email-input']}
              size="large"
              prefix={<MailOutlined />}
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder="Нууц үгээ оруулна уу!"
              className={styles['password-input']}
              size="large"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item<FieldType> name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className={styles.submitBtn}
              htmlType="submit"
            >
              <LoginOutlined />
              Нэвтрэх
            </Button>
          </Form.Item>
        </div>
        {showAlert && (
          <Alert
            message="Амжилттай нэвтэрлээ!"
            type="success"
            showIcon
            className={styles.alert}
          />
        )}
      </Form>
    </main>
  );
}
