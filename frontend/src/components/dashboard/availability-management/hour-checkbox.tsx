import type React from "react"
import { Checkbox } from "@/components/ui/checkbox"

interface HourCheckboxProps {
  disabled?: boolean
  isSelected: boolean
  onClick: () => void
}

const HourCheckbox = ({ disabled, isSelected, onClick }: HourCheckboxProps) => {
  return (
    <Checkbox
      checked={isSelected}
      onCheckedChange={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white border-gray-300 hover:border-blue-400 disabled:cursor-not-allowed transition-all duration-150"
    />
  )
}

export default HourCheckbox
