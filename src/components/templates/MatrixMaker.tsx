import dynamic from "next/dynamic"
import type { VFC } from "react"

const Canvas = dynamic(import("./Canvas"), {
  ssr: false,
})
const Images = dynamic(import("./Images"), {
  ssr: false,
})

export const MatrixMaker: VFC = () => {
  return (
    <div className="flex flex-col items-center">
      <Canvas />
      <Images />
    </div>
  )
}
