'use client';

import styled from "styled-components";
import { useApp } from "@/store/AppContext";
import { useAuth } from "@/store/AuthContext";
import { useIncomes } from "@/hooks/useIncome";
import { useExpenses } from "@/hooks/useExpenses";
import { useSavingsSettings } from "@/hooks/useSavings";
//import { useDebts } from "@/hooks/useDebts";
import { useCurrentCycle } from "@/hooks/useCycle";
import { formatCurrency, formatDate } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ShoppingCart, PiggyBank, TrendingUp, TrendingDown, PlusCircle, CreditCard } from "lucide-react";
import { motion } from "framer-motion";


export function DashboardPage() {
  const { setCurrentPage } = useApp();
  const { user } = useAuth();
  const { data: incomes = [], isLoading: incLoading } = useIncomes();
  const { data: expenses = [], isLoading: expLoading } = useExpenses();

  const { data: savingsSettings } = useSavingsSettings();
  //const { data: debts = [] } = useDebts();

  // Calculate cycle based on settings
  const currentCycle = useCurrentCycle();

  const totalIncome = Array.isArray(incomes) ? incomes.reduce((s, i) => s + Number(i.amount), 0) : 0;
  const totalExpenses = Array.isArray(expenses) ? expenses.reduce((s, e) => s + Number(e.amount), 0) : 0;
  //const totalDebt = Array.isArray(debts) ? debts.reduce((s, d) => s + Number(d.remaining_amount), 0) : 0;
  const savingsPercent = savingsSettings?.savings_percentage ?? 20;
  const savings = (totalIncome * savingsPercent) / 100;
  const balance = totalIncome - totalExpenses - savings;

  // Merge recent activity from both lists
  const recent = [
    ...(Array.isArray(incomes) ? incomes.map((i) => ({ id: i.id, type: 'income' as const, name: i.source_name, amount: Number(i.amount), category: i.category, date: i.created_at, isReleased: i.is_released })) : []),
    ...(Array.isArray(expenses) ? expenses.map((e) => ({ id: e.id, type: 'expense' as const, name: e.expense_name, amount: Number(e.amount), category: e.category, date: e.created_at, isReleased: e.is_released })) : []),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const isLoading = incLoading || expLoading;

  return (
    <SpaceStack>
      {/* Hero Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <HeroCard>
          <CardContent style={{ padding: '1.5rem' }}>
            <HeroHeader>
              <div>
                <UserName>👋 Welcome back, {user?.FullName || "User"}</UserName>
              </div>
              {currentCycle && (
                <CycleTextGroup>
                  <p>Current Cycle</p>
                  <p>{formatDate(currentCycle.startDate)} - {formatDate(currentCycle.endDate)}</p>
                </CycleTextGroup>
              )}
            </HeroHeader>
            <div style={{ marginTop: '1.5rem' }}>
              <WelcomeText>Available Balance</WelcomeText>
              {isLoading ? <Spinner style={{ margin: '0.5rem 0' }} /> : (
                <BalanceAmount>{formatCurrency(balance)}</BalanceAmount>
              )}
            </div>
          </CardContent>
        </HeroCard>
      </motion.div>

      {/* Summary Grid */}
      <SummaryGrid>
        {[
          { label: 'Income', value: totalIncome, color: 'green' as const, icon: TrendingUp },
          { label: 'Expenses', value: totalExpenses, color: 'red' as const, icon: TrendingDown },
          { label: 'Savings', value: savings, color: 'blue' as const, icon: PiggyBank },
          { label: 'Debt', value: 0, color: 'purple' as const, icon: CreditCard },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Card>
              <CardContent style={{ padding: '1rem' }}>
                <FlexRow>
                  <SummaryIconBox $color={stat.color}>
                    <stat.icon size={20} />
                  </SummaryIconBox>
                  <div>
                    <StatLabel>{stat.label}</StatLabel>
                    <StatValue>{isLoading ? '—' : formatCurrency(stat.value)}</StatValue>
                  </div>
                </FlexRow>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </SummaryGrid>

      {/* Quick Actions */}
      <QuickActionsGrid>
        <Button onClick={() => setCurrentPage("income")} style={{ height: '3.5rem', fontSize: '1rem' }}>
          <PlusCircle size={20} style={{ marginRight: '0.5rem' }} />
          Add Income
        </Button>
        <Button onClick={() => setCurrentPage("expenses")} variant="outline" style={{ height: '3.5rem', fontSize: '1rem' }}>
          <ShoppingCart size={20} style={{ marginRight: '0.5rem' }} />
          Add Expense
        </Button>
      </QuickActionsGrid>

      {/* Recent Activity */}
      <Card>
        <CardContent style={{ padding: '1.25rem' }}>
          <ActivityTitle>Recent Activity</ActivityTitle>
          {isLoading ? (
            <EmptyStateText>Loading transactions…</EmptyStateText>
          ) : recent.length === 0 ? (
            <EmptyStateText>No transactions yet. Start by adding income or expenses.</EmptyStateText>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recent.map((tx) => (
                <TransactionRow key={`${tx.type}-${tx.id}`}>
                  <FlexRow>
                    <SummaryIconBox $color={tx.type === "income" ? "green" : "red"}>
                      {tx.type === "income" ? <Wallet size={18} /> : <ShoppingCart size={18} />}
                    </SummaryIconBox>
                    <div>
                      <TxName>{tx.name}</TxName>
                      <TxCategory>{tx.category}</TxCategory>
                    </div>
                  </FlexRow>
                  <div style={{ textAlign: 'right' }}>
                    <TxAmount $isIncome={tx.type === "income"}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </TxAmount>
                    {!tx.isReleased && <p style={{ fontSize: '0.625rem', color: '#ea580c' }}>Pending</p>}
                  </div>
                </TransactionRow>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </SpaceStack>
  );
}

const SpaceStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeroCard = styled(Card)`
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  box-shadow: ${({ theme }) => theme.colors.shadowLg};
`;

const HeroHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const WelcomeText = styled.p`
  color: #dbeafe;
  font-size: 0.875rem;
`;

const UserName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
`;

const CycleTextGroup = styled.div`
  text-align: right;

  p:first-child {
    color: #dbeafe;
    font-size: 0.75rem;
  }

  p:last-child {
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

const BalanceAmount = styled.p`
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 0.25rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const SummaryIconBox = styled.div<{ $color: 'green' | 'red' | 'blue' | 'purple' }>`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color, theme }) => {
    switch ($color) {
      case 'green': return theme.colors.successBg;
      case 'red': return theme.colors.dangerBg;
      case 'purple': return theme.colors.purpleBg;
      default: return theme.colors.primaryLight;
    }
  }};
  color: ${({ $color, theme }) => {
    switch ($color) {
      case 'green': return theme.colors.success;
      case 'red': return theme.colors.danger;
      case 'purple': return theme.colors.purple;
      default: return theme.colors.primary;
    }
  }};
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StatLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatValue = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const ActivityTitle = styled.h3`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1rem;
`;

const TransactionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};

  &:last-child {
    border-bottom: none;
  }
`;

const TxName = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TxCategory = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TxAmount = styled.p<{ $isIncome: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ $isIncome, theme }) => ($isIncome ? theme.colors.success : theme.colors.danger)};
`;

const EmptyStateText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  padding: 2rem 0;
`;

const Spinner = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid rgba(255,255,255,0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;
