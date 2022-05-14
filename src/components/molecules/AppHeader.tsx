import type { VFC } from "react"
import { LabelInputProps } from "@/types"

interface HeaderProps {
  inputs: LabelInputProps[]
}

export const AppHeader: VFC<HeaderProps> = ({ inputs }) => {
  return (
    <div className="grid grid-cols-4 gap-2 p-2 w-full sm:rounded-b-lg bg-base-100">
      {inputs.map((input) => (
        <input
          key={input.placeholder}
          type="text"
          className="max-w-xs text-xs bg-white input input-sm input-bordered sm:input-md"
          {...input}
        />
      ))}
    </div>
  )
}
