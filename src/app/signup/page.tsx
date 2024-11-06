'use client';
import { CalendarDateRangeIcon } from "@heroicons/react/16/solid";
import SignUpLayout from "./layout";
import styles from "./page.module.css";
import { Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import HeaderOfAuthentication from "../../../component/header2/page";
import { Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import { Button } from 'antd';

const onChange: CheckboxProps['onChange'] = (e) => {
  console.log(`checked = ${e.target.checked}`);
};
const onDateChange: DatePickerProps<Dayjs[]>['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

export default function SignupPage() {
  return (
    <SignUpLayout>
    <HeaderOfAuthentication />

      <main className={styles.main}>

        <div className={styles.container}>
          
          <h1 className={styles.title}>Бүртгүүлэх</h1>
          <Input size="large" placeholder="Овгоо оруулна уу!" prefix={<UserOutlined />} className={styles.input} />
          <Input size="large" placeholder="Нэрээ оруулна уу!" prefix={<UserOutlined />} className={styles.input} />

          <div className={styles.con1}>
            <div className={styles.dobIcon}>
            <CalendarDateRangeIcon style={{height:"20px",width:"20px"}}/>
            </div>

          <p>Хүйсээ сонгоно уу!</p>

          <div className={styles.con}>
          <Checkbox onChange={onChange}>Эр</Checkbox>
          <Checkbox onChange={onChange}>Эм</Checkbox>
          <Checkbox onChange={onChange}>Бусад</Checkbox>
          </div>
          </div>

          <DatePicker onChange={onDateChange} placeholder="Төрсөн он сараа оруулна уу!" needConfirm style={{width:"500px",height:"50px"}}/>

          <Input size="large" placeholder="Майл хаягаа оруулна уу!" prefix={<UserOutlined />} className={styles.input} type="email"/>
          <Input size="large" placeholder="Нууц үгээ оруулна уу!" prefix={<UserOutlined />} className={styles.input} type="password"/>

          <Button type="primary" className={styles.submitBtn}>Бүртгүүлэх</Button>



        </div>
      </main>
    </SignUpLayout>
  );
}
