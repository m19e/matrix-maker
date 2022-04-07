import { useState } from "react"
import type { VFC } from "react"
import { Stage, Layer, Image } from "react-konva"
import type { KonvaNodeEvents } from "react-konva"
import useImage from "use-image"

interface ImageProps {
  data: HTMLImageElement | undefined
  id: string
  x: number
  y: number
  isDragged: boolean
}

interface ImagePropsWithHandler extends ImageProps {
  onDragStart: KonvaNodeEvents["onDragStart"]
  onDragEnd: KonvaNodeEvents["onDragEnd"]
}

const LionImage: VFC<ImagePropsWithHandler> = (props) => {
  const [image] = useImage("https://konvajs.org/assets/lion.png")
  return (
    <Image
      {...props}
      draggable
      image={image}
      alt={props.id}
      onClick={(e) => {
        console.log("clicked id:", e.target.id())
      }}
    />
  )
}

const generateShapes = (size: number): ImageProps[] => {
  return [...Array(5)].map((_, i) => ({
    data: undefined,
    id: i.toString(),
    x: Math.random() * size,
    y: Math.random() * size,
    isDragged: false,
  }))
}

const INITIAL_STATE = generateShapes(500)

export const Images = () => {
  const [images, setImages] = useState<ImageProps[]>(INITIAL_STATE)

  const handleDragStart: KonvaNodeEvents["onDragStart"] = (e) => {
    const id = e.target.id()
    setImages(
      images.map((image) => {
        return {
          ...image,
          isDragged: image.id === id,
        }
      })
    )
  }
  const handleDragEnd: KonvaNodeEvents["onDragEnd"] = (e) => {
    const id = e.target.id()
    setImages(
      images.map((image) => {
        if (image.id === id) {
          return {
            ...image,
            x: e.target.x(),
            y: e.target.y(),
            isDragged: false,
          }
        }
        return {
          ...image,
          isDragged: false,
        }
      })
    )
  }

  return (
    <Stage width={500} height={500}>
      <Layer>
        {images.map((image) => (
          <LionImage
            {...image}
            key={image.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Layer>
    </Stage>
  )
}
