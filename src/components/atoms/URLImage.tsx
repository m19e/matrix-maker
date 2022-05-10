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
  const offsetX = image.x + image.size
  const offsetY = image.y + image.size
  const initY = offsetY + buttonSize * 2
  const circlePos = {
    x: offsetX,
    y: initY - buttonSize / 2,
  }
  const crossLeft = offsetX - buttonSize / 2
  const crossRight = offsetX + buttonSize - buttonSize / 2
  const crossTop = initY - buttonSize
  const crossBottom = initY
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
  onSelect,
  onDelete,
  isSelected,
  ...props
}) => {
  const [image] = useImage(url)

  const handleSelect = () => {
    onSelect(props.id)
  }
  const handleDelete = () => {
    onDelete(props.id)
  }

  return (
    <>
      {isSelected && (
        <DeleteButton
          image={{
            x: props.x,
            y: props.y,
            size: props.width,
          }}
          onDelete={handleDelete}
        />
      )}
      <KImage
        {...props}
        image={image}
        onClick={handleSelect}
        stroke="gray"
        strokeWidth={1}
        dash={[5, 5]}
        dashEnabled={isSelected}
        strokeEnabled={isSelected}
        draggable
        _useStrictMode
      />
    </>
  )
}
