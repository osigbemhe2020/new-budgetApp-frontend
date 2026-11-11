import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { savingsApi } from '@/lib/api';

const SAVINGS_KEY = ['savings'];
const SETTINGS_KEY = ['savings', 'settings'];
const LOCKED_KEY = ['savings', 'locked'];

export function useSavings() {
  return useQuery({
    queryKey: SAVINGS_KEY,
    queryFn: () => savingsApi.getAll(),
  });
}

export function useLockedSavings() {
  return useQuery({
    queryKey: LOCKED_KEY,
    queryFn: () => savingsApi.getLocked(),
  });
}

export function useSavingsSettings() {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => savingsApi.getSettings(),
  });
}

export function useCreateSavingsSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { savings_percentage: number; lock_duration_months: number }) =>
      savingsApi.createSettings(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SETTINGS_KEY });
    },
  });
}

export function useUpdateSavingsSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { savings_percentage: number; lock_duration_months: number }) =>
      savingsApi.updateSettings(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SETTINGS_KEY });
      qc.invalidateQueries({ queryKey: SAVINGS_KEY });
    },
  });
}

export function useUnlockSavings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (savingsId: number) => savingsApi.unlock(savingsId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SAVINGS_KEY });
      qc.invalidateQueries({ queryKey: LOCKED_KEY });
    },
  });
}

export function useLockSavings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => savingsApi.lock(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SAVINGS_KEY });
      qc.invalidateQueries({ queryKey: LOCKED_KEY });
      qc.invalidateQueries({ queryKey: SETTINGS_KEY });
    },
  });
}
