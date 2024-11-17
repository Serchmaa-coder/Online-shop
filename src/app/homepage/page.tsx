'use client';
import React from 'react';
import { Carousel } from 'antd';
import styles from './page.module.css';
import { Card } from 'antd';
import {
  AmazonCircleFilled,
  AndroidFilled,
  AppleFilled,
  ChromeFilled,
  DingtalkCircleFilled,
  DiscordFilled,
  GithubFilled,
  QqCircleFilled,
} from '@ant-design/icons';

const { Meta } = Card;
// import { getFirestore } from 'firebase/firestore';
//const db = getFirestore(app);

export default function Homepage() {
  return (
    <div className="lol">
      <div className={styles['carousel-section']}>
        <Carousel autoplay>
          <div>
            <img
              className={styles.contentStyle}
              src="https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1500w,f_auto,q_auto:best/rockcms/2024-06/240610-beauty-awards-2024-skincare-winners-vl-social-91be20.jpg"
            />
          </div>
          <div>
            <img
              className={styles.contentStyle}
              src="https://www.kitchenaid.com/is/image/content/dam/business-unit/kitchenaid/en-us/marketing-content/site-assets/page-content/pinch-of-help/filling-your-home-with-appliances/Filling-your-home-with-appliances-counter-3.jpg?fmt=png-alpha&qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0&scl=1&constrain=fit,1"
            />
          </div>
          <div>
            <img
              className={styles.contentStyle}
              src="https://marketplace.canva.com/EAFfT9NH-JU/1/0/1600w/canva-gray-minimalist-fashion-big-sale-banner-TvkdMwoxWP8.jpg"
            />
          </div>
          <div>
            <img
              className={styles.contentStyle}
              src="https://img.freepik.com/free-vector/electronics-store-template-design_23-2151143835.jpg"
            />
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
