import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api';
import type { ApiSettings } from '@/types';

const QUERY_KEY = ['settings'];

export function useSettings() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => settingsApi.get(),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ApiSettings>) => settingsApi.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateCycleStartDay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cycleStartDay: number) => settingsApi.updateCycleStartDay(cycleStartDay),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateReleaseBuffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (releaseBufferDays: number) => settingsApi.updateReleaseBuffer(releaseBufferDays),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
