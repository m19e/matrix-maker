import type { ChangeEvent, VFC } from "react"

const SIZES = ["XS", "S", "M", "L", "LL", "3L"]
const OPTIONS = SIZES.map((size, i) => ({ size, value: 1 + i * 0.2 })).map(
  (opt) => ({ ...opt, label: `${opt.value * 100}% ${opt.size}` })
)

interface Props {
  onChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => void
}

export const ImageSizeSelect: VFC<Props> = ({ onChange }) => {
  return (
    <select
      className="flex-1 max-w-xs select-sm select select-bordered"
      onChange={onChange}
    >
      <option disabled selected>
        ITEM SIZE
      </option>
      {OPTIONS.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
