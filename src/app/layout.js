import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "./provider";
import AuthGuard from "../components/authguard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fianut Timein",
  description: "Fianut's clock-in / clock-out attendance module.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <AuthGuard>{children}</AuthGuard>
        </Provider>
      </body>
    </html>
  );
}
