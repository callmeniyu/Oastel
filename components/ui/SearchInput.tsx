// SearchInput.tsx
import { FaSearch } from "react-icons/fa"

type SearchInputProps = {
  customeStyles?: string
  value: string
  onChange: (value: string) => void
  onSearch: () => void
}

export default function SearchInput({ customeStyles, value, onChange, onSearch }: SearchInputProps) {
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
        <button onClick={onSearch}>
          <FaSearch className="text-primary_green cursor-pointer" />
        </button>
      </div>
    </div>
  )
}
