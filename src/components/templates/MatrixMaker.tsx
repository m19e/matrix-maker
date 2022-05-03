import dynamic from "next/dynamic"
import type { VFC } from "react"

const Images = dynamic(import("./Images"), {
  ssr: false,
})

type Props = {
  isMobile: boolean
}

export const MatrixMaker: VFC<Props> = ({ isMobile }) => {
  return <Images isMobile={isMobile} />
}
