import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expensesApi } from '@/lib/api';

const QUERY_KEY = ['expense-templates'];


export function useExpenseTemplates() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => expensesApi.getTemplates(),
  });
}

export function useCreateExpenseTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      category: string;
      is_recurring: boolean;
      default_amount?: number;
      recurring_day?: number;
    }) =>
      expensesApi.createTemplate({
        template_name: data.name,
        description: data.description,
        category: data.category,
        is_recurring: data.is_recurring,
        default_amount: data.default_amount,
        recurring_day: data.recurring_day,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}


export function useDeleteExpenseTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => expensesApi.deleteTemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}