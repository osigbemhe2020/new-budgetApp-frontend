'use client';

import { useState, useEffect } from "react";
import styled from "styled-components";
import { useSettings, useUpdateSettings, useUpdateCycleStartDay, useUpdateReleaseBuffer } from "@/hooks/useSettings";
import { useUpdateSavingsSettings, useSavingsSettings } from "@/hooks/useSavings";
import { useApp } from "@/store/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Bell,
  ShieldCheck,
  Sliders,
  Info,
  Check,
  CornerDownRight,
  Percent,
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

const SectionIconBox = styled.div<{ $bg: string; $color: string }>`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GridTwo = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 26 } },
};

export function SettingsPage() {
  const { addToast } = useApp();
  const { data: settings, isLoading } = useSettings();
  const { data: savingsSettings } = useSavingsSettings();

  // Local state for controlled inputs
  const [savingsPercent, setSavingsPercent] = useState("");
  const [lockDuration, setLockDuration] = useState("");

  const updateSettings = useUpdateSettings();
  const updateCycleStartDay = useUpdateCycleStartDay();
  const updateReleaseBuffer = useUpdateReleaseBuffer();
  const updateSavingsSettings = useUpdateSavingsSettings();

  useEffect(() => {
    if (savingsSettings) {
      if (savingsSettings.savings_percentage !== undefined) {
        setSavingsPercent(String(savingsSettings.savings_percentage));
      }
      if (savingsSettings.lock_duration_months !== undefined) {
        setLockDuration(String(savingsSettings.lock_duration_months));
      }
    }
  }, [savingsSettings]);

  const effectiveSavings = savingsPercent || savingsSettings?.savings_percentage?.toString() || "20";
  const effectiveLock = lockDuration || savingsSettings?.lock_duration_months?.toString() || "6";

  const handleSave = async () => {
    try {
      const promises: Promise<any>[] = [];
      if (settings) {
        promises.push(
          updateSettings.mutateAsync({
            currency: settings.currency,
            language: settings.language,
            timezone: settings.timezone,
            notifications: settings.notifications,
          })
        );
      }
      promises.push(
        updateSavingsSettings.mutateAsync({
          savings_percentage: Number(effectiveSavings),
          lock_duration_months: Number(effectiveLock),
        })
      );
      await Promise.all(promises);
      addToast({ type: 'success', message: 'Settings saved successfully' });
    } catch {
      addToast({ type: 'error', message: 'Failed to save settings' });
    }
  };

  const handleNotificationToggle = () => {
    updateSettings.mutate({ notifications: !settings?.notifications });
  };

  const handleBufferChange = (val: string) => {
    updateReleaseBuffer.mutate(Number(val), {
      onSuccess: () => addToast({ type: 'success', message: 'Release buffer updated' }),
      onError: () => addToast({ type: 'error', message: 'Failed to update release buffer' })
    });
  };

  const handleCycleStartDayChange = (val: string) => {
    updateCycleStartDay.mutate(Number(val), {
      onSuccess: () => addToast({ type: 'success', message: 'Cycle start day updated' }),
      onError: (err: any) => addToast({ type: 'error', message: err?.response?.data?.message || 'Failed to update cycle start day' })
    });
  };

  const handleCurrencyChange = (val: string) => {
    updateSettings.mutate({ currency: val });
  };

  const handleLanguageChange = (val: string) => {
    updateSettings.mutate({ language: val });
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
        Loading settings…
      </div>
    );
  }

  return (
    <SpaceStack variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item}>
        <FlexRow>
          <HeaderIconBox>
            <Settings size={22} />
          </HeaderIconBox>
          <div>
            <Title>Settings</Title>
            <Subtitle>Manage your preferences &amp; financial rules</Subtitle>
          </div>
        </FlexRow>
      </motion.div>

      {/* Financial Settings */}
      <motion.div variants={item}>
        <Card>
          <CardContent style={{ padding: '1.25rem' }}>
            <FlexRow style={{ marginBottom: '1rem' }}>
              <SectionIconBox $bg="#f0fdf4" $color="#16a34a">
                <Percent size={20} />
              </SectionIconBox>
              <h3 style={{ fontWeight: 600, color: '#111827' }}>Financial Settings</h3>
            </FlexRow>
            <GridTwo>
              <div>
                <Label>Savings Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={effectiveSavings}
                  onChange={(e) => setSavingsPercent(e.target.value)}
                  style={{ marginTop: '0.25rem' }}
                />
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Percentage of income to save each month</p>
              </div>
              <div>
                <Label>Lock Duration (months)</Label>
                <div style={{ marginTop: '0.25rem' }}>
                  <Select value={effectiveLock} onValueChange={setLockDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['3', '6', '12', '24'].map((v) => (
                        <SelectItem key={v} value={v}>{v} months</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>How long savings are locked before withdrawal</p>
              </div>
              <div>
                <Label>Release Buffer (days)</Label>
                <div style={{ marginTop: '0.25rem' }}>
                  <Select
                    value={settings?.expense_release_buffer_days?.toString() ?? "3"}
                    onValueChange={handleBufferChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['1', '3', '5', '7'].map((v) => (
                        <SelectItem key={v} value={v}>{v} day{Number(v) > 1 ? 's' : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Buffer before funds are released from lock</p>
              </div>
              <div>
                <Label>Cycle Start Day</Label>
                <div style={{ marginTop: '0.25rem' }}>
                  <Select
                    value={settings?.cycle_start_day?.toString() ?? "1"}
                    onValueChange={handleCycleStartDayChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['1', '5', '10', '15', '20', '25'].map((v) => (
                        <SelectItem key={v} value={v}>{v}{v === '1' ? 'st' : v === '2' ? 'nd' : 'th'} of month</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>When your financial cycle starts each month</p>
              </div>
            </GridTwo>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={item}>
        <Card>
          <CardContent style={{ padding: '1.25rem' }}>
            <FlexRow style={{ marginBottom: '1rem' }}>
              <SectionIconBox $bg="#fef3c7" $color="#d97706">
                <Sliders size={20} />
              </SectionIconBox>
              <h3 style={{ fontWeight: 600, color: '#111827' }}>Preferences</h3>
            </FlexRow>
            <GridTwo>
              <div>
                <Label>Currency</Label>
                <div style={{ marginTop: '0.25rem' }}>
                  <Select value={settings?.currency ?? 'NGN'} onValueChange={handleCurrencyChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">₦ NGN (Nigeria)</SelectItem>
                      <SelectItem value="USD">$ USD (US Dollar)</SelectItem>
                      <SelectItem value="EUR">€ EUR (Euro)</SelectItem>
                      <SelectItem value="GBP">£ GBP (British Pound)</SelectItem>
                      <SelectItem value="KES">KSh KES (Kenya)</SelectItem>
                      <SelectItem value="GHS">₵ GHS (Ghana)</SelectItem>
                      <SelectItem value="ZAR">R ZAR (South Africa)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Language</Label>
                <div style={{ marginTop: '0.25rem' }}>
                  <Select value={settings?.language ?? 'English'} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Portuguese">Portuguese</SelectItem>
                      <SelectItem value="Arabic">Arabic</SelectItem>
                      <SelectItem value="Swahili">Swahili</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <FlexRow>
                  <Bell size={18} style={{ color: '#6b7280' }} />
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Notifications</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Receive alerts about your finances</p>
                  </div>
                </FlexRow>
                <Switch
                  checked={settings?.notifications ?? false}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
            </GridTwo>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security info */}
      <motion.div variants={item}>
        <Card>
          <CardContent style={{ padding: '1.25rem' }}>
            <FlexRow style={{ marginBottom: '0.75rem' }}>
              <SectionIconBox $bg="#fef2f2" $color="#dc2626">
                <ShieldCheck size={20} />
              </SectionIconBox>
              <h3 style={{ fontWeight: 600, color: '#111827' }}>Security</h3>
            </FlexRow>
            <FlexRow style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              <ShieldCheck size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
              <span>Your data is stored securely in the cloud and protected by JWT authentication.</span>
            </FlexRow>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.5rem' }}>
              To change your password, go to the <strong>Profile</strong> page.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={item} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Button
          onClick={handleSave}
          disabled={updateSettings.isPending || updateSavingsSettings.isPending}
          style={{ width: '100%', height: '3rem', fontSize: '1rem' }}
        >
          <Check size={18} style={{ marginRight: '0.5rem' }} />
          {updateSettings.isPending || updateSavingsSettings.isPending ? 'Saving…' : 'Save Changes'}
        </Button>
      </motion.div>

      {/* About */}
      <motion.div variants={item}>
        <Card style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
          <CardContent style={{ padding: '1.25rem' }}>
            <FlexRow style={{ marginBottom: '0.75rem' }}>
              <SectionIconBox $bg="#dbeafe" $color="#2563eb">
                <Info size={20} />
              </SectionIconBox>
              <h3 style={{ fontWeight: 600, color: '#111827' }}>About BudgetFlow</h3>
            </FlexRow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CornerDownRight size={14} style={{ color: '#2563eb' }} /> Version 1.0.0
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CornerDownRight size={14} style={{ color: '#2563eb' }} /> Data synced to cloud via REST API
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CornerDownRight size={14} style={{ color: '#2563eb' }} /> Built with Next.js, TypeScript, and styled-components
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </SpaceStack>
  );
}
