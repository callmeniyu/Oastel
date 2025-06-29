"use client"
type GreenBtnProps = {
    customStyles?: string
    onClick: () => void
    text:string
}
const GreenBtn = ({ customStyles, onClick, text }: GreenBtnProps) => {
    return (
        <button onClick={onClick} className={`bg-primary_green text-white text-sm px-4 py-2 rounded-md font-poppins ${customStyles} `}>
            {text}
        </button>
    )
}

export default GreenBtn
