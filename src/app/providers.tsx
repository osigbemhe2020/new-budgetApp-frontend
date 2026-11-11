'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import StyledComponentsProvider from '@/lib/StyledComponentsProvider';
import { AuthProvider } from '@/store/AuthContext';
import { AppProvider } from '@/store/AppContext';   

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <StyledComponentsProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>         
          <AuthProvider>
            {children}
          </AuthProvider>
        </AppProvider>
      </QueryClientProvider>
    </StyledComponentsProvider>
  );
}