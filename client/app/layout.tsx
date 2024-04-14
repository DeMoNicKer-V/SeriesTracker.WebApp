import { Layout, Menu } from "antd";
import "./globals.css";
import Link from "next/link";
import { Content, Footer, Header } from "antd/es/layout/layout";


const items = [
  {key: "home" , label: <Link href={"/"}>Home</Link>},
  {key: "series" , label: <Link href={"/series"}>Series</Link>}
]
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Layout style={{minHeight: "100vh"}}>
        <Header>
          <Menu theme="dark"
          mode="horizontal"
          items={items}
          style={{flex: 1, minWidth: 0}}
          />
        </Header>
        <Content style={{padding: "0 48px"}}>{children}</Content>
        <Footer style={{textAlign: "center"}}>
          Series Tracker 2023 Created by Shakov Victor
        </Footer>
        </Layout>
      </body>
    </html>
  );
}
