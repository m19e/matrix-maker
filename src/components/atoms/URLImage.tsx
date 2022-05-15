import type { VFC } from "react"
import { Image as KImage, Line, Circle } from "react-konva"
import useImage from "use-image"

import { ImagePropsWithHandler } from "@/types"

interface DeleteButtonProps {
  size: number
  image: {
    x: number
    y: number
    size: number
  }
  onDelete: () => void
}

const DeleteButton: VFC<DeleteButtonProps> = ({ size, image, onDelete }) => {
  const buttonSize = size
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
        onTap={onDelete}
      />
    </>
  )
}

interface Props extends ImagePropsWithHandler {
  isMobile: boolean
}

export const URLImage: VFC<Props> = ({
  url,
  onDelete,
  isSelected,
  isMobile,
  ...props
}) => {
  const [image] = useImage(url)

  const handleDelete = () => {
    onDelete(props.id)
  }

  return (
    <>
      {isSelected && (
        <DeleteButton
          size={isMobile ? 32 : 16}
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
