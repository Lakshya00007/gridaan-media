import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthQuerySync from "./components/AuthQuerySync";
import { NotificationProvider } from "./context/NotificationContext";
import { queryClient } from "./lib/queryClient";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <NotificationProvider>
        <ErrorBoundary reloadOnRetry>
          <AuthQuerySync />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1f2937',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <App />
        </ErrorBoundary>
        </NotificationProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </StrictMode>
);
