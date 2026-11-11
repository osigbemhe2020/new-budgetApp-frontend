import axios from 'axios';
import type { ApiSettings } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('bf_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id?: number;
  UserID?: number;
  FullName?: string;
  full_name?: string;
  Email?: string;
  email?: string;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
  monthMessage?: string;
}

export const authApi = {
  signup: (data: SignupPayload) =>
    apiClient.post<AuthResponse>('/auth/signup', data).then((r) => r.data),

  login: (data: LoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  logout: () =>
    apiClient.post('/auth/logout').then((r) => r.data),

  getProfile: () =>
    apiClient.get<{ message: string; user: AuthUser }>('/auth/profile').then((r) => r.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post('/auth/change-password', { currentPassword, newPassword }).then((r) => r.data),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { token, newPassword }).then((r) => r.data),
};

// ─── Income ──────────────────────────────────────────────────────────────────
export interface ApiIncome {
  id: number;
  userId?: number;
  user_id?: number;
  source_name: string;
  name?: string;
  amount: number;
  category?: string;
  created_at: string;
  monthId?: number;
  is_released?: boolean;
}

export interface CreateIncomePayload {
  name: string;
  amount: number;
  //category: string;
}

export const incomeApi = {
  getAll: () =>
    apiClient.get<{ message: string; count: number; incomes: ApiIncome[] }>('/income').then((r) => r.data.incomes),

  create: (data: CreateIncomePayload) =>
    apiClient.post<ApiIncome>('/income/add', data).then((r) => r.data),

  update: (id: number, data: Partial<CreateIncomePayload>) =>
    apiClient.put<ApiIncome>(`/income/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/income/${id}`).then((r) => r.data),
};

// ─── Expenses ────────────────────────────────────────────────────────────────
export interface ApiExpense {
  id: number;
  user_id: number;
  expense_name: string;
  amount: number;
  category: string;
  release_date: string;
  is_released: boolean;
  created_at: string;
}

export interface CreateExpensePayload {
  expense_name: string;
  amount: number;
  category: string;
}

export interface ApiExpenseTemplate {
  id: number;
  userId: number;
  template_name: string;
  description?: string;
  default_amount?: number | null;
  category: string | null;
  is_recurring: boolean;
  recurring_day?: number | null;
  release_date?: string | null;
  is_basket: boolean;
  parent_basket_id?: number | null;
  created_at: string;
}

export const expensesApi = {
  getAll: () =>
    apiClient.get<{ message: string; count: number; expenses: { unreleased: ApiExpense[]; released: ApiExpense[] } }>('/expenses').then((r) => [...r.data.expenses.unreleased, ...r.data.expenses.released]),

  create: (data: CreateExpensePayload) =>
    apiClient.post<ApiExpense>('/expenses', data).then((r) => r.data),

  update: (id: number, data: Partial<CreateExpensePayload>) =>
    apiClient.put<ApiExpense>(`/expenses/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/expenses/${id}`).then((r) => r.data),

  getTemplates: () =>
    apiClient.get<{ message: string; count: number; templates: { baskets?: ApiExpenseTemplate[]; recurring?: ApiExpenseTemplate[]; regular?: ApiExpenseTemplate[] } }>('/expenses/templates').then((r) => {
      const { baskets = [], recurring = [], regular = [] } = r.data.templates ?? {};
      return [...baskets, ...recurring, ...regular];
    }),

  createTemplate: (data: {
    template_name: string;
    description?: string;
    category: string;
    is_recurring: boolean;
    default_amount?: number;
    recurring_day?: number;
    release_date?: string;
    is_basket?: boolean;
    parent_basket_id?: number;
  }) =>
    apiClient.post<ApiExpenseTemplate>('/expenses/templates', data).then((r) => r.data),

  deleteTemplate: (id: number) =>
    apiClient.delete(`/expenses/templates/${id}`).then((r) => r.data),
};

// ─── Savings ─────────────────────────────────────────────────────────────────
export interface ApiSavingsSettings {
  id?: number;
  userId?: number;
  user_id?: number;
  savings_percentage: number;
  lock_duration_months: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiSavingsRecord {
  id: number;
  user_id: number;
  amount_saved: number;
  unlock_date: string;
  lock_duration_months: number;
  status: 'locked' | 'unlocked';
  created_at: string;
}

export const savingsApi = {
  getAll: () =>
    apiClient.get<{ message: string; count: number; savings: ApiSavingsRecord[] }>('/savings').then((r) => r.data.savings),

  getLocked: () =>
    apiClient.get<{ message: string; count: number; savings: ApiSavingsRecord[] }>('/savings/locked').then((r) => r.data.savings),

  getSettings: () =>
    apiClient.get<{ message: string; settings: ApiSavingsSettings }>('/savings/settings').then((r) => r.data.settings),

  createSettings: (data: { savings_percentage: number; lock_duration_months: number }) =>
    apiClient.post<{ message: string; settings: ApiSavingsSettings }>('/savings/settings', data).then((r) => r.data.settings),

  updateSettings: (data: { savings_percentage: number; lock_duration_months: number }) =>
    apiClient.put<{ message: string; settings: ApiSavingsSettings }>('/savings/settings', data).then((r) => r.data.settings),

  lock: () =>
    apiClient.post(`/savings/lock`, {}).then((r) => r.data),

  unlock: (savingsId: number) =>
    apiClient.post(`/savings/unlock`, { savingsId }).then((r) => r.data),
};

// ─── Debts ───────────────────────────────────────────────────────────────────
export interface ApiDebt {
  id: number;
  userId?: number;
  user_id?: number;
  monthId?: number;
  debt_amount: number;
  total_payable?: number;
  interest_rate: number;
  interest_amount?: number;
  monthly_principal?: number;
  monthly_interest?: number;
  repayment_months?: number;
  months_paid?: number;
  next_payment_date?: string;
  status: 'pending' | 'paid' | 'active';
  created_at: string;
  description?: string;
  total_amount?: number;
  remaining_amount?: number;
  monthly_payment?: number;
  due_date?: string;
}

export interface CreateDebtPayload {
  description?: string;
  debt_amount?: number;
  total_amount?: number;
  interest_rate?: number;
  due_date?: string;
}

export const debtsApi = {
  getAll: () =>
    apiClient.get<{ message: string; count: number; debts: ApiDebt[] }>('/debts').then((r) => r.data.debts),

  getActive: () =>
    apiClient.get<{ message: string; count: number; debts: ApiDebt[] }>('/debts/active').then((r) => r.data.debts),

  getHistory: () =>
    apiClient.get<{ message: string; count: number; debts: ApiDebt[] }>('/debts/history').then((r) => r.data.debts),

  getById: (id: number) =>
    apiClient.get<ApiDebt>(`/debts/${id}`).then((r) => r.data),

  create: (data: CreateDebtPayload) =>
    apiClient.post<ApiDebt>('/debts', { debt_amount: data.debt_amount ?? data.total_amount }).then((r) => r.data),

  setRepaymentPlan: (id: number, repaymentMonths: number) =>
    apiClient.put(`/debts/${id}/repayment`, { repayment_months: repaymentMonths }).then((r) => r.data),

  makePayment: (id: number) =>
    apiClient.put(`/debts/${id}/pay`, {}).then((r) => r.data),
};

// ─── Inflation ───────────────────────────────────────────────────────────────
export interface ApiInflationSummary {
  overallInflationRate: number;
  totalItems: number;
  averagePriceChange: number;
  items: Array<{
    id: number;
    name: string;
    currentPrice: number;
    previousPrice: number;
    inflationRate: number;
    category: string;
  }>;
}

export const inflationApi = {
  getSummary: () =>
    apiClient.get<ApiInflationSummary>('/inflation/summary').then((r) => r.data),

  getItemInflation: (id: number) =>
    apiClient.get(`/inflation/templates/${id}/inflation`).then((r) => r.data),

  getBasketInflation: (id: number) =>
    apiClient.get(`/inflation/templates/basket/${id}/inflation`).then((r) => r.data),

  adjustPrice: (id: number, newPrice: number) =>
    apiClient.put(`/inflation/templates/${id}/adjust-price`, { newPrice }).then((r) => r.data),
};

// ─── Settings ────────────────────────────────────────────────────────────────
export const settingsApi = {
  get: () =>
    apiClient.get<{ message: string; settings: ApiSettings }>('/settings').then((r) => r.data.settings),

  update: (data: Partial<ApiSettings>) =>
    apiClient.put<{ message: string; settings: ApiSettings }>('/settings', data).then((r) => r.data.settings),

  updateCycleStartDay: (cycleStartDay: number) =>
    apiClient.put('/settings/cycle', { cycle_start_day: cycleStartDay }).then((r) => r.data),

  updateReleaseBuffer: (releaseBufferDays: number) =>
    apiClient.put('/settings/release-buffer', { expense_release_buffer_days: releaseBufferDays }).then((r) => r.data),
};

// ─── Tax ────────────────────────────────────────────────────────────────────
export interface ApiTaxProfile {
  id?: number;
  user_id?: number;
  userId?: number;
  full_name?: string;
  email?: string;
  account_type: 'Personal' | 'Sole Trader' | 'personal' | 'sole trader';
  tin?: string;
  date_of_birth?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'male' | 'female' | 'other';
  phone?: string;
  phone_number?: string;
  address?: string;
  state_of_residence?: string;
  lga?: string;
  occupation?: string;
  employer_name?: string;
  pension_contribution?: number;
  nhf_contribution?: number;
  life_insurance_premium?: number;
  is_complete?: number | boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaxProfilePayload {
  full_name?: string;
  email?: string;
  account_type?: string;
  tin?: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  phone_number?: string;
  address?: string;
  state_of_residence?: string;
  lga?: string;
  occupation?: string;
  employer_name?: string;
  pension_contribution?: number;
  nhf_contribution?: number;
  life_insurance_premium?: number;
}

export interface GenerateTaxDocumentPayload {
  period_type: 'Last Month' | 'Last Quarter' | 'Last 6 Months' | 'Full Year' | 'Calendar Year' | 'Custom Range' | 'last_month' | 'quarter' | 'half_year' | 'full_year' | 'calendar_year' | 'custom' | string;
  custom_from?: string;
  custom_to?: string;
  period_start?: string;
  period_end?: string;
}

export interface TaxPreview {
  period: string;
  gross_income: number;
  total_expenses: number;
  estimated_tax_payable: number;
  effective_rate: number;
}

export interface ApiTaxFiling {
  id: number;
  user_id: number;
  period_type: string;
  date_from: string;
  date_to: string;
  gross_income: number;
  tax_payable: number;
  status: 'Completed' | 'Processing' | 'Failed';
  email_sent: boolean;
  download_url?: string;
  download_expires_at?: string;
  created_at: string;
}

export const taxApi = {
  getProfile: () =>
    apiClient.get<{ message: string; profile: ApiTaxProfile }>('/tax/profile').then((r) => r.data.profile),

  upsertProfile: (data: CreateTaxProfilePayload) =>
    apiClient.post<{ message: string; profile: ApiTaxProfile }>('/tax/profile', data).then((r) => r.data.profile),

  generateDocument: (data: GenerateTaxDocumentPayload) =>
    apiClient.post<{ message: string; filing: ApiTaxFiling }>('/tax/generate', data).then((r) => r.data.filing),

  getAllFilings: () =>
    apiClient.get<{ message: string; filings: ApiTaxFiling[] }>('/tax/filings').then((r) => r.data.filings),

  downloadFiling: (id: number) =>
    apiClient.get(`/tax/filings/${id}/download`, { responseType: 'blob' }).then((r) => r.data),
};
