export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{margin:"0px",padding:"0px"}}>
      <body style={{margin:"0px"}}>
        {children}
      </body>
    </html>
  );
}
