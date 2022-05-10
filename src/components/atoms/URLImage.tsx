import type { VFC } from "react"
import { Image as KImage, Line, Circle } from "react-konva"
import useImage from "use-image"

import { ImagePropsWithHandler } from "@/types"

interface DeleteButtonProps {
  image: {
    x: number
    y: number
    size: number
  }
  onDelete: () => void
}

const DeleteButton: VFC<DeleteButtonProps> = ({ image, onDelete }) => {
  const buttonSize = 16
  const margin = 12
  const y = image.y + image.size + buttonSize * 2
  const circlePos = {
    x: image.x + image.size,
    y: y - buttonSize / 2,
  }
  const crossLeft = image.x + image.size - buttonSize / 2
  const crossRight = image.x + buttonSize + image.size - buttonSize / 2
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
        onClick={onDelete}
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

  const handleDelete = () => {
    onDelete(props.id)
  }

  return (
    <>
      <DeleteButton
        image={{
          x: props.x,
          y: props.y,
          size: props.width,
        }}
        onDelete={handleDelete}
      />
      <KImage {...props} image={image} draggable _useStrictMode />
    </>
  )
}
