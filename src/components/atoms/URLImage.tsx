import type { VFC } from "react"
import { Image as KImage } from "react-konva"
import useImage from "use-image"

import { ImagePropsWithHandler } from "@/types"

export const URLImage: VFC<ImagePropsWithHandler> = ({ url, ...props }) => {
  const [image] = useImage(url)

  return <KImage {...props} image={image} draggable _useStrictMode />
}
