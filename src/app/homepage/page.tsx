'use client';
import React from 'react';
import { Carousel } from 'antd';
import styles from './page.module.css';
import { Card } from 'antd';
import { style } from 'framer-motion/m';
import {
  AmazonCircleFilled,
  AndroidFilled,
  AppleFilled,
  AppleOutlined,
  ChromeFilled,
  DingtalkCircleFilled,
  DiscordFilled,
  GithubFilled,
  QqCircleFilled,
} from '@ant-design/icons';

const { Meta } = Card;

export default function Homepage() {
  return (
    <div className="lol">
      <div className={styles['carousel-section']}>
        <Carousel autoplay>
          <div>
            <div className={styles.contentStyle}>IMAGE ONE</div>
          </div>
          <div>
            <div className={styles.contentStyle}>IMAGE TWO</div>
          </div>
          <div>
            <div className={styles.contentStyle}>IMAGE THREE</div>
          </div>
          <div>
            <div className={styles.contentStyle}>IMAGE FOUR</div>
          </div>
        </Carousel>
      </div>
      <div className={styles['popular-category-section']}>
        <h3 className={styles.titles}>Explore popular category</h3>
        <div className={styles.categories}>
          <div className={styles.items}>
            <Card
              hoverable
              style={{
                width: '300px',
                height: '350px',
                display: 'flex',
                flexDirection: 'column',
              }}
              cover={
                <img
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="Urban section" />
            </Card>
          </div>
          <div className={styles.items}>
            <Card
              hoverable
              style={{
                width: '300px',
                height: '350px',
                display: 'flex',
                flexDirection: 'column',
              }}
              cover={
                <img
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="Urban section" />
            </Card>
          </div>
          <div className={styles.items}>
            <Card
              hoverable
              style={{
                width: '300px',
                height: '350px',
                display: 'flex',
                flexDirection: 'column',
              }}
              cover={
                <img
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="Urban section" />
            </Card>
          </div>
          <div className={styles.items}>
            <Card
              hoverable
              style={{
                width: '300px',
                height: '350px',
                display: 'flex',
                flexDirection: 'column',
              }}
              cover={
                <img
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="Urban section" />
            </Card>
          </div>
          <div className={styles.items}>
            <Card
              hoverable
              style={{
                width: '300px',
                height: '350px',
                display: 'flex',
                flexDirection: 'column',
              }}
              cover={
                <img
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="Urban section" />
            </Card>
          </div>
          <div className={styles.items}>
            <Card
              hoverable
              style={{
                width: '300px',
                height: '350px',
                display: 'flex',
                flexDirection: 'column',
              }}
              cover={
                <img
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="Urban section" />
            </Card>
          </div>
          <div className={styles.items}>
            <Card
              hoverable
              style={{
                width: '300px',
                height: '350px',
                display: 'flex',
                flexDirection: 'column',
              }}
              cover={
                <img
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="Urban section" />
            </Card>
          </div>
          <div className={styles.items}>
            <Card
              hoverable
              style={{
                width: '300px',
                height: '350px',
                display: 'flex',
                flexDirection: 'column',
              }}
              cover={
                <img
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="Urban section" />
            </Card>
          </div>
        </div>
        <div className={styles['brand-section']}>
          <h3 className={styles.titles}>Brands</h3>
          <div className={styles['brand-items']}>
            <div className={styles['round-items']}>
              <AppleFilled />
            </div>
            <div className={styles['round-items']}>
              <AndroidFilled />
            </div>
            <div className={styles['round-items']}>
              <DiscordFilled />
            </div>
            <div className={styles['round-items']}>
              <AmazonCircleFilled />
            </div>
            <div className={styles['round-items']}>
              <ChromeFilled />
            </div>
            <div className={styles['round-items']}>
              <GithubFilled />
            </div>
            <div className={styles['round-items']}>
              <DingtalkCircleFilled />
            </div>
            <div className={styles['round-items']}>
              <QqCircleFilled />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
