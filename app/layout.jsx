import "./globals.css";

import { inter } from "./components/font";

export const metadata = {
  title: "Passify",
  description: "A secure, modern web application for managing passwords safely and efficiently.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
