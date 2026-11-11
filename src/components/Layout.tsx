'use client';

import React from 'react';
import styled from 'styled-components';
import { useApp } from "@/store/AppContext";
import { useAuth } from "@/store/AuthContext";
import { useLogout } from "@/hooks/useAuth";
import { PageId } from "@/types";
import {
  Home,
  Wallet,
  ShoppingCart,
  PiggyBank,
  CreditCard,
  TrendingUp,
  List,
  Receipt,
  User,
  PieChart,
  Settings,
  LogOut,
} from "lucide-react";

const navItems: { id: PageId; label: string; icon: React.ElementType; disabled?: boolean }[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "income",    label: "Income",    icon: Wallet },
  { id: "expenses",  label: "Expenses",  icon: ShoppingCart },
  { id: "savings",   label: "Savings",   icon: PiggyBank },
  { id: "debts",     label: "Debts",     icon: CreditCard, disabled: true },
  { id: "inflation", label: "Inflation", icon: TrendingUp, disabled: true },
  { id: "templates", label: "Templates", icon: List, disabled: true },
  { id: "tax",       label: "Tax",       icon: Receipt },
  { id: "profile",   label: "Profile",   icon: User },
  { id: "insights",  label: "Insights",  icon: PieChart },
  { id: "settings",  label: "Settings",  icon: Settings },
];

const SidebarContainer = styled.aside`
  display: none;
  flex-direction: column;
  width: 16rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 40;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const LogoTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const NavList = styled.nav`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
`;

const NavButton = styled.button<{ $active: boolean; $disabled?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.primaryLight : theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-bottom: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const UserAvatar = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  flex-shrink: 0;
`;

const UserName = styled.p`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserEmail = styled.p`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dangerBg};
  }
`;

export function Sidebar() {
  const { currentPage, setCurrentPage } = useApp();
  const { user } = useAuth();
  const logoutMutation = useLogout();

  // const initials = user?.FullName
  //   ? user.FullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  //   : 'BF';

  return (
    <SidebarContainer>
      <SidebarHeader>
        <LogoTitle>BudgetWise</LogoTitle>
      </SidebarHeader>
      <NavList>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavButton
              key={item.id}
              onClick={() => !item.disabled && setCurrentPage(item.id)}
              $active={currentPage === item.id && !item.disabled}
              $disabled={item.disabled}
              disabled={item.disabled}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavButton>
          );
        })}
      </NavList>
      <SidebarFooter>
        
        <LogoutButton onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
          <LogOut size={18} />
          {logoutMutation.isPending ? 'Logging out…' : 'Log Out'}
        </LogoutButton>
      </SidebarFooter>
    </SidebarContainer>
  );
}

const BottomNavContainer = styled.nav`
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 40;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const BottomNavInner = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 4rem;
`;

const BottomNavButton = styled.button<{ $active: boolean; $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  background: transparent;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
`;

const LabelText = styled.span`
  font-size: 0.625rem;
  font-weight: 500;
`;

export function BottomNav() {
  const { currentPage, setCurrentPage } = useApp();
  const mainItems = navItems.slice(0, 5);

  return (
    <BottomNavContainer>
      <BottomNavInner>
        {mainItems.map((item) => {
          const Icon = item.icon;
          return (
            <BottomNavButton
              key={item.id}
              onClick={() => !item.disabled && setCurrentPage(item.id)}
              $active={currentPage === item.id && !item.disabled}
              $disabled={item.disabled}
              disabled={item.disabled}
            >
              <Icon size={20} />
              <LabelText>{item.label}</LabelText>
            </BottomNavButton>
          );
        })}
      </BottomNavInner>
    </BottomNavContainer>
  );
}

const LayoutWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main`
  padding-bottom: 5rem;

  @media (min-width: 1024px) {
    margin-left: 16rem;
    padding-bottom: 0;
  }
`;

const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 1rem;

  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutWrapper>
      <Sidebar />
      <MainContent>
        <Container>{children}</Container>
      </MainContent>
      <BottomNav />
    </LayoutWrapper>
  );
}