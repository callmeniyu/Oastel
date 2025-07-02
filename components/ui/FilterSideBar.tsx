import GreenBtn from "./GreenBtn"

type FilterState = {
    type: string
    prices: string[]
  durations: string[]
}

type Props = {
    filters: FilterState
    onFilterChange: (field: keyof FilterState, value: string | string[]) => void
  onApply: () => void
        isSmallScreen?: boolean

}

export default function FilterSidebar({ filters, onFilterChange, onApply, isSmallScreen }: Props) {
    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange("type", e.target.value)
    }

    const handleCheckboxChange = (field: "prices" | "durations", value: string) => {
        const updated = filters[field].includes(value)
            ? filters[field].filter((v) => v !== value)
            : [...filters[field], value]
        onFilterChange(field, updated)
    }

    return (
        <aside className={`w-full sm:w-64 bg-white ${!isSmallScreen && "border"} rounded-md ${!isSmallScreen && "shadow-md"} p-4 max-h-max`}>
            <h3 className="text-lg font-semibold mb-4 text-title_black">Filters</h3>

            <div className="mb-4">
                <p className="text-sm font-medium text-title_black mb-2">Type</p>
                <ul className="space-y-1 text-desc_gray text-sm">
                    {["All", "Co-Tour", "Private"].map((val) => (
                        <li key={val}>
                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value={val}
                                    checked={filters.type === val}
                                    onChange={handleRadioChange}
                                />{" "}
                                {val}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-4">
                <p className="text-sm font-medium text-title_black mb-2">Price</p>
                <ul className="space-y-1 text-desc_gray text-sm">
                    {["50-200", "200-300", "300-450", "450-600"].map((range) => (
                        <li key={range}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={filters.prices.includes(range)}
                                    onChange={() => handleCheckboxChange("prices", range)}
                                />{" "}
                                RM {range}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-4">
                <p className="text-sm font-medium text-title_black mb-2">Duration</p>
                <ul className="space-y-1 text-desc_gray text-sm">
                    {["Half-day", "Full-day"].map((dur) => (
                        <li key={dur}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={filters.durations.includes(dur)}
                                    onChange={() => handleCheckboxChange("durations", dur)}
                                />{" "}
                                {dur}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <GreenBtn text="Apply Filters" customStyles="w-full font-medium" onClick={onApply} />
        </aside>
    )
}
