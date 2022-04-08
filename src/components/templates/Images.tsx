import { useState } from "react"
import type { VFC } from "react"
import { Stage, Layer, Image } from "react-konva"
import type { KonvaNodeEvents } from "react-konva"
import useImage from "use-image"

interface ImageProps {
  data: HTMLImageElement | undefined
  url: string
  id: string
  x: number
  y: number
  rect: number
  isDragged: boolean
}

interface ImagePropsWithHandler extends ImageProps {
  onDragStart: KonvaNodeEvents["onDragStart"]
  onDragEnd: KonvaNodeEvents["onDragEnd"]
}

const STD_RECT = 240

const LionImage: VFC<ImagePropsWithHandler> = (props) => {
  const [image] = useImage(props.url)

  const transformed: { width: number; height: number } = (() => {
    const { rect } = props
    if (image) {
      const { width, height } = image
      if (width > height) {
        const newHeight = height * (rect / width)
        return { width: rect, height: newHeight }
      }
      if (height > width) {
        const newWidth = width * (rect / height)
        return { width: newWidth, height: rect }
      }
    }
    return {
      width: rect,
      height: rect,
    }
  })()

  return (
    <Image
      {...props}
      draggable
      image={image}
      alt={props.id}
      {...transformed}
      onClick={(e) => {
        console.log("clicked id:", e.target.id())
      }}
    />
  )
}

const URLS = [
  "https://poplinks.idolmaster-official.jp/images/idol/y3xf3qyq/img_thumb.png",
  "https://poplinks.idolmaster-official.jp/images/idol/ahfrudkf/img_thumb.png",
  "https://poplinks.idolmaster-official.jp/images/idol/qq21osxs/img_thumb.png",
  "https://poplinks.idolmaster-official.jp/images/idol/fjtgwau6/img_thumb.png",
  "https://poplinks.idolmaster-official.jp/images/idol/s7mg8tvk/img_thumb.png",
]

const generateShapes = (size: number): ImageProps[] => {
  return URLS.map((url, i) => ({
    url,
    data: undefined,
    id: i.toString(),
    x: Math.random() * size,
    y: Math.random() * size,
    rect: STD_RECT,
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
