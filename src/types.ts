export interface UserProfile {
  name: string;
  avatar: string;
  savingsPercent: number;
  lockDuration: number;
  creditScore: number;
  onboarded: boolean;
  email: string;
  memberSince: string;
  currency: string;
  language: string;
  timezone: string;
  notificationsEnabled: boolean;
  releaseBufferDays: number;
  cycleStartDay: number;
  cycleChangesRemaining: number;
  cycleResetsUsed: number;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  name: string;
  amount: number;
  category: string;
  date: string;
  releaseDate?: string;
  isReleased: boolean;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  amount: number;
  category: string;
  isRecurring: boolean;
  isBasket: boolean;
  items: BasketItem[];
  transactions: string[];
}

export interface BasketItem {
  name: string;
  amount: number;
  quantity: number;
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  monthsPaid: number;
  repaymentMonths: number;
  monthlyPayment: number;
}

export interface InflationItem {
  id: string;
  name: string;
  category: string;
  price: number;
  previousPrice?: number;
  cycleId: string;
}

export interface ApiSettings {
  id: number;
  user_id: number;
  currency: string;
  language: string;
  timezone: string;
  notifications: boolean;
  expense_release_buffer_days: number;
  cycle_start_day: number;
  updated_at: string;
}

export interface InflationBasket {
  id: string;
  name: string;
  items: InflationItem[];
  cycleId: string;
}

export type PageId = "dashboard" | "income" | "expenses" | "savings" | "debts" | "inflation" | "templates" | "tax" | "settings" | "profile" | "insights";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

export interface CycleChangeHistory {
  id: string;
  previousStartDay: number;
  newStartDay: number;
  changedAt: string;
}