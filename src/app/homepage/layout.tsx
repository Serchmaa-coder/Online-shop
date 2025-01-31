'use client';
import Footer from '../component/footer/page';
import Mainheader from '../component/mainheader/page';
import React, { useState, useEffect } from 'react';
import SearchBtn from '../component/search-button/page';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const divStyle = {
    height: windowWidth <= 768 ? '120px' : '240px',
  };

  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', margin: '0%' }}>
        <Mainheader />
        <SearchBtn />
        <div style={divStyle}></div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
