import Footer from '../../../component/footer/page';
import Header from '../../../component/header/page';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: '0px', display: 'flex', flexDirection: 'column' }}>
        <Header />
<<<<<<< HEAD
        <div style={{ height: '200px', width: '990px' }}></div>
=======
        <div style={{ height: '240px', width: '990px' }}></div>
>>>>>>> 391d1e7 (a)
        {children}
        <Footer />
      </body>
    </html>
  );
}
