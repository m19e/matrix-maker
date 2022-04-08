import { useState } from "react"
import type { VFC } from "react"
import { Stage, Layer, Image, Line, Text } from "react-konva"
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

const URLImage: VFC<ImagePropsWithHandler> = (props) => {
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
    <Image {...props} draggable image={image} alt={props.id} {...transformed} />
  )
}

const AxisLayer: VFC<{ rect: number }> = ({ rect }) => {
  const fontSize = rect * 0.03
  const start = fontSize * 1.5
  const end = rect - start
  const middle = rect / 2

  return (
    <Layer>
      <Line points={[start, middle, end, middle]} stroke={"gray"} />
      <Line points={[middle, start, middle, end]} stroke={"gray"} />
    </Layer>
  )
}

const LabelLayer: VFC<{ rect: number }> = ({ rect }) => {
  const fontSize = rect * 0.03
  const paddingTL = fontSize / 4
  const paddingBR = rect - fontSize - paddingTL

  return (
    <Layer>
      <Text
        text="年上"
        x={0}
        y={paddingTL}
        width={rect}
        align={"center"}
        fontSize={fontSize}
      />
      <Text
        text="年下"
        x={0}
        y={paddingBR}
        width={rect}
        align={"center"}
        fontSize={fontSize}
      />
      <Text
        text="大きい"
        x={paddingBR}
        y={0}
        height={rect}
        width={fontSize}
        verticalAlign={"middle"}
        fontSize={fontSize}
      />
      <Text
        text="小さい"
        x={paddingTL}
        y={0}
        height={rect}
        width={fontSize}
        verticalAlign={"middle"}
        fontSize={fontSize}
      />
    </Layer>
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
  const [imageRect, setImageRect] = useState(STD_RECT)

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
  const handleSelectRect = (r: number) => {
    setImageRect(r)
    setImages((prev) => prev.map((i) => ({ ...i, rect: r })))
  }

  const rootRect = 800

  return (
    <div className="p-10 bg-base-100 text-base-content">
      <Stage width={rootRect} height={rootRect}>
        <AxisLayer rect={rootRect} />
        <Layer>
          {images.map((image) => (
            <URLImage
              {...image}
              key={image.id}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}
        </Layer>
        <LabelLayer rect={rootRect} />
      </Stage>
      <div className="flex gap-2 justify-end">
        <button
          className="btn"
          onClick={() => handleSelectRect(rootRect * 0.2 * 0.8)}
        >
          S
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleSelectRect(rootRect * 0.2)}
        >
          M
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => handleSelectRect(rootRect * 0.2 * 1.2)}
        >
          L
        </button>
        {/* <button
          className="btn btn-accent"
          onClick={() => handleSelectRect(240)}
        >
          LL
        </button> */}
      </div>
    </div>
  )
}
