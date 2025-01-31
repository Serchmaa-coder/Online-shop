import Footer from '../component/footer/page';
import HeaderOfAuthentication from '../component/header2/page';

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: '0px', display: 'flex', flexDirection: 'column' }}>
        <HeaderOfAuthentication />
        {children}
        <Footer />
      </body>
    </html>
  );
}
