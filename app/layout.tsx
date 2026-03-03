import type { Metadata } from "next";
import MuiProvider from "./MuiProvider";
import ConfigureAmplifyClientSide from "./components/ConfigureAmplifyClientSide";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "LinkedOut - Professional Network",
  description: "Connect with professionals and grow your career",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MuiProvider>
          <ConfigureAmplifyClientSide />
          <Navbar />
          {children}
        </MuiProvider>
      </body>
    </html>
  );
}
