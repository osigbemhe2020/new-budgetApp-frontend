'use client';

import { useState } from "react";
import styled from "styled-components";
import {
  useDebts,
  useActiveDebts,
  useDebtHistory,
  useCreateDebt,
  useSetRepaymentPlan,
  useMakePayment,
} from "@/hooks/useDebts";
import { formatCurrency } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, PlusCircle, Check, Loader2, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ApiDebt } from "@/lib/api";

const SpaceStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const SummaryCard = styled(Card)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.purpleBg} 0%, #f3e8ff 100%);
  border: 1px solid ${({ theme }) => theme.colors.purpleBorder};
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
`;

const DebtRow = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};

  &:last-child {
    border-bottom: none;
  }
`;

const PayButton = styled.button<{ $paid: boolean }>`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: none;
  background-color: ${({ $paid, theme }) => ($paid ? theme.colors.successBg : theme.colors.purpleBg)};
  color: ${({ $paid, theme }) => ($paid ? theme.colors.success : theme.colors.purple)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
`;

function DebtListItem({
  debt,
  onPay,
  isPaying,
  showPayButton = true,
}: {
  debt: ApiDebt;
  onPay?: (id: number) => void;
  isPaying?: boolean;
  showPayButton?: boolean;
}) {
  const remaining = Number(debt.debt_amount ?? debt.remaining_amount ?? debt.total_payable ?? 0);
  const monthly = (debt.monthly_principal !== undefined && debt.monthly_interest !== undefined)
    ? Number(debt.monthly_principal) + Number(debt.monthly_interest)
    : Number(debt.monthly_payment ?? 0);
  const isPaid = remaining <= 0 || debt.status === 'paid';

  return (
    <DebtRow
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <FlexRow>
        {showPayButton ? (
          <PayButton
            $paid={isPaid}
            onClick={() => !isPaid && onPay?.(debt.id)}
            disabled={isPaid || isPaying}
            title={isPaid ? 'Paid' : 'Make payment'}
          >
            {isPaying ? <Loader2 size={18} className="animate-spin" /> : isPaid ? <Check size={20} /> : <CreditCard size={20} />}
          </PayButton>
        ) : (
          <IconBox $bg="#f0fdf4" $color="#16a34a">
            <Check size={20} />
          </IconBox>
        )}
        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: isPaid ? '#9ca3af' : '#111827', textDecoration: isPaid ? 'line-through' : 'none' }}>
            {debt.description || `Debt #${debt.id}`}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Monthly: {formatCurrency(monthly)}
            {debt.interest_rate > 0 && ` • ${debt.interest_rate}% interest`}
            {debt.repayment_months && debt.repayment_months > 0 ? ` • ${debt.repayment_months}mo plan` : ''}
          </p>
        </div>
      </FlexRow>
      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: isPaid ? '#16a34a' : '#9333ea' }}>
        {formatCurrency(remaining)}
      </p>
    </DebtRow>
  );
}

export function DebtsPage() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [repaymentMonths, setRepaymentMonths] = useState("");

  const { data: debts = [], isLoading: allLoading } = useDebts();
  const { data: activeDebts = [], isLoading: activeLoading } = useActiveDebts();
  const { data: debtHistory = [], isLoading: historyLoading } = useDebtHistory();
  const createDebt = useCreateDebt();
  const setRepaymentPlan = useSetRepaymentPlan();
  const makePayment = useMakePayment();

  const isLoading = allLoading || activeLoading || historyLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    const created = await createDebt.mutateAsync({
      description: name,
      total_amount: Number(amount),
      interest_rate: Number(interestRate) || 0,
      due_date: dueDate || undefined,
    });

    if (repaymentMonths && Number(repaymentMonths) > 0) {
      await setRepaymentPlan.mutateAsync({
        id: created.id,
        repaymentMonths: Number(repaymentMonths),
      });
    }

    setName(""); setAmount(""); setDueDate(""); setInterestRate(""); setRepaymentMonths("");
    setOpen(false);
  };

  const totalDebt = debts.reduce((sum, d) => sum + Number(d.total_amount), 0);
  const remainingDebt = activeDebts.reduce((sum, d) => sum + Number(d.remaining_amount), 0);

  return (
    <SpaceStack>
      <PageHeader>
        <div>
          <Title>Debts</Title>
          <Subtitle>Track what you owe</Subtitle>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle size={18} style={{ marginRight: '0.5rem' }} />
              Add Debt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Debt</DialogTitle>
            </DialogHeader>
            <Form onSubmit={handleSubmit}>
              <div>
                <Label>Description</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Credit Card" style={{ marginTop: '0.25rem' }} />
              </div>
              <div>
                <Label>Total Amount (₦)</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" style={{ marginTop: '0.25rem' }} />
              </div>
              <div>
                <Label>Interest Rate (% optional)</Label>
                <Input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="0" style={{ marginTop: '0.25rem' }} />
              </div>
              <div>
                <Label>Repayment Plan (months optional)</Label>
                <Input type="number" min="1" value={repaymentMonths} onChange={(e) => setRepaymentMonths(e.target.value)} placeholder="e.g. 12" style={{ marginTop: '0.25rem' }} />
              </div>
              <div>
                <Label>Due Date (optional)</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ marginTop: '0.25rem' }} />
              </div>
              <Button type="submit" style={{ width: '100%', height: '2.75rem', marginTop: '0.5rem' }} disabled={createDebt.isPending || setRepaymentPlan.isPending}>
                {createDebt.isPending ? 'Saving…' : 'Add Debt'}
              </Button>
            </Form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Summary Card */}
      <SummaryCard>
        <CardContent style={{ padding: '1.25rem' }}>
          <FlexRow style={{ marginBottom: '1rem' }}>
            <IconBox $bg="#9333ea" $color="#ffffff">
              <CreditCard size={24} />
            </IconBox>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#7e22ce' }}>Total Debt</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#581c87' }}>
                {isLoading ? '…' : formatCurrency(totalDebt)}
              </p>
            </div>
          </FlexRow>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: '#7e22ce' }}>Remaining</span>
            <span style={{ fontWeight: 600, color: '#581c87' }}>{formatCurrency(remainingDebt)}</span>
          </div>
        </CardContent>
      </SummaryCard>

      {/* Active Debts */}
      <Card>
        <CardContent style={{ padding: '1.25rem' }}>
          <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Active Debts</h3>
          {isLoading ? (
            <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>Loading…</p>
          ) : activeDebts.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>No active debts.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <AnimatePresence>
                {activeDebts.map((debt) => (
                  <DebtListItem
                    key={debt.id}
                    debt={debt}
                    onPay={(id) => makePayment.mutate(id)}
                    isPaying={makePayment.isPending}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debt History */}
      {debtHistory.length > 0 && (
        <Card>
          <CardContent style={{ padding: '1.25rem' }}>
            <FlexRow style={{ marginBottom: '1rem' }}>
              <History size={18} style={{ color: '#6b7280' }} />
              <h3 style={{ fontWeight: 600, color: '#111827' }}>Payment History</h3>
            </FlexRow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <AnimatePresence>
                {debtHistory.map((debt) => (
                  <DebtListItem key={debt.id} debt={debt} showPayButton={false} />
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}
    </SpaceStack>
  );
}
