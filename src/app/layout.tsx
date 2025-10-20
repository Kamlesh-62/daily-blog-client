"use client";
import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import StoreProvider from "./StoreProvider";
import { theme } from "@/theme";
import "../styles/globals.css";
import { AuthProvider } from "@/components/Provider/AppAuthenticatorProvider";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export default function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body suppressHydrationWarning>
        <AppRouterCacheProvider options={{ key: "mui", prepend: true, enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <StoreProvider>
              <AuthProvider>
                <main>{children}{modal}</main>
              </AuthProvider>
            </StoreProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}