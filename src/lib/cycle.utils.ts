// lib/cycle-utils.ts
import { ApiSettings } from "@/types"; // adjust import

export interface Cycle {
    startDate: string;
    endDate: string;
}

export function calculateCurrentCycle(settings: ApiSettings | null): Cycle | null {
    if (!settings) return null;

    const cycleStartDay = settings.cycle_start_day ?? 21;
    const numericCycleStartDay =
        typeof cycleStartDay === 'string' ? parseInt(cycleStartDay, 10) : cycleStartDay;
    const finalCycleStartDay = isNaN(numericCycleStartDay) ? 21 : numericCycleStartDay;

    const now = new Date();
    const currentDay = now.getDate();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let cycleMonth, cycleYear;
    if (currentDay < finalCycleStartDay) {
        cycleMonth = currentMonth - 1;
        cycleYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    } else {
        cycleMonth = currentMonth;
        cycleYear = currentYear;
    }

    const startDate = new Date(cycleYear, cycleMonth, finalCycleStartDay);
    const endDate = new Date(cycleYear, cycleMonth + 1, finalCycleStartDay - 1);

    return {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
    };
}

export function isExpenseLocked(settings: ApiSettings | null): boolean {
    if (!settings) return false;

    const cycle = calculateCurrentCycle(settings);
    if (!cycle) return false;

    const bufferDays = settings.expense_release_buffer_days ?? 0;
    if (bufferDays <= 0) return false;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endDate = new Date(cycle.endDate);

    const lockStart = new Date(endDate);
    lockStart.setDate(lockStart.getDate() - bufferDays + 1);

    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const start = new Date(lockStart.getFullYear(), lockStart.getMonth(), lockStart.getDate());

    return today >= start && today <= end;
}