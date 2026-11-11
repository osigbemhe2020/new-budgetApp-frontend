'use client';

import { useState } from "react";
import styled from "styled-components";
import { useExpenseTemplates, useCreateExpenseTemplate, useDeleteExpenseTemplate } from "@/hooks/useExpenseTemplates";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { List, PlusCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EXPENSE_CATEGORIES } from "@/constants";

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

const EmptyBox = styled.div`
  padding: 3rem 1.5rem;
  text-align: center;
`;

const EmptyIconBox = styled.div`
  height: 4rem;
  width: 4rem;
  border-radius: 9999px;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TemplateCard = styled(Card)`
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TemplateHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const DeleteIconButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

const RecurringBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 0.5rem;
`;

export function TemplatesPage() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState('');
  const [recurringDay, setRecurringDay] = useState(''); 
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [isRecurring, setIsRecurring] = useState(false);

  const { data: templates = [], isLoading } = useExpenseTemplates();
  const createTemplate = useCreateExpenseTemplate();
  const deleteTemplate = useDeleteExpenseTemplate();

  // in TemplatesPage.tsx

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    await createTemplate.mutateAsync({
        name,           // hook maps this to template_name
        category,
        is_recurring: isRecurring,
        default_amount: amount ? Number(amount) : 0,
        recurring_day: isRecurring ? Number(recurringDay) : undefined
    });

    setName('');
    setCategory('General');
    setIsRecurring(false);
    setAmount('');
    setRecurringDay('');
    setOpen(false);
};

// Fix the template display — backend uses template_name not name

  return (
    <SpaceStack>
      <PageHeader>
        <div>
          <Title>Templates</Title>
          <Subtitle>Save and reuse budget patterns</Subtitle>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle size={18} style={{ marginRight: '0.5rem' }} />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Template</DialogTitle>
            </DialogHeader>
            <Form onSubmit={handleSubmit}>
              <div>
                <Label>Template Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monthly Essentials" style={{ marginTop: '0.25rem' }} />
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" style={{ marginTop: '0.25rem' }} />
              </div>
              <div>
                <Label>Category</Label>
                <div style={{ marginTop: '0.25rem' }}>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Default Amount (₦)</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  style={{ marginTop: '0.25rem' }}
                />
              </div>

              {isRecurring && (
                <div>
                  <Label>Recurring Day (1-28)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={28}
                    value={recurringDay}
                    onChange={(e) => setRecurringDay(e.target.value)}
                    placeholder="Day of cycle e.g. 5"
                    style={{ marginTop: '0.25rem' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    This expense auto-creates on day {recurringDay || 'X'} of each cycle
                  </p>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                <div>
                  <Label>Recurring</Label>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Apply this template every cycle</p>
                </div>
                <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
              </div>
              <Button type="submit" style={{ width: '100%', height: '2.75rem', marginTop: '0.5rem' }} disabled={createTemplate.isPending}>
                {createTemplate.isPending ? 'Creating…' : 'Create Template'}
              </Button>
            </Form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Templates List */}
      {isLoading ? (
        <Card>
          <CardContent style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Loading templates…</p>
          </CardContent>
        </Card>
      ) : !Array.isArray(templates) || templates.length === 0 ? (
        <Card>
          <CardContent style={{ padding: 0 }}>
            <EmptyBox>
              <EmptyIconBox>
                <List size={32} />
              </EmptyIconBox>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>No Templates Yet</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', maxWidth: '24rem', margin: '0 auto' }}>
                Create templates to save common budget patterns and apply them quickly to new cycles.
              </p>
            </EmptyBox>
          </CardContent>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
            {templates.map((template) => (
    <TemplateCard key={template.id}>
        <CardContent style={{ padding: '1.25rem' }}>
            <TemplateHeader>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 600, color: '#111827' }}>
                        {template.template_name}  {/* ✅ was template.name */}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                        {template.category}
                    </p>
                    {(template.default_amount ?? 0) > 0 && (
                        <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.25rem' }}>
                            ₦{Number(template.default_amount).toLocaleString()}
                        </p>
                    )}
                    {template.is_recurring && (
                        <RecurringBadge>🔄 Recurring — Day {template.recurring_day}</RecurringBadge>
                    )}
                </div>
                <DeleteIconButton
                    onClick={() => deleteTemplate.mutate(template.id)}
                    disabled={deleteTemplate.isPending}
                >
                    <Trash2 size={18} />
                </DeleteIconButton>
            </TemplateHeader>
        </CardContent>
    </TemplateCard>
))}

        </div>
      )}

      {/* Info Card */}
      <Card style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
        <CardContent style={{ padding: '1.25rem' }}>
          <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>How Templates Work</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
            <p>• Create templates for recurring budget patterns (rent, utilities, subscriptions)</p>
            <p>• Recurring templates auto-apply each budget cycle</p>
            <p>• Templates are synced to your account and persist across devices</p>
          </div>
        </CardContent>
      </Card>
    </SpaceStack>
  );
}
