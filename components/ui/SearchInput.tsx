// SearchInput.tsx
import { FaSearch, FaTimes } from "react-icons/fa"

type SearchInputProps = {
    customeStyles?: string
    value: string
    onChange: (value: string) => void
    onSearch: () => void
    onClear?: () => void
}

export default function SearchInput({ customeStyles, value, onChange, onSearch, onClear }: SearchInputProps) {
    return (
        <div className={`w-full max-w-md mx-auto ${customeStyles}`}>
            <div className="flex items-center border border-primary_green rounded-full overflow-hidden pl-4 px-3 py-2 bg-white">
                <input
                    type="text"
                    placeholder="Search for any tour packages"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full outline-none text-sm font-poppins placeholder:font-poppins"
                />
                <div className="flex items-center gap-2">
                    {value.trim() && onClear && (
                        <button
                            onClick={onClear}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            type="button"
                        >
                            <FaTimes className="text-sm" />
                        </button>
                    )}
                    <button onClick={onSearch} type="button">
                        <FaSearch className="text-primary_green cursor-pointer" />
                    </button>
                </div>
            </div>
        </div>
    )
}
