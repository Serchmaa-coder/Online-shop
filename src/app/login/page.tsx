'use client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Alert, Button, Checkbox, Form, Input } from 'antd';
import {
  LockOutlined,
  LoginOutlined,
  MailOutlined,
  GoogleOutlined,
} from '@ant-design/icons';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { initializeFirebase } from '../../../lib/firebaseClient';

const app = initializeFirebase();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

export default function LoginPage() {
  const router = useRouter(); // Initialize router inside the component
  const [showAlert, setShowAlert] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Google login successful:', user);
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        router.push('/homepage'); // Redirect to homepage
      }, 2000);
    } catch (error) {
      console.error('Error with Google login:', error);
      alert(`Google Login failed: ${error}`);
    }
  };

  const onFinish: (
    values: FieldType,
    router: ReturnType<typeof useRouter>,
  ) => Promise<void> = async (values, router) => {
    const { email, password } = values;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email || '',
        password || '',
      );
      const user = userCredential.user;

      console.log('User logged in:', user);
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        router.push('/homepage');
      }, 2000);
    } catch (error) {
      console.error('Error logging in:', error);
      alert(`Login failed: ${error}`);
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={(values) => onFinish(values, router)}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className={styles.form}
      >
        <div className={styles['small-con']}>
          <Button
            className={styles['signup-google']}
            onClick={handleGoogleLogin}
            icon={<GoogleOutlined />}
          >
            Login with your Google account
          </Button>
          <Form.Item<FieldType>
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              type="email"
              placeholder="Enter your email!"
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
              placeholder="Enter your password!"
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
              Login
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
