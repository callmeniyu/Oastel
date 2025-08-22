export const isTripCompleted = (bookingDate: string, bookingTime: string) => {
    const currentDate = new Date()
    const tripDate = new Date(`${bookingDate} ${bookingTime}`)
    return tripDate < currentDate
}

export const formatBookedCount = (count: number | string) => {
    const n = typeof count === 'string' ? parseFloat(String(count).replace(/[^0-9.]/g, '')) : Number(count || 0)
    if (!isFinite(n) || isNaN(n)) return String(count)

    const abs = Math.abs(n)
    // Show exact number up to 999
    if (abs < 1000) return String(Math.round(n))

    const units = [
        { value: 1e9, suffix: 'B' },
        { value: 1e6, suffix: 'M' },
        { value: 1e3, suffix: 'K' },
    ]

    for (const u of units) {
        if (abs >= u.value) {
            const v = n / u.value
            // show one decimal for values < 10 and non-integers, otherwise no decimal
            let display: string
            if (Math.abs(v) >= 10 || Number.isInteger(v)) {
                display = String(Math.round(v))
            } else {
                display = v.toFixed(1).replace(/\.0$/, '')
            }
            return `${display}${u.suffix}+`
        }
    }

    return String(n)
}
