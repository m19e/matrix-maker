import dynamic from "next/dynamic"
import type { VFC } from "react"

const Images = dynamic(import("./Images"), {
  ssr: false,
})

export const MatrixMaker: VFC = () => {
  return <Images />
}
