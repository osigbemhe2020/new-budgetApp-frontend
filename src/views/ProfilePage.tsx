'use client';

import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "@/store/AuthContext";
import { useIncomes } from "@/hooks/useIncome";
import { useExpenses } from "@/hooks/useExpenses";
import { useSavingsSettings } from "@/hooks/useSavings";
import { useDebts } from "@/hooks/useDebts";
import { useChangePassword } from "@/hooks/useAuth";
import { useApp } from "@/store/AppContext";
import { formatCurrency, formatDate } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Calendar,
  ShieldCheck,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Clock,
  PiggyBank,
  Wallet,
  Lock,
  Check,
  Shield,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";

const SpaceStack = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeroBanner = styled.div`
  height: 6rem;
  background: linear-gradient(90deg, #2563eb 0%, #4f46e5 100%);
`;

const ProfileContent = styled(CardContent)`
  padding: 1.25rem;
  margin-top: -3rem;
  position: relative;
`;

const AvatarCircle = styled.div`
  height: 5rem;
  width: 5rem;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  box-shadow: ${({ theme }) => theme.colors.shadowLg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  border: 4px solid #ffffff;
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

const EyeBtn = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 26 } },
};

export function ProfilePage() {
  const { user } = useAuth();
  const { addToast } = useApp();
  const [showPw, setShowPw] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { data: incomes = [] } = useIncomes();
  const { data: expenses = [] } = useExpenses();
  const { data: savingsSettings } = useSavingsSettings();
  const { data: debts = [] } = useDebts();
  const changePassword = useChangePassword();

  const totalIncome = Array.isArray(incomes) ? incomes.reduce((s, i) => s + Number(i.amount), 0) : 0;
  const totalExpenses = Array.isArray(expenses) ? expenses.reduce((s, e) => s + Number(e.amount), 0) : 0;
  const savingsPercent = savingsSettings?.savings_percentage ?? 20;
  const lockDuration = savingsSettings?.lock_duration_months ?? 6;
  const savingsAmount = (totalIncome * savingsPercent) / 100;
  const balance = totalIncome - totalExpenses - savingsAmount;
  const savingsRate = totalIncome > 0 ? Math.round((savingsAmount / totalIncome) * 100) : 0;
  const totalDebt = Array.isArray(debts)
    ? debts.reduce((s, d) => s + (Number(d.debt_amount) || Number(d.remaining_amount) || Number(d.total_payable) || 0), 0)
    : 0;
  const activeDebtsCount = Array.isArray(debts)
    ? debts.filter((d) => d.status === 'pending' || d.status === 'active').length
    : 0;

  const displayName = user?.FullName || user?.full_name || "User";
  const userEmail = user?.Email || user?.email || "";
  const initials = displayName
    ? displayName.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'BF'
    : 'BF';

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) return;
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      addToast({ type: 'success', message: 'Password changed successfully' });
      setCurrentPassword(""); setNewPassword("");
    } catch {
      addToast({ type: 'error', message: 'Failed to change password. Check your current password.' });
    }
  };

  return (
    <SpaceStack variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Profile</h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Your financial identity &amp; standing</p>
      </motion.div>

      {/* Profile Hero Card */}
      <motion.div variants={item}>
        <Card style={{ overflow: 'hidden' }}>
          <HeroBanner />
          <ProfileContent>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <AvatarCircle>{initials}</AvatarCircle>
              <div style={{ flex: 1, minWidth: 0, paddingTop: '3rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>{displayName}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Mail size={14} /> {userEmail || '—'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} /> Member since {user?.created_at ? formatDate(user.created_at) : '—'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Shield size={14} style={{ color: '#2563eb' }} /> Verified Account
                  </span>
                </div>
              </div>
            </div>
          </ProfileContent>
        </Card>
      </motion.div>

      {/* Financial Standing Grid */}
      <motion.div variants={item}>
        <GridFour>
          {[
            { label: 'Income', value: totalIncome, bg: '#f0fdf4', color: '#16a34a', icon: ArrowUp },
            { label: 'Expenses', value: totalExpenses, bg: '#fef2f2', color: '#dc2626', icon: ArrowDown },
            { label: 'Balance', value: balance, bg: '#eff6ff', color: '#2563eb', icon: Wallet },
            { label: 'Savings', value: savingsAmount, bg: '#f3e8ff', color: '#9333ea', icon: PiggyBank },
          ].map(({ label, value, bg, color, icon: Icon }) => (
            <Card key={label}>
              <CardContent style={{ padding: '1rem' }}>
                <FlexRow style={{ marginBottom: '0.5rem' }}>
                  <MiniIconBox $bg={bg} $color={color}><Icon size={18} /></MiniIconBox>
                  <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>{label}</span>
                </FlexRow>
                <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>{formatCurrency(value)}</p>
              </CardContent>
            </Card>
          ))}
        </GridFour>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={item}>
        <GridTwo>
          {/* Account Summary */}
          <Card>
            <CardContent style={{ padding: '1.25rem' }}>
              <FlexRow style={{ marginBottom: '1rem' }}>
                <MiniIconBox $bg="#e0e7ff" $color="#4f46e5" style={{ height: '2.5rem', width: '2.5rem' }}>
                  <Clock size={20} />
                </MiniIconBox>
                <h3 style={{ fontWeight: 600, color: '#111827' }}>Account Summary</h3>
              </FlexRow>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Total Income', value: formatCurrency(totalIncome) },
                  { label: 'Total Expenses', value: formatCurrency(totalExpenses) },
                  { label: 'Total Transactions', value: `${(Array.isArray(incomes) ? incomes.length : 0) + (Array.isArray(expenses) ? expenses.length : 0)}` },
                  { label: 'Active Debts', value: `${activeDebtsCount}` },
                  { label: 'Outstanding Debt', value: formatCurrency(totalDebt) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>{label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Savings & Goals */}
          <Card>
            <CardContent style={{ padding: '1.25rem' }}>
              <FlexRow style={{ marginBottom: '1rem' }}>
                <MiniIconBox $bg="#fef3c7" $color="#d97706" style={{ height: '2.5rem', width: '2.5rem' }}>
                  <Star size={20} />
                </MiniIconBox>
                <h3 style={{ fontWeight: 600, color: '#111827' }}>Savings &amp; Goals</h3>
              </FlexRow>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#4b5563' }}>Savings Rate</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>{savingsRate}%</span>
                  </div>
                </div>
                {[
                  { label: 'Target Savings Rate', value: `${savingsPercent}%` },
                  { label: 'Lock Duration', value: `${lockDuration} months` },
                  { label: 'Savings Amount', value: formatCurrency(savingsAmount) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>{label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </GridTwo>
      </motion.div>

      {/* Change Password */}
      <motion.div variants={item}>
        <Card>
          <CardContent style={{ padding: '1.25rem' }}>
            <FlexRow style={{ marginBottom: '1rem' }}>
              <MiniIconBox $bg="#fef2f2" $color="#dc2626" style={{ height: '2.5rem', width: '2.5rem' }}>
                <Lock size={20} />
              </MiniIconBox>
              <h3 style={{ fontWeight: 600, color: '#111827' }}>Change Password</h3>
            </FlexRow>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <Label>Current Password</Label>
                <div style={{ position: 'relative', marginTop: '0.25rem' }}>
                  <Input
                    type={showPw ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <EyeBtn type="button" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </EyeBtn>
                </div>
              </div>
              <div>
                <Label>New Password</Label>
                <div style={{ position: 'relative', marginTop: '0.25rem' }}>
                  <Input
                    type={showPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <EyeBtn type="button" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </EyeBtn>
                </div>
              </div>
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={!currentPassword || !newPassword || changePassword.isPending}
              style={{ height: '2.75rem' }}
            >
              <Check size={16} style={{ marginRight: '0.5rem' }} />
              {changePassword.isPending ? 'Saving…' : 'Update Password'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Financial Health Badge */}
      <motion.div variants={item}>
        <Card style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <CardContent style={{ padding: '1.25rem' }}>
            <FlexRow style={{ alignItems: 'flex-start' }}>
              <MiniIconBox $bg="#16a34a" $color="#ffffff" style={{ height: '2.5rem', width: '2.5rem' }}>
                <ShieldCheck size={22} />
              </MiniIconBox>
              <div>
                <h3 style={{ fontWeight: 600, color: '#111827' }}>Financial Health</h3>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '0.25rem' }}>
                  {balance > 0
                    ? "You're in good shape! Your income exceeds expenses this cycle."
                    : balance < 0
                      ? "Your expenses exceed income. Consider reviewing your spending."
                      : "You're breaking even this cycle."}
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.875rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#15803d' }}>
                    <TrendingUp size={16} /> {totalIncome > 0 ? 'Income positive' : 'No income yet'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#1d4ed8' }}>
                    <Lock size={16} /> {lockDuration}m lock
                  </span>
                </div>
              </div>
            </FlexRow>
          </CardContent>
        </Card>
      </motion.div>
    </SpaceStack>
  );
}
