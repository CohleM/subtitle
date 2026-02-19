import "../../styles/global.css";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "PrimeClip",
  description: "PrimeClip",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background">{children}</body>
    </html>
  );
}
// app/layout.tsx or pages/_app.tsx


// import { Inter } from 'next/font/google';

// const inter = Inter({
//   subsets: ['latin'],
//   display: 'swap',
//   // Tight tracking similar to the image
//   variable: '--font-inter',
// });


// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className={inter.variable}>
//       <body className={`${inter.className} antialiased`}>
//         {children}
//       </body>
//     </html>
//   );
// }





