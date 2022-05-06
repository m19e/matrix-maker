import type { VFC } from "react"
import { Image as KImage, Line } from "react-konva"
import useImage from "use-image"

import { ImagePropsWithHandler } from "@/types"

export const URLImage: VFC<ImagePropsWithHandler> = ({ url, ...props }) => {
  const [image] = useImage(url)

  return (
    <>
      <Line
        points={[props.x, props.y - 16, props.x + 16, props.y]}
        stroke={"gray"}
      />
      <Line
        points={[props.x, props.y, props.x + 16, props.y - 16]}
        stroke={"gray"}
      />
      <KImage {...props} image={image} draggable _useStrictMode />
    </>
  )
}
