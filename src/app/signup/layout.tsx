export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: '0px', display: 'flex', flexDirection: 'column' }}>
        {children}
      </body>
    </html>
  );
}
