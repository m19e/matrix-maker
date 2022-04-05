import type { VFC } from "react"

export const MatrixMaker: VFC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="p-10 bg-base-100 text-base-content">
        <button className="btn">button</button>
        <button className="btn btn-primary">button</button>
        <button className="btn btn-secondary">button</button>
        <button className="btn btn-accent">button</button>
      </div>
    </div>
  )
}
