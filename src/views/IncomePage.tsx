'use client';

import { useState } from "react";
import styled from "styled-components";
import { useIncomes, useCreateIncome, useUpdateIncome, useDeleteIncome } from "@/hooks/useIncome";
import { useExpenseLocked } from "@/hooks/useCycle";
import { formatCurrency, formatDate, INCOME_CATEGORIES } from "@/constants";
import { ApiIncome } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, PlusCircle, Trash2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function IncomePage() {
  // Dialog state
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [editingIncomeId, setEditingIncomeId] = useState<number | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // Data & mutations
  const { data: incomes = [], isLoading } = useIncomes();
  const isLocked = useExpenseLocked();
  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();
  const deleteIncome = useDeleteIncome();

  const totalIncome = Array.isArray(incomes)
    ? incomes.reduce((sum, t) => sum + Number(t.amount), 0)
    : 0;

  // Reset all form-related state to defaults
  const resetForm = () => {
    setName("");
    setAmount("");
    setCategory("");
    setEditingIncomeId(null);
    setMode('add');
  };

  // Open dialog for adding a new income
  const openAddDialog = () => {
    resetForm(); // ensure clean slate
    setOpen(true);
  };

  // Open dialog for editing an existing income
  const openEditDialog = (income: ApiIncome) => {
    setMode('edit');
    setEditingIncomeId(income.id);
    setName(income.source_name);
    setAmount(String(income.amount));
    setCategory(income.category ?? 'Salary');
    setOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called', { mode, editingIncomeId, name, amount, category });
    if (!name || !amount) return;

    if (mode === 'edit' && editingIncomeId) {
      console.log('Updating income:', editingIncomeId, name, amount, category);
      await updateIncome.mutateAsync({
        id: editingIncomeId,
        data: {
          name: name,
          amount: Number(amount),
          // category is not updated in your API? Keep as is.
        },
      });
    } else {
      await createIncome.mutateAsync({
        name: name,
        amount: Number(amount),
        // category: category, // if your API accepts category
      });
    }

    // Close and reset
    setOpen(false);
    resetForm();
  };

  return (
    <SpaceStack>
      <PageHeader>
        <div>
          <Title>Income</Title>
          <Subtitle>Track your earnings</Subtitle>
        </div>
        {/* Add button – directly controls the dialog */}
        <Button onClick={openAddDialog}>
          <PlusCircle size={18} style={{ marginRight: '0.5rem' }} />
          Add Income
        </Button>
      </PageHeader>

      {/* Summary Card */}
      <SummaryCard>
        <CardContent style={{ padding: '1.25rem' }}>
          <FlexRow>
            <IconBox $bg="#16a34a" $color="#ffffff">
              <Wallet size={24} />
            </IconBox>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#15803d' }}>Total Income</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#14532d' }}>
                {isLoading ? '…' : formatCurrency(totalIncome)}
              </p>
            </div>
          </FlexRow>
        </CardContent>
      </SummaryCard>

      {/* Cycle Lock Banner */}
      {isLocked === true && (
        <Card style={{ border: '1px solid #fcd34d', backgroundColor: '#fef3c7' }}>
          <CardContent style={{ padding: '1rem' }}>
            <FlexRow>
              <IconBox $bg="#fef3c7" $color="#d97706">
                <Lock size={20} />
              </IconBox>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#78350f' }}>
                  Cycle is Locked
                </p>
                <p style={{ fontSize: '0.75rem', color: '#92400e' }}>
                  Income entries are locked until the cycle ends.
                </p>
              </div>
            </FlexRow>
          </CardContent>
        </Card>
      )}

      {/* Income Records */}
      <Card>
        <CardContent style={{ padding: '1.25rem' }}>
          <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
            Income Records
          </h3>
          {isLoading ? (
            <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>
              Loading…
            </p>
          ) : !Array.isArray(incomes) || incomes.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>
              No income recorded yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <AnimatePresence>
                {incomes.map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <FlexRow>
                      <IconBox $bg="#f0fdf4" $color="#16a34a">
                        <Wallet size={20} />
                      </IconBox>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>
                          {tx.source_name}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {tx.category} • {formatDate(tx.created_at)}
                        </p>
                      </div>
                    </FlexRow>
                    <FlexRow>
                      <div style={{ textAlign: 'right', marginRight: '0.75rem' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#16a34a' }}>
                          +{formatCurrency(Number(tx.amount))}
                        </p>
                        {!tx.is_released && (
                          <p style={{ fontSize: '0.625rem', color: '#ea580c' }}>Pending</p>
                        )}
                      </div>
                      <FlexRow>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(tx)}
                          style={{ marginRight: '0.5rem' }}
                        >
                          Edit
                        </Button>
                        <DeleteButton
                          onClick={() => deleteIncome.mutate(tx.id)}
                          disabled={deleteIncome.isPending}
                        >
                          <Trash2 size={18} />
                        </DeleteButton>
                      </FlexRow>
                    </FlexRow>
                  </TransactionRow>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controlled Dialog */}
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetForm();
          setOpen(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === 'edit' ? 'Edit Income' : 'Add Income'}</DialogTitle>
          </DialogHeader>
          <Form onSubmit={handleSubmit}>
            <div>
              <Label>Description</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Monthly Salary"
                style={{ marginTop: '0.25rem' }}
              />
            </div>
            <div>
              <Label>Amount (₦)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                style={{ marginTop: '0.25rem' }}
              />
            </div>
            <div>
              <Label>Category</Label>
              <div style={{ marginTop: '0.25rem' }}>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCOME_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="submit"
              style={{ width: '100%', height: '2.75rem', marginTop: '0.5rem' }}
              disabled={createIncome.isPending || updateIncome.isPending}
            >
              {createIncome.isPending || updateIncome.isPending
                ? 'Saving…'
                : mode === 'edit'
                  ? 'Save Changes'
                  : 'Add Income'}
            </Button>
          </Form>
        </DialogContent>
      </Dialog>
    </SpaceStack>
  );
}

// Styled Components (identical to your original)
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
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.successBg} 0%, #dcfce7 100%);
  border: 1px solid ${({ theme }) => theme.colors.successBorder};
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

const TransactionRow = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};

  &:last-child {
    border-bottom: none;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;