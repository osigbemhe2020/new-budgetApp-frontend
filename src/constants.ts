export const BRAND_NAME = "BudgetWise";
export const PRIMARY_BLUE = "#2563EB";
export const LIGHT_BLUE = "#EFF6FF";

export const INCOME_CATEGORIES = ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"];
export const EXPENSE_CATEGORIES = ["Food", "Transport", "Housing", "Utilities", "Entertainment", "Health", "Education", "Shopping", "Other"];

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
  "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
  "Yobe", "Zamfara", "FCT"
];

export const AVATARS = ["👤", "👩", "👨", "🧑", "👩‍💼", "👨‍💼", "🧑‍💻", "👩‍🎓"];

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" });
}
