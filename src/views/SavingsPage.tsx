'use client';

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSavings, useSavingsSettings, useUpdateSavingsSettings, useUnlockSavings, useLockedSavings, useLockSavings } from "@/hooks/useSavings";
import { useIncomes } from "@/hooks/useIncome";
import { useCurrentCycle } from "@/hooks/useCycle";
import { formatCurrency } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiggyBank, Lock, LockOpen, Edit2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

// ─── LAYOUT ─────────────────────────────────────────────────────────────────
const SpaceStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const GridTwo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// ─── HERO CARD (TOTAL LOCKED SAVINGS) ────────────────────────────────────────
const HeroCard = styled(Card)`
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #7dd3fc;
`;

const HeroContent = styled.div`
  padding: 2rem;
`;

const HeroHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const HeroIconBox = styled.div`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 12px;
  background-color: #ffffff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const HeroLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #0369a1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const HeroAmount = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0c4a6e;
  margin: 1rem 0 1.5rem 0;
`;

const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const HeroStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const HeroStatLabel = styled.span`
  font-size: 0.75rem;
  color: #075985;
  font-weight: 500;
`;

const HeroStatValue = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #0c4a6e;
`;

const EmptyStateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: #0c4a6e;
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.p`
  font-size: 0.875rem;
  color: #075985;
  max-width: 300px;
`;

// ─── SETTINGS CARD ──────────────────────────────────────────────────────────
const SettingsCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const SettingsTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const SettingValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`;

const ProjectedUnlockBox = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 12px;
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
`;

// ─── CYCLE PROGRESS CARD ────────────────────────────────────────────────────
const CycleCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const CycleCardHeader = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
`;

const CycleProjection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ProjectionLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProjectionAmount = styled.h4`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const ProjectionDetail = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ProgressSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
`;

const ProgressLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
`;

const ProgressBar = styled.div`
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => Math.min(Math.max($percent, 0), 100)}%;
  background-color: #2563eb;
  transition: width 0.5s ease;
`;

const ProgressText = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const StatusBadge = styled.div<{ $status: 'warning' | 'success' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ $status }) => {
    switch ($status) {
      case 'warning':
        return '#fef3c7';
      case 'success':
        return '#dcfce7';
      case 'danger':
        return '#fee2e2';
      default:
        return '#e5e7eb';
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case 'warning':
        return '#b45309';
      case 'success':
        return '#16a34a';
      case 'danger':
        return '#dc2626';
      default:
        return '#374151';
    }
  }};
`;

// ─── LOCK ACTION CARD ────────────────────────────────────────────────────────
const LockActionCard = styled(Card)<{ $disabled?: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ $disabled }) => $disabled ? '#f3f4f6' : '#f0f9ff'};
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};
`;

const LockActionContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const LockActionText = styled.div`
  flex: 1;
`;

const LockActionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const LockActionBody = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
`;

const LockActionButton = styled(Button)<{ $disabled?: boolean }>`
  white-space: nowrap;
  min-width: 160px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// ─── HISTORY SECTION ────────────────────────────────────────────────────────
const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const HistoryTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const HistoryTotal = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #2563eb;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HistoryCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const HistoryCardContent = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const HistoryCardLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const HistoryIconCircle = styled.div`
  height: 2.5rem;
  width: 2.5rem;
  min-width: 2.5rem;
  border-radius: 50%;
  background-color: #dbeafe;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const HistoryCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const HistoryCyclePeriod = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
`;

const HistoryLockedDate = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const HistoryCardCenter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const HistoryAmount = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`;

const HistoryRate = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const HistoryCardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const HistoryStatusBadge = styled.span<{ $status: 'locked' | 'unlocked' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ $status }) => $status === 'locked' ? '#eff6ff' : '#f0fdf4'};
  color: ${({ $status }) => $status === 'locked' ? '#2563eb' : '#16a34a'};
`;

const HistoryUnlockInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  font-size: 0.75rem;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const HistoryUnlockDate = styled.span`
  font-weight: 600;
  color: #111827;
`;

const HistoryDaysRemaining = styled.span`
  color: #2563eb;
`;

const UnlockButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    align-items: flex-start;
    width: 100%;
  }
`;

const UnlockButton = styled(Button)<{ $disabled?: boolean }>`
  min-width: 100px;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────
const calculateDaysBetween = (date1: Date, date2: Date): number => {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

const formatDateDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export function SavingsPage() {
  const { data: savingsRecords = [], isLoading: savingsLoading } = useSavings();
  const { data: lockedRecords = [], isLoading: lockedLoading } = useLockedSavings();
  const { data: savingsSettings } = useSavingsSettings();
  const updateSavingsSettings = useUpdateSavingsSettings();
  const unlockSavings = useUnlockSavings();
  const lockSavings = useLockSavings();
  const { data: incomes = [] } = useIncomes();
  const currentCycle = useCurrentCycle();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLockConfirmation, setShowLockConfirmation] = useState(false);
  const [draftSavingsPercent, setDraftSavingsPercent] = useState("20");
  const [draftLockDuration, setDraftLockDuration] = useState("6");

  const savingsPercent = savingsSettings?.savings_percentage ?? 20;
  const lockDuration = savingsSettings?.lock_duration_months ?? 6;

  useEffect(() => {
    setDraftSavingsPercent(String(savingsSettings?.savings_percentage ?? 20));
    setDraftLockDuration(String(savingsSettings?.lock_duration_months ?? 6));
  }, [savingsSettings]);

  // Calculations
  const totalIncome = Array.isArray(incomes)
    ? incomes.reduce((s, i) => s + Number(i.amount), 0)
    : 0;

  const totalLocked = Array.isArray(lockedRecords)
    ? lockedRecords.reduce((s, r) => s + Number(r.amount_saved), 0)
    : 0;

  const lockedCount = Array.isArray(lockedRecords) ? lockedRecords.length : 0;
  const avgPerCycle = lockedCount > 0 ? totalLocked / lockedCount : 0;

  const projectedSavings = (totalIncome * savingsPercent) / 100;

  // Get next unlock date from first locked record
  const nextUnlockDate = Array.isArray(lockedRecords) && lockedRecords.length > 0
    ? new Date(Math.min(...lockedRecords.map(r => new Date(r.unlock_date).getTime())))
    : null;

  // Calculate cycle progress
  const calculateCycleProgress = () => {
    if (!currentCycle) return { daysElapsed: 0, totalDays: 0, percent: 0, daysRemaining: 0, cycleEndFormatted: '', statusBadgeStatus: 'warning' as const };

    const now = new Date();
    const startDate = new Date(currentCycle.startDate);
    const endDate = new Date(currentCycle.endDate);

    const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const percent = Math.round((daysElapsed / totalDays) * 100);

    // Determine badge status based on days remaining
    let statusBadgeStatus: 'warning' | 'danger' | 'success' = 'success';
    if (daysRemaining <= 1) {
      statusBadgeStatus = 'danger';
    } else if (daysRemaining <= 5) {
      statusBadgeStatus = 'warning';
    }

    const cycleEndFormatted = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return { daysElapsed, totalDays, percent, daysRemaining, cycleEndFormatted, statusBadgeStatus };
  };

  const cycleProgress = calculateCycleProgress();

  const handleUpdateSettings = async () => {
    await updateSavingsSettings.mutateAsync({
      savings_percentage: Number(draftSavingsPercent),
      lock_duration_months: Number(draftLockDuration),
    });
    setShowSettingsModal(false);
  };

  const handleLockCycle = async () => {
    await lockSavings.mutateAsync();
    setShowLockConfirmation(false);
  };

  const handleUnlock = async (savingsId: number) => {
    await unlockSavings.mutateAsync(savingsId);
  };

  return (
    <SpaceStack>
      {/* PAGE HEADER */}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827' }}>Savings</h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Build your financial cushion</p>
      </div>

      {/* SECTION 1: TOTAL LOCKED SAVINGS HERO CARD */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <HeroCard>
          <HeroContent>
            <HeroHeader>
              <HeroIconBox>
                <PiggyBank size={20} />
              </HeroIconBox>
              <HeroLabel>Locked Savings</HeroLabel>
            </HeroHeader>

            {lockedCount === 0 ? (
              <EmptyStateBox>
                <EmptyIcon>🔒</EmptyIcon>
                <EmptyText>No savings locked yet</EmptyText>
                <EmptySubtext>Your first savings will lock at the end of your current cycle</EmptySubtext>
              </EmptyStateBox>
            ) : (
              <>
                <div>
                  <span style={{ fontSize: '0.875rem', color: '#075985', fontWeight: 500 }}>Total Locked</span>
                  <HeroAmount>{formatCurrency(totalLocked)}</HeroAmount>
                </div>

                <HeroStats>
                  <HeroStat>
                    <HeroStatLabel>Locked Records</HeroStatLabel>
                    <HeroStatValue>{lockedCount}</HeroStatValue>
                  </HeroStat>
                  <HeroStat>
                    <HeroStatLabel>Avg Per Cycle</HeroStatLabel>
                    <HeroStatValue>{formatCurrency(avgPerCycle)}</HeroStatValue>
                  </HeroStat>
                  <HeroStat>
                    <HeroStatLabel>Next Unlock</HeroStatLabel>
                    <HeroStatValue>
                      {nextUnlockDate ? formatDateDisplay(nextUnlockDate.toISOString().split('T')[0]) : '—'}
                    </HeroStatValue>
                  </HeroStat>
                </HeroStats>
              </>
            )}
          </HeroContent>
        </HeroCard>
      </motion.div>

      {/* SECTION 2: CURRENT CYCLE SAVINGS (Two columns) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GridTwo>
          {/* LEFT: This Cycle Projection */}
          <CycleCard>
            <CardContent style={{ padding: '1.5rem' }}>
              <CycleCardHeader>This Cycle Projection</CycleCardHeader>

              <CycleProjection>
                <ProjectionLabel>Projected Savings</ProjectionLabel>
                <ProjectionAmount>{formatCurrency(projectedSavings)}</ProjectionAmount>
                <ProjectionDetail>{savingsPercent}% of ₦{totalIncome.toLocaleString()} income</ProjectionDetail>
              </CycleProjection>

              <ProgressSection>
                <ProgressLabel>Cycle Progress</ProgressLabel>
                <ProgressBar>
                  <ProgressFill $percent={cycleProgress.percent} />
                </ProgressBar>
                <ProgressText>Day {cycleProgress.daysElapsed + 1} of {cycleProgress.totalDays} • Locks {cycleProgress.cycleEndFormatted}</ProgressText>

                <StatusBadge $status={cycleProgress.statusBadgeStatus}>
                  <Lock size={14} /> Locks in {cycleProgress.daysRemaining} day{cycleProgress.daysRemaining !== 1 ? 's' : ''}
                </StatusBadge>
              </ProgressSection>
            </CardContent>
          </CycleCard>

          {/* RIGHT: Savings Settings */}
          <SettingsCard>
            <CardContent style={{ padding: '1.5rem' }}>
              <SettingsHeader>
                <SettingsTitle>Savings Settings</SettingsTitle>
              </SettingsHeader>

              <SettingsList>
                <SettingRow>
                  <SettingLabel>Savings Rate</SettingLabel>
                  <SettingValue>{savingsPercent}%</SettingValue>
                </SettingRow>
                <SettingRow>
                  <SettingLabel>Lock Duration</SettingLabel>
                  <SettingValue>{lockDuration} months</SettingValue>
                </SettingRow>
              </SettingsList>

              <ProjectedUnlockBox>
                If locked today, unlocks:{' '}
                <strong>
                  {new Date(new Date().getFullYear(), new Date().getMonth() + lockDuration, 28)
                    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </strong>
              </ProjectedUnlockBox>

              <Button
                onClick={() => setShowSettingsModal(true)}
                style={{ marginTop: '1.5rem', width: '100%' }}
                variant="outline"
              >
                <Edit2 size={16} style={{ marginRight: '0.5rem' }} />
                Update Savings Settings
              </Button>
            </CardContent>
          </SettingsCard>
        </GridTwo>
      </motion.div>

      {/* SECTION 3: LOCK ACTION CARD */}
      {/* <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <LockActionCard>
          <CardContent style={{ padding: '1.5rem' }}>
            <LockActionContent>
              <LockActionText>
                <LockActionTitle>Ready to Lock?</LockActionTitle>
                <LockActionBody>
                  Lock your current cycle savings to commit {formatCurrency(projectedSavings)} to your financial
                  cushion. Locked savings cannot be edited until your unlock date.
                </LockActionBody>
              </LockActionText>
              <LockActionButton
                disabled={lockSavings.isPending}
                onClick={() => setShowLockConfirmation(true)}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none'
                }}
              >
                <Lock size={16} style={{ marginRight: '0.5rem' }} />
                {lockSavings.isPending ? 'Locking…' : 'Lock Current Cycle'}
              </LockActionButton>
            </LockActionContent>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '1rem' }}>
              Available from cycle end date
            </div>
          </CardContent>
        </LockActionCard>
      </motion.div> */}

      {/* SECTION 4: LOCKED SAVINGS HISTORY */}
      {/* {lockedCount > 0 && ( */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div>
            <HistoryHeader>
              <HistoryTitle>Locked Savings History</HistoryTitle>
              <HistoryTotal>Total: {formatCurrency(totalLocked)}</HistoryTotal>
            </HistoryHeader>

            <HistoryList>
              {lockedRecords.map((record) => {
                const unlockDate = new Date(record.unlock_date);
                const now = new Date();
                const daysRemaining = calculateDaysBetween(now, unlockDate);
                const isUnlockable = now >= unlockDate;

                return (
                  <HistoryCard key={record.id}>
                    <CardContent style={{ padding: '1.25rem' }}>
                      <HistoryCardContent>
                        <HistoryCardLeft>
                          <HistoryIconCircle>
                            <Lock size={16} />
                          </HistoryIconCircle>
                          <HistoryCardInfo>
                            <HistoryCyclePeriod>Cycle Period</HistoryCyclePeriod>
                            <HistoryLockedDate>Locked on {formatDateDisplay(record.created_at)}</HistoryLockedDate>
                          </HistoryCardInfo>
                        </HistoryCardLeft>

                        <HistoryCardCenter>
                          <HistoryAmount>{formatCurrency(record.amount_saved)}</HistoryAmount>
                          <HistoryRate>@ {savingsPercent}%</HistoryRate>
                        </HistoryCardCenter>

                        <HistoryCardRight>
                          <HistoryStatusBadge $status={record.status}>
                            {record.status === 'locked' ? '🔒 Locked' : '✅ Unlocked'}
                          </HistoryStatusBadge>

                          <HistoryUnlockInfo>
                            <HistoryUnlockDate>
                              {record.status === 'locked' ? 'Unlocks' : 'Released'} {formatDateDisplay(record.unlock_date)}
                            </HistoryUnlockDate>
                            {record.status === 'locked' && (
                              <HistoryDaysRemaining>{daysRemaining} days remaining</HistoryDaysRemaining>
                            )}
                          </HistoryUnlockInfo>

                          {record.status === 'locked' && (
                            <UnlockButtonWrapper>
                              <UnlockButton
                                onClick={() => handleUnlock(record.id)}
                                disabled={!isUnlockable || unlockSavings.isPending}
                                variant={!isUnlockable ? 'outline' : 'primary'}
                                size="sm"
                              >
                                {unlockSavings.isPending ? 'Unlocking…' : 'Unlock Now'}
                              </UnlockButton>
                              {!isUnlockable && (
                                <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                                  Available from {formatDateDisplay(record.unlock_date)}
                                </span>
                              )}
                            </UnlockButtonWrapper>
                          )}
                        </HistoryCardRight>
                      </HistoryCardContent>
                    </CardContent>
                  </HistoryCard>
                );
              })}
            </HistoryList>
          </div>
        </motion.div>
      {/* )} */}

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}
          onClick={() => setShowSettingsModal(false)}
        >
          <Card
            style={{
              width: '90%',
              maxWidth: '400px',
              backgroundColor: '#ffffff'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>
                Update Savings Settings
              </h2>

              <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <Label style={{ marginBottom: '0.5rem' }}>Savings Rate (%)</Label>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={draftSavingsPercent}
                    onChange={(e) => setDraftSavingsPercent(e.target.value)}
                  />
                  <div style={{ marginTop: '0.5rem', textAlign: 'center', fontWeight: 600, color: '#2563eb' }}>
                    {draftSavingsPercent}%
                  </div>
                </div>

                <div>
                  <Label style={{ marginBottom: '0.5rem' }}>Lock Duration (months)</Label>
                  <select
                    value={draftLockDuration}
                    onChange={(e) => setDraftLockDuration(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                      <option key={m} value={m}>
                        {m} month{m > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px', fontSize: '0.875rem', color: '#4b5563' }}>
                  Changes take effect next cycle if current cycle is already locked.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Button
                  onClick={() => setShowSettingsModal(false)}
                  variant="outline"
                  style={{ width: '100%' }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateSettings}
                  disabled={updateSavingsSettings.isPending}
                  style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none' }}
                >
                  {updateSavingsSettings.isPending ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* LOCK CONFIRMATION MODAL */}
      {showLockConfirmation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}
          onClick={() => setShowLockConfirmation(false)}
        >
          <Card
            style={{
              width: '90%',
              maxWidth: '400px',
              backgroundColor: '#ffffff'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <div
                  style={{
                    height: '3rem',
                    width: '3rem',
                    borderRadius: '50%',
                    backgroundColor: '#dbeafe',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}
                >
                  🔒
                </div>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem', textAlign: 'center' }}>
                Lock {formatCurrency(projectedSavings)}?
              </h2>

              <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', marginBottom: '1.5rem' }}>
                Lock your current cycle savings for {lockDuration} month{lockDuration > 1 ? 's' : ''}.
              </p>

              <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#166534' }}>
                <strong>Unlock Date:</strong> {new Date(new Date().getFullYear(), new Date().getMonth() + lockDuration, 28).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Button
                  onClick={() => setShowLockConfirmation(false)}
                  variant="outline"
                  style={{ width: '100%' }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLockCycle}
                  disabled={lockSavings.isPending}
                  style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none' }}
                >
                  {lockSavings.isPending ? 'Locking…' : 'Confirm Lock'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </SpaceStack>
  );
}
