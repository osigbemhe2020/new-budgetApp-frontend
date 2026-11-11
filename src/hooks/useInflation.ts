import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inflationApi } from '@/lib/api';

const SUMMARY_KEY = ['inflation', 'summary'];

export function useInflationSummary() {
  return useQuery({
    queryKey: SUMMARY_KEY,
    queryFn: () => inflationApi.getSummary(),
  });
}

export function useItemInflation(id: number) {
  return useQuery({
    queryKey: ['inflation', 'item', id],
    queryFn: () => inflationApi.getItemInflation(id),
    enabled: !!id,
  });
}

export function useBasketInflation(id: number) {
  return useQuery({
    queryKey: ['inflation', 'basket', id],
    queryFn: () => inflationApi.getBasketInflation(id),
    enabled: !!id,
  });
}

export function useAdjustPrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newPrice }: { id: number; newPrice: number }) =>
      inflationApi.adjustPrice(id, newPrice),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUMMARY_KEY });
    },
  });
}
