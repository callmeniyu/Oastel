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
    onClear?: () => void
}

export default function TourFilterBar({ filters, onFilterChange, onApply, isSmallScreen, onClear }: Props) {
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
        <aside
            className={`w-full sm:w-64 bg-white ${!isSmallScreen && "border"} rounded-md ${
                !isSmallScreen && "shadow-md"
            } p-4 max-h-[80vh] overflow-y-auto`}
        >
            <h3 className="text-center text-lg font-semibold bg-primary_green text-white py-2 rounded-t-lg mb-4">
                Filters
            </h3>
            <div className="mb-4 border-t pt-2">
                <h4 className="font-semibold text-title_black mb-2 text-md">Type</h4>
                <ul className="space-y-1 text-desc_gray text-sm">
                    {["All", "Co-Tour", "Private"].map((val) => (
                        <li key={val}>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name={isSmallScreen ? "type-mobile" : "type-desktop"}
                                    value={val}
                                    checked={filters.type === val}
                                    onChange={handleRadioChange}
                                    className="mr-2"
                                />
                                {val}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-4 border-t pt-2">
                <p className="text-md font-medium text-title_black mb-2">Price</p>
                <ul className="space-y-1 text-desc_gray text-sm">
                    {["50-200", "200-300", "300-450", "450-600"].map((range) => (
                        <li key={range}>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.prices.includes(range)}
                                    onChange={() => handleCheckboxChange("prices", range)}
                                    className="mr-2"
                                />
                                RM {range}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-4 border-t pt-2">
                <p className="text-md font-medium text-title_black mb-2">Duration</p>
                <ul className="space-y-1 text-desc_gray text-sm">
                    {["Half-day", "Full-day"].map((dur) => (
                        <li key={dur}>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.durations.includes(dur)}
                                    onChange={() => handleCheckboxChange("durations", dur)}
                                    className="mr-2"
                                />
                                {dur}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <GreenBtn text="Apply Filters" customStyles="w-full font-medium" onClick={onApply} />
            {onClear && (
                <GreenBtn
                    text="Clear Filters"
                    customStyles="w-full font-medium bg-white border border-primary_green mt-3 !text-primary_green"
                    onClick={onClear}
                />
            )}
        </aside>
    )
}
