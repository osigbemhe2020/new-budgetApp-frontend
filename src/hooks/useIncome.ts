import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { incomeApi, CreateIncomePayload } from '@/lib/api';

const QUERY_KEY = ['income'];

export function useIncomes() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => incomeApi.getAll(),
  });
}

export function useCreateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIncomePayload) => incomeApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateIncomePayload> }) =>
      incomeApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeleteIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => incomeApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
