import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { debtsApi, CreateDebtPayload } from '@/lib/api';

const DEBTS_KEY = ['debts'];
const ACTIVE_KEY = ['debts', 'active'];
const HISTORY_KEY = ['debts', 'history'];

export function useDebts() {
  return useQuery({
    queryKey: DEBTS_KEY,
    queryFn: () => debtsApi.getAll(),
  });
}

export function useActiveDebts() {
  return useQuery({
    queryKey: ACTIVE_KEY,
    queryFn: () => debtsApi.getActive(),
  });
}

export function useDebtHistory() {
  return useQuery({
    queryKey: HISTORY_KEY,
    queryFn: () => debtsApi.getHistory(),
  });
}

export function useDebtById(id: number) {
  return useQuery({
    queryKey: ['debts', id],
    queryFn: () => debtsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDebtPayload) => debtsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEBTS_KEY });
      qc.invalidateQueries({ queryKey: ACTIVE_KEY });
    },
  });
}

export function useSetRepaymentPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, repaymentMonths }: { id: number; repaymentMonths: number }) =>
      debtsApi.setRepaymentPlan(id, repaymentMonths),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEBTS_KEY });
    },
  });
}

export function useMakePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => debtsApi.makePayment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEBTS_KEY });
      qc.invalidateQueries({ queryKey: ACTIVE_KEY });
      qc.invalidateQueries({ queryKey: HISTORY_KEY });
    },
  });
}
