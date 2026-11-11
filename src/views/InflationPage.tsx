'use client';

import styled from "styled-components";
import { useInflationSummary } from "@/hooks/useInflation";
import { useExpenses } from "@/hooks/useExpenses";
import { formatCurrency } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const SpaceStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SummaryCard = styled(Card)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.orangeBg} 0%, #ffedd5 100%);
  border: 1px solid ${({ theme }) => theme.colors.orangeBorder};
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconBox = styled.div<{ $bg: string; $color: string }>`
  height: 3rem;
  width: 3rem;
  border-radius: ${({ theme }) => theme.radii.xl};
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const InfoBox = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;

  span:first-child {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const GridTwo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

export function InflationPage() {
  const { data: summary } = useInflationSummary();
  const { data: expenses = [] } = useExpenses();

  const totalExpenses = Array.isArray(expenses) ? expenses.reduce((s, e) => s + Number(e.amount), 0) : 0;
  const totalItems = summary?.totalItems ?? 0;

  // Use real inflation rate from summary, fall back to Nigeria's typical 3.5%
  const inflationRate = summary?.overallInflationRate ?? 3.5;
  const monthlyImpact = inflationRate / 12;
  const purchasingPowerLoss = (totalExpenses * monthlyImpact) / 100;

  return (
    <SpaceStack>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Inflation Tracker</h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Understand your purchasing power</p>
      </div>

      {/* Inflation Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <SummaryCard>
          <CardContent style={{ padding: '1.5rem' }}>
            <FlexRow style={{ marginBottom: '1rem' }}>
              <IconBox $bg="#ea580c" $color="#ffffff">
                <LineChart size={24} />
              </IconBox>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#c2410c' }}>
                  {totalItems > 0 ? 'Tracked Inflation Rate' : 'Current Inflation Rate'}
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7c2d12' }}>{inflationRate.toFixed(1)}%</p>
              </div>
            </FlexRow>
            <InfoBox>
              <InfoRow>
                <span>Monthly Impact</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{monthlyImpact.toFixed(2)}%</span>
              </InfoRow>
              <InfoRow>
                <span>Purchasing Power Loss</span>
                <span style={{ fontWeight: 600, color: '#dc2626' }}>{formatCurrency(purchasingPowerLoss)}</span>
              </InfoRow>
              {totalItems > 0 && (
                <InfoRow>
                  <span>Tracked Items</span>
                  <span style={{ fontWeight: 600, color: '#111827' }}>{totalItems}</span>
                </InfoRow>
              )}
            </InfoBox>
          </CardContent>
        </SummaryCard>
      </motion.div>

      {/* Items tracked from backend */}
      {summary && Array.isArray(summary.items) && summary.items.length > 0 && (
        <Card>
          <CardContent style={{ padding: '1.25rem' }}>
            <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Tracked Price Changes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {summary.items.slice(0, 6).map((item) => {
                const increased = item.inflationRate > 0;
                return (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>{item.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.category}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{formatCurrency(item.currentPrice)}</p>
                      <p style={{ fontSize: '0.75rem', color: increased ? '#dc2626' : '#16a34a', display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end' }}>
                        {increased ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(item.inflationRate).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Impact Analysis */}
      <Card>
        <CardContent style={{ padding: '1.25rem' }}>
          <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Impact Analysis</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FlexRow style={{ alignItems: 'flex-start' }}>
              <IconBox $bg="#fef2f2" $color="#dc2626" style={{ height: '2.5rem', width: '2.5rem', borderRadius: '0.5rem' }}>
                <TrendingDown size={20} />
              </IconBox>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>Expenses Impact</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Your monthly expenses of {formatCurrency(totalExpenses)} lose {formatCurrency(purchasingPowerLoss)} in value each month due to inflation.
                </p>
              </div>
            </FlexRow>

            <FlexRow style={{ alignItems: 'flex-start' }}>
              <IconBox $bg="#f0fdf4" $color="#16a34a" style={{ height: '2.5rem', width: '2.5rem', borderRadius: '0.5rem' }}>
                <TrendingUp size={20} />
              </IconBox>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>Income Protection</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  To maintain purchasing power, your income should grow by at least {inflationRate.toFixed(1)}% annually.
                </p>
              </div>
            </FlexRow>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
        <CardContent style={{ padding: '1.25rem' }}>
          <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>Inflation Tips</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
            <p>• Invest in assets that outpace inflation (stocks, real estate)</p>
            <p>• Build an emergency fund to avoid selling investments during downturns</p>
            <p>• Review and adjust your budget quarterly</p>
            <p>• Consider inflation-protected securities for long-term savings</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <GridTwo>
        <Card>
          <CardContent style={{ padding: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Items Tracked</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginTop: '0.25rem' }}>{totalItems}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Annual Impact</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#dc2626', marginTop: '0.25rem' }}>{formatCurrency(purchasingPowerLoss * 12)}</p>
          </CardContent>
        </Card>
      </GridTwo>
    </SpaceStack>
  );
}
