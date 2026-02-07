import "./globals.css";
import type { Metadata } from "next";
import ToasterContext from "./context/ToasterContext";
import { AuthContext } from "./context/AuthContext";
import ActiveStatus from "./components/ActiveStatus";


export const metadata: Metadata = {
  title: "Messenger clone",
  description: "Messenger clone done by Alsegurarp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
