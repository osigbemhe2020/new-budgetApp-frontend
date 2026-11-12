'use client';

import { useState, useEffect } from "react";
import { useApp } from "@/store/AppContext";
import { useAuth } from "@/store/AuthContext";
import { Layout } from "@/components/Layout";
import { ToastContainer } from "@/components/ToastContainer";
import { DashboardPage } from "@/views/DashboardPage";
import { IncomePage } from "@/views/IncomePage";
import { ExpensesPage } from "@/views/ExpensesPage";
import { SavingsPage } from "@/views/SavingsPage";
import { DebtsPage } from "@/views/DebtsPage";
import { InflationPage } from "@/views/InflationPage";
import { TemplatesPage } from "@/views/TemplatesPage";
import { TaxPage } from "@/views/TaxPage";
import { ProfilePage } from "@/views/ProfilePage";
import { InsightsPage } from "@/views/InsightsPage";
import { SettingsPage } from "@/views/SettingsPage";
import { useRouter } from "next/navigation";

function AppContent() {
  const { currentPage } = useApp();
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.replace('/auth/signin');
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  if (!mounted || isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{
            width: '3rem', height: '3rem',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTop: '3px solid #818cf8',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Loading BudgetWise…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":   return <DashboardPage />;
      case "income":      return <IncomePage />;
      case "expenses":    return <ExpensesPage />;
      case "savings":     return <SavingsPage />;
      case "debts":       return <DebtsPage />;
      case "inflation":   return <InflationPage />;
      case "templates":   return <TemplatesPage />;
      case "tax":         return <TaxPage />;
      case "profile":     return <ProfilePage />;
      case "insights":    return <InsightsPage />;
      case "settings":    return <SettingsPage />;
      default:            return <DashboardPage />;
    }
  };

  return (
    <>
      <Layout>
        {renderPage()}
      </Layout>
      <ToastContainer />
    </>
  );
}

// ✅ No extra <AppProvider> wrapper – it's already provided in the layout
export default function Home() {
  return <AppContent />;
}