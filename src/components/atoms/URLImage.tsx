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
    y: y - margin - buttonSize / 2,
  }
  const crossTop = y - buttonSize - margin
  const crossBottom = y - margin
  const crossLine1 = [
    x + imageSize - buttonSize / 2,
    crossTop,
    x + buttonSize + imageSize - buttonSize / 2,
    crossBottom,
  ]
  const crossLine2 = [
    x + imageSize - buttonSize / 2,
    crossBottom,
    x + buttonSize + imageSize - buttonSize / 2,
    crossTop,
  ]

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
      <Circle fill="gray" radius={16} x={props.x + 8} y={props.y - 20} />
      <Line
        points={[props.x, props.y - 28, props.x + 16, props.y - 12]}
        stroke={"white"}
        strokeWidth={2}
      />
      <Line
        points={[props.x, props.y - 12, props.x + 16, props.y - 28]}
        stroke={"white"}
        strokeWidth={2}
      />
      <Circle
        opacity={0}
        radius={16}
        x={props.x + 8}
        y={props.y - 20}
        onClick={() => onDelete(props.id)}
      />
      <KImage {...props} image={image} draggable _useStrictMode />
    </>
  )
}
