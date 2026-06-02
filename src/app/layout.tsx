import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Manrope } from "next/font/google"

import "./globals.css"

import { ThemeProvider } from "@/providers/theme-provider"
import { Toaster } from "sonner"
import ReactQueryProvider from "@/providers/ReactQueryProvider"
import { ReduxProvider } from "@/redux/provider"

const manrope = Manrope({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Cliporra",
  description: "Share AI powered videos with your friends",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.className} bg-background text-foreground`}
      >
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ReduxProvider>
            <ReactQueryProvider>
            {children}
            </ReactQueryProvider>
            </ReduxProvider>
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}