import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taxApi, CreateTaxProfilePayload, GenerateTaxDocumentPayload } from '@/lib/api';

const PROFILE_QUERY_KEY = ['taxProfile'];
const FILINGS_QUERY_KEY = ['taxFilings'];

export function useTaxProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => taxApi.getProfile(),
  });
}

export function useUpsertTaxProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaxProfilePayload) => taxApi.upsertProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}

export function useGenerateTaxDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GenerateTaxDocumentPayload) => taxApi.generateDocument(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FILINGS_QUERY_KEY });
    },
  });
}

export function useTaxFilings() {
  return useQuery({
    queryKey: FILINGS_QUERY_KEY,
    queryFn: () => taxApi.getAllFilings(),
  });
}

export function useDownloadFiling() {
  return useMutation({
    mutationFn: (id: number) => taxApi.downloadFiling(id),
  });
}
