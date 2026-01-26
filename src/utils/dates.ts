export function isSameDay(a: number, b: number) {
    const da = new Date(a);
    const db = new Date(b);
    return (
        da.getFullYear() === db.getFullYear() &&
        da.getMonth() === db.getMonth() &&
        da.getDate() === db.getDate()
    );
}

export function dayLabel(ms: number) {
    return new Date(ms).toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function timeLabel(ms: number) {
    return new Date(ms).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}