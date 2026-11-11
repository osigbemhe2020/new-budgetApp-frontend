'use client';

import styled from "styled-components";
import { useIncomes } from "@/hooks/useIncome";
import { useExpenses } from "@/hooks/useExpenses";
import { useSavingsSettings } from "@/hooks/useSavings";
import { useCurrentCycle } from "@/hooks/useCycle";
import { useApp } from "@/store/AppContext";
import { formatCurrency, formatDate } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import {
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Banknote,
  Coins,
  Lightbulb,
  Target,
  Calendar,
  ArrowRightCircle,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";

const SpaceStack = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const HeaderIconBox = styled.div`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 0.25rem;
`;

const GridFour = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const GridTwo = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const GridThree = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MiniIconBox = styled.div<{ $bg: string; $color: string }>`
  height: 2rem;
  width: 2rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoryBarTrack = styled.div`
  height: 0.375rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.full};
  overflow: hidden;
  margin-top: 0.25rem;
`;

const CategoryBarFill = styled(motion.div) <{ $gradient: string }>`
  height: 100%;
  background: ${({ $gradient }) => $gradient};
  border-radius: ${({ theme }) => theme.radii.full};
`;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 26 } },
};

export function InsightsPage() {
  const { data: incomes = [], isLoading: incLoading } = useIncomes();
  const { data: expenses = [], isLoading: expLoading } = useExpenses();
  const { data: savingsSettings } = useSavingsSettings();
  const activeCycle = useCurrentCycle();

  const isLoading = incLoading || expLoading;

  const allIncomes = Array.isArray(incomes) ? incomes : [];
  const allExpenses = Array.isArray(expenses) ? expenses : [];

  const totalIncome = allIncomes.reduce((s, i) => s + Number(i.amount), 0);
  const totalExpenses = allExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const savingsPercent = savingsSettings?.savings_percentage ?? 20;
  const savingsAmount = (totalIncome * savingsPercent) / 100;
  const balance = totalIncome - totalExpenses - savingsAmount;

  const savingsRate = totalIncome > 0 ? Math.round((savingsAmount / totalIncome) * 100) : 0;
  const expenseRate = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;

  // Category breakdowns
  const categoryTotals = allExpenses.reduce<Record<string, number>>((acc, tx) => {
    const cat = tx.category || tx.expense_name || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(tx.amount);
    return acc;
  }, {});
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0];
  const topCategoryPercent = topCategory && totalExpenses > 0 ? Math.round((topCategory[1] / totalExpenses) * 100) : 0;

  const incomeCategories = allIncomes.reduce<Record<string, number>>((acc, tx) => {
    const cat = tx.source_name || tx.name || tx.category || 'Income';
    acc[cat] = (acc[cat] || 0) + Number(tx.amount);
    return acc;
  }, {});
  const topIncomeSource = Object.entries(incomeCategories).sort((a, b) => b[1] - a[1])[0];

  // Daily averages
  const daysInCycle = activeCycle
    ? Math.max(
      1,
      Math.round(
        (new Date(activeCycle.endDate).getTime() - new Date(activeCycle.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
      ) + 1
    )
    : 30;
  const dailyAvgExpense = totalExpenses / daysInCycle;
  const dailyAvgIncome = totalIncome / daysInCycle;
  const totalTxCount = allIncomes.length + allExpenses.length;

  return (
    <SpaceStack variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item}>
        <FlexRow>
          <HeaderIconBox>
            <PieChart size={22} />
          </HeaderIconBox>
          <div>
            <Title>Insights</Title>
            <Subtitle>Your financial intelligence dashboard</Subtitle>
          </div>
        </FlexRow>
      </motion.div>

      {/* Summary Top Cards */}
      <motion.div variants={item}>
        <GridFour>
          {[
            { label: 'Income', value: formatCurrency(totalIncome), sub: dailyAvgIncome > 0 ? `${formatCurrency(Math.round(dailyAvgIncome))}/day` : 'No data', bg: '#f0fdf4', color: '#16a34a', icon: TrendingUp },
            { label: 'Expenses', value: formatCurrency(totalExpenses), sub: dailyAvgExpense > 0 ? `${formatCurrency(Math.round(dailyAvgExpense))}/day` : 'No data', bg: '#fef2f2', color: '#dc2626', icon: TrendingDown },
            { label: 'Balance', value: formatCurrency(balance), sub: balance >= 0 ? 'Surplus' : 'Deficit', bg: '#eff6ff', color: '#2563eb', icon: Banknote },
            { label: 'Savings', value: formatCurrency(savingsAmount), sub: `Target: ${savingsPercent}%`, bg: '#f3e8ff', color: '#9333ea', icon: Coins },
          ].map(({ label, value, sub, bg, color, icon: Icon }) => (
            <Card key={label}>
              <CardContent style={{ padding: '1rem' }}>
                <FlexRow style={{ marginBottom: '0.5rem' }}>
                  <MiniIconBox $bg={bg} $color={color}><Icon size={18} /></MiniIconBox>
                  <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>{label}</span>
                </FlexRow>
                <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>{isLoading ? '…' : value}</p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>{sub}</p>
              </CardContent>
            </Card>
          ))}
        </GridFour>
      </motion.div>

      {/* Spending & Income Breakdown */}
      <motion.div variants={item}>
        <GridTwo>
          {/* Top Spending Categories */}
          <Card>
            <CardContent style={{ padding: '1.25rem' }}>
              <FlexRow style={{ marginBottom: '1rem' }}>
                <MiniIconBox $bg="#fef2f2" $color="#dc2626" style={{ height: '2.5rem', width: '2.5rem' }}>
                  <Receipt size={20} />
                </MiniIconBox>
                <h3 style={{ fontWeight: 600, color: '#111827' }}>Top Spending Categories</h3>
              </FlexRow>
              {sortedCategories.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>No expenses recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {sortedCategories.slice(0, 5).map(([cat, amount], i) => {
                    const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
                    return (
                      <div key={cat}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          <span style={{ color: '#374151' }}>{cat}</span>
                          <span style={{ fontWeight: 500, color: '#111827' }}>{formatCurrency(amount)}</span>
                        </div>
                        <CategoryBarTrack>
                          <CategoryBarFill
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                            $gradient="linear-gradient(90deg, #f87171 0%, #ef4444 100%)"
                          />
                        </CategoryBarTrack>
                      </div>
                    );
                  })}
                  {topCategory && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ArrowDownRight size={14} style={{ color: '#ef4444' }} />
                        Top spender: <strong>{topCategory[0]}</strong> at <strong>{topCategoryPercent}%</strong> of expenses
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Income Sources */}
          <Card>
            <CardContent style={{ padding: '1.25rem' }}>
              <FlexRow style={{ marginBottom: '1rem' }}>
                <MiniIconBox $bg="#f0fdf4" $color="#16a34a" style={{ height: '2.5rem', width: '2.5rem' }}>
                  <LineChart size={20} />
                </MiniIconBox>
                <h3 style={{ fontWeight: 600, color: '#111827' }}>Income Sources</h3>
              </FlexRow>
              {allIncomes.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>No income recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Object.entries(incomeCategories).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([cat, amount], i) => {
                    const pct = totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0;
                    return (
                      <div key={cat}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          <span style={{ color: '#374151' }}>{cat}</span>
                          <span style={{ fontWeight: 500, color: '#111827' }}>{formatCurrency(amount)}</span>
                        </div>
                        <CategoryBarTrack>
                          <CategoryBarFill
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                            $gradient="linear-gradient(90deg, #4ade80 0%, #22c55e 100%)"
                          />
                        </CategoryBarTrack>
                      </div>
                    );
                  })}
                  {topIncomeSource && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ArrowUpRight size={14} style={{ color: '#22c55e' }} />
                        Top source: <strong>{topIncomeSource[0]}</strong>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </GridTwo>
      </motion.div>

      {/* Ratios */}
      <motion.div variants={item}>
        <GridThree>
          <Card>
            <CardContent style={{ padding: '1.25rem' }}>
              <FlexRow style={{ marginBottom: '0.75rem' }}>
                <MiniIconBox $bg="#fffbeb" $color="#d97706">
                  <Target size={18} />
                </MiniIconBox>
                <h3 style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>Expense Ratio</h3>
              </FlexRow>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{expenseRate}%</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                {expenseRate > 80
                  ? 'High — consider cutting costs'
                  : expenseRate > 50
                    ? 'Moderate — room for improvement'
                    : 'Low — great control'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ padding: '1.25rem' }}>
              <FlexRow style={{ marginBottom: '0.75rem' }}>
                <MiniIconBox $bg="#eff6ff" $color="#2563eb">
                  <Layers size={18} />
                </MiniIconBox>
                <h3 style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>Transaction Volume</h3>
              </FlexRow>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{totalTxCount}</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                {allIncomes.length} income · {allExpenses.length} expenses
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ padding: '1.25rem' }}>
              <FlexRow style={{ marginBottom: '0.75rem' }}>
                <MiniIconBox $bg="#f3e8ff" $color="#9333ea">
                  <Lightbulb size={18} />
                </MiniIconBox>
                <h3 style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>Smart Tip</h3>
              </FlexRow>
              <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                {savingsRate < savingsPercent
                  ? `Increase your savings rate to ${savingsPercent}% for better financial security.`
                  : balance < 0
                    ? 'Your expenses exceed income. Try reducing non-essential spending.'
                    : 'Great work! You\'re on track with your savings goals.'}
              </p>
            </CardContent>
          </Card>
        </GridThree>
      </motion.div>

      {/* Active Cycle Info */}
      {activeCycle && (
        <motion.div variants={item}>
          <Card style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
            <CardContent style={{ padding: '1.25rem' }}>
              <FlexRow style={{ justifyContent: 'space-between' }}>
                <FlexRow>
                  <MiniIconBox $bg="#dbeafe" $color="#2563eb" style={{ height: '2.5rem', width: '2.5rem' }}>
                    <Calendar size={20} />
                  </MiniIconBox>
                  <div>
                    <h3 style={{ fontWeight: 600, color: '#111827' }}>Current Cycle</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {formatDate(activeCycle.startDate)} — {formatDate(activeCycle.endDate)} · {daysInCycle} days
                    </p>
                  </div>
                </FlexRow>
                <FlexRow style={{ color: '#1d4ed8', fontSize: '0.875rem' }}>
                  <ArrowRightCircle size={16} />
                  Active
                </FlexRow>
              </FlexRow>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </SpaceStack>
  );
}