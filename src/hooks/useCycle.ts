// hooks/useCurrentCycle.ts
import { useSettings } from "@/hooks/useSettings";
import { calculateCurrentCycle, isExpenseLocked } from "@/lib/cycle.utils";

export function useCurrentCycle() {
    const { data: settings } = useSettings();
    return calculateCurrentCycle(settings ?? null);
}

export function useExpenseLocked() {
    const { data: settings } = useSettings();
    return isExpenseLocked(settings ?? null);
}