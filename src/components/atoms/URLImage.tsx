import type { VFC } from "react"
import { Image as KImage, Line, Circle } from "react-konva"
import useImage from "use-image"

import { ImagePropsWithHandler } from "@/types"

const DeleteButton: VFC<
  Pick<ImagePropsWithHandler, "x" | "y" | "onDelete" | "id" | "width">
> = ({ x, y: imageY, width: imageSize, onDelete, id }) => {
  const buttonSize = 16
  const margin = 12
  const y = imageY + imageSize + buttonSize * 2
  const circlePos = {
    x: x + imageSize,
    y: y - buttonSize / 2,
  }
  const crossLeft = x + imageSize - buttonSize / 2
  const crossRight = x + buttonSize + imageSize - buttonSize / 2
  const crossTop = y - buttonSize
  const crossBottom = y
  const crossLine1 = [crossLeft, crossTop, crossRight, crossBottom]
  const crossLine2 = [crossLeft, crossBottom, crossRight, crossTop]

  return (
    <>
      <Circle fill="gray" radius={buttonSize} {...circlePos} />
      <Line stroke={"white"} strokeWidth={2} points={crossLine1} />
      <Line stroke={"white"} strokeWidth={2} points={crossLine2} />
      <Circle
        opacity={0}
        radius={buttonSize}
        {...circlePos}
        onClick={() => onDelete(id)}
      />
    </>
  )
}

export const URLImage: VFC<ImagePropsWithHandler> = ({
  url,
  onDelete,
  ...props
}) => {
  const [image] = useImage(url)

  return (
    <>
      <DeleteButton
        x={props.x}
        y={props.y}
        id={props.id}
        width={props.width}
        onDelete={onDelete}
      />
      <KImage {...props} image={image} draggable _useStrictMode />
    </>
  )
}
