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
          label="Хүйсээ сонгоно уу: "
          name="gender"
          rules={[{ required: true, message: 'Хүйсээ сонгоно уу!' }]}
        >
          <Radio.Group>
            <Radio value="female"> Эмэгтэй </Radio>
            <Radio value="male"> Эрэгтэй </Radio>
            <Radio value="other"> Бусад </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Хэрэглэгчийн нэрээ оруулна уу: "
          name="username"
          rules={[{ required: true, message: 'Хэрэглэгчийн нэр оруулна уу!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Төрсөн он сараа оруулна уу: "
          name="birthDate"
          rules={[{ required: true, message: 'Төрсөн он сараа оруулна уу!' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="Утасны дугаараа оруулна уу: "
          name="phoneNumber"
          rules={[{ required: true, message: 'Утасны дугаараа  оруулна уу!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Хүргэлтийн хаягаа оруулна уу: "
          name="deliveryAddress"
          rules={[{ required: true, message: 'Хүргэлтийн хаягаа оруулна уу!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Нүүр зургаа оруулна уу: "
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
            <PlusOutlined /> Оруулах
          </Button>
        </Form.Item>
      </Form>

      {showSuccess && (
        <div className={styles.background}>
          <div className={styles['success-alert']}>
            <CheckCircleFilled className={styles['alert-icon']} />
            <h3>Амжилттай бүртгэгдлээ!</h3>
            <div className={styles['alert-btns']}>
              <Button
                style={{ backgroundColor: '#10b981' }}
                type="primary"
                onClick={() => router.push('/login')}
              >
                Нэвтрэх
              </Button>
              <Button
                onClick={() => {
                  setShowSuccess(false);
                  form.resetFields();
                }}
              >
                Буцах
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
