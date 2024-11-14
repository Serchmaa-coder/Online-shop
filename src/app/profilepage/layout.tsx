import Footer from '../../../component/footer/page';
import Mainheader from '../../../component/mainheader/page';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: '0px', display: 'flex', flexDirection: 'column' }}>
        <Mainheader />
        <div style={{ height: '200px' }}></div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
