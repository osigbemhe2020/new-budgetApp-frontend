'use client';

import { useState } from "react";
import styled from "styled-components";
//import { useApp } from "@/store/AppContext";
import { useExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense } from "@/hooks/useExpenses";
import { useExpenseLocked } from "@/hooks/useCycle";
import { formatCurrency, formatDate, EXPENSE_CATEGORIES } from "@/constants";
import { ApiExpense } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, PlusCircle, Trash2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const StyledSelectTrigger = styled(SelectTrigger)`
  margin-top: 0.25rem;
`;

const SummaryCard = styled(Card)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.dangerBg} 0%, #fee2e2 100%);
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
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

export function ExpensesPage() {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);

  const { data: expenses = [], isLoading } = useExpenses();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();


  const totalExpenses = Array.isArray(expenses) ? expenses.reduce((s, e) => s + Number(e.amount), 0) : 0;
  console.log('totalExpenses', totalExpenses);

  const resetForm = () => {
    setName("");
    setAmount("");
    setCategory("");
  };

  const handleEditExpense = (expense: ApiExpense) => {
    setEditingExpenseId(expense.id);
    setName(expense.expense_name);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !category) return;

    if (editingExpenseId) {
      await updateExpense.mutateAsync({
        id: editingExpenseId,
        data: {
          expense_name: name,
          amount: Number(amount),
          category,
        },
      });
    } else {
      await createExpense.mutateAsync({
        expense_name: name,
        amount: Number(amount),
        category,
      });
    }

    setEditingExpenseId(null);
    resetForm();
    setOpen(false);
  };

  const isLocked = useExpenseLocked();


  return (
    <SpaceStack>
      <PageHeader>
        <div>
          <Title>Expenses</Title>
          <Subtitle>Track your spending</Subtitle>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingExpenseId(null); resetForm(); }}>
              <PlusCircle size={18} style={{ marginRight: '0.5rem' }} />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingExpenseId ? "Edit Expense" : "Add Expense"}</DialogTitle>
            </DialogHeader>
            <Form onSubmit={handleSubmit}>
              <div>
                <Label>Expense Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Groceries" style={{ marginTop: '0.25rem' }} />
              </div>
              <div>
                <Label>Amount (₦)</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" style={{ marginTop: '0.25rem' }} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <StyledSelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </StyledSelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" style={{ width: '100%', height: '2.75rem', marginTop: '0.5rem' }} disabled={createExpense.isPending || updateExpense.isPending}>
                {createExpense.isPending || updateExpense.isPending ? 'Saving…' : editingExpenseId ? 'Save Changes' : 'Add Expense'}
              </Button>
            </Form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Summary Card */}
      <SummaryCard>
        <CardContent style={{ padding: '1.25rem' }}>
          <FlexRow>
            <IconBox $bg="#dc2626" $color="#ffffff">
              <ShoppingCart size={24} />
            </IconBox>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#b91c1c' }}>Total Expenses</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7f1d1d' }}>
                {isLoading ? '…' : formatCurrency(totalExpenses)}
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
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#78350f' }}>Cycle is Locked</p>
                <p style={{ fontSize: '0.75rem', color: '#92400e' }}>Expense entries are locked until the cycle ends.</p>
              </div>
            </FlexRow>
          </CardContent>
        </Card>
      )}

      {/* Expense Records */}
      <Card>
        <CardContent style={{ padding: '1.25rem' }}>
          <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Expense Records</h3>
          {isLoading ? (
            <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>Loading…</p>
          ) : !Array.isArray(expenses) || expenses.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>No expenses recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <AnimatePresence>
                {expenses.map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <FlexRow>
                      <IconBox $bg="#fef2f2" $color="#dc2626">
                        <ShoppingCart size={20} />
                      </IconBox>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>{tx.expense_name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{tx.category} • {formatDate(tx.release_date)}</p>
                      </div>
                    </FlexRow>
                    <FlexRow>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#dc2626' }}>-{formatCurrency(Number(tx.amount))}</p>
                        {!tx.is_released && <p style={{ fontSize: '0.625rem', color: '#ea580c' }}>Pending</p>}
                      </div>
                      <FlexRow>
                        <Button size="sm" variant="outline" onClick={() => handleEditExpense(tx)} style={{ marginRight: '0.5rem' }}>
                          Edit
                        </Button>
                        <DeleteButton onClick={() => deleteExpense.mutate(tx.id)} disabled={deleteExpense.isPending}>
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
    </SpaceStack>
  );
}