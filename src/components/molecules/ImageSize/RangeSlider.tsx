import type { VFC, ChangeEvent } from "react"

interface Props {
  value: number
  onChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => void
}

export const RangeSlider: VFC<Props> = (props) => {
  return (
    <div className="flex flex-col flex-1 justify-end items-center h-full">
      <input
        type="range"
        min={1}
        max={2}
        className="range range-primary range-xs sm:range-sm"
        step={0.2}
        {...props}
      />
      <div className="flex overflow-hidden justify-between px-1.5 w-full h-2.5 text-xs sm:px-2 sm:h-4">
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </div>
    </div>
  )
}
