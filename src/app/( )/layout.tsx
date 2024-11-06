import Header from "../../../component/header/page";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{margin:"0px"}}>
      <Header />
        {children}
      </body>
    </html>
  );
}
