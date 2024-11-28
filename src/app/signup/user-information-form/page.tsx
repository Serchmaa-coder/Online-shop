/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import styles from './page.module.css';
import { PlusOutlined, CheckCircleFilled } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Upload,
  message,
} from 'antd';
import { doc, getFirestore, setDoc } from 'firebase/firestore'; // Use `setDoc` to create/update user data
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { initializeFirebase } from '../../../../lib/firebaseClient';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function UserFormPage() {
  const app = initializeFirebase();
  const auth = getAuth(app);
  const storage = getStorage(app);
  const router = useRouter();
  const firestore = getFirestore(app);

  const [form] = Form.useForm();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        message.error('No user is logged in.');
        router.push('/signup');
        return;
      }

      let downloadURL = null;

      if (values.profilePicture && values.profilePicture.length > 0) {
        const file = values.profilePicture[0].originFileObj;
        const fileRef = ref(
          storage,
          `profile_pictures/${user.uid}/${file.name}`,
        );

        const uploadSnapshot = await uploadBytes(fileRef, file);

        downloadURL = await getDownloadURL(uploadSnapshot.ref);
      }

      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        gender: values.gender,
        username: values.username,
        birthDate: values.birthDate
          ? values.birthDate.format('YYYY-MM-DD')
          : null,
        phoneNumber: values.phoneNumber || null,
        deliveryAddress: values.deliveryAddress,
        profilePictureUrl: downloadURL || null,
      });

      setShowSuccess(true);
      message.success('User information updated successfully.');
    } catch (error) {
      console.error('Error updating user information:', error);
      message.error(`Error: ${error}`);
    }
  };

  return (
    <div className={styles['main-container']}>
      <h1 className={styles.title}>Additional form</h1>
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        className={styles['form-style']}
        size="large"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Chooose your gender: "
          name="gender"
          rules={[{ required: true, message: 'Must chooose one!' }]}
        >
          <Radio.Group>
            <Radio value="female"> Female </Radio>
            <Radio value="male"> Male </Radio>
            <Radio value="other"> Other </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Enter your username: "
          name="username"
          rules={[{ required: true, message: 'Must enter a username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Enter your date of birth: "
          name="birthDate"
          rules={[{ required: true, message: 'Must enter a date!' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="Enter phone number: "
          name="phoneNumber"
          rules={[{ required: true, message: 'You must enter phone number!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Enter delivery address: "
          name="deliveryAddress"
          rules={[{ required: true, message: 'You must enter address!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Enter profile photo: "
          name="profilePicture"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload listType="picture-card">
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" className={styles.submitBtn} htmlType="submit">
            <PlusOutlined /> Submit
          </Button>
        </Form.Item>
      </Form>

      {showSuccess && (
        <div className={styles.background}>
          <div className={styles['success-alert']}>
            <CheckCircleFilled className={styles['alert-icon']} />
            <h3>Successfully signed up!</h3>
            <div className={styles['alert-btns']}>
              <Button
                style={{ backgroundColor: '#10b981' }}
                type="primary"
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  setShowSuccess(false);
                  form.resetFields();
                }}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
