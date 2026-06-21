// loan dates from API are yyyy-MM-dd strings
function parseIsoDate(iso?: string | null): Date | null {
    if (!iso) return null;
    const parts = iso.split("T")[0].split("-").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

function toIsoDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function addMonthsToIso(iso: string, months: number): string {
    const date = parseIsoDate(iso);
    if (!date) return iso;
    date.setMonth(date.getMonth() + months);
    return toIsoDate(date);
}

export function formatLoanDate(iso?: string | null): string {
    const date = parseIsoDate(iso);
    if (!date) return iso ?? "—";
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// show due date from API, or borrow date + 1 month as fallback
export function displayDueDate(borrowDate?: string | null, dueDate?: string | null): string {
    const iso = dueDate ?? (borrowDate ? addMonthsToIso(borrowDate, 1) : null);
    return formatLoanDate(iso);
}
