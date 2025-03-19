
// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import "./globals.css";
// import { ThemeProvider } from "@/components/theme/ThemeProvider";
// import { Toaster } from "@/components/ui/toaster";
// import { RoleProvider } from "@/components/context/RoleContext";


// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Sanzad International",
//   description: "Book Your Rides Safely",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <RoleProvider>
//         <ThemeProvider
//             attribute="class"
//             defaultTheme="system"
//             enableSystem
//             disableTransitionOnChange
//           >
        
//         {children}
//         <Toaster/>
//         </ThemeProvider>
//         </RoleProvider>
//       </body>
//     </html>
//   );
// }




import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientProviders from "./ClientProviders";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sanzad International",
  description: "Book Your Rides Safely",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
