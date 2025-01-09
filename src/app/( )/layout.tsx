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
        <div style={{ height: '240px', width: '990px' }}></div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
