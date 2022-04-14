import { useState, useCallback, useRef } from "react"
import type { VFC, RefObject } from "react"
import { Stage, Layer, Rect, Line, Text } from "react-konva"
import type { KonvaNodeEvents } from "react-konva"
import type Konva from "konva"
import type { Area } from "react-easy-crop/types"

import { ImageProps } from "@/types"
import { ImageCropper } from "@/components/molecules/ImageCropper"
import { URLImage } from "@/components/atoms/URLImage"

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
    id: i.toString(),
    alt: i.toString(),
    x: Math.random() * size,
    y: Math.random() * size,
    width: DEFAULT_IMAGE_SIZE,
    height: DEFAULT_IMAGE_SIZE,
    crop: { x: 0, y: 0, width: 0, height: 0 },
    isDragged: false,
  }))
}

const DEFAULT_CANVAS_SIZE = 800
const DEFAULT_IMAGE_SIZE = DEFAULT_CANVAS_SIZE * 0.1

const useCanvas = (): [RefObject<Konva.Stage>, { save: () => void }] => {
  const canvasRef = useRef<Konva.Stage>(null)

  const downloadURI = (uri: string, name: string) => {
    const link = document.createElement("a")
    link.download = name
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const save = () => {
    const uri = canvasRef.current?.toDataURL({ pixelRatio: 2 })
    if (uri) {
      const fileName = `matrix-${Date.now().toString(16)}.png`
      downloadURI(uri, fileName)
    }
  }

  return [canvasRef, { save }]
}

const AxisLayer: VFC<{ rect: number }> = ({ rect }) => {
  const fontSize = rect * 0.03
  const start = fontSize * 1.5
  const end = rect - start
  const middle = rect / 2

  return (
    <Layer>
      <Rect width={rect} height={rect} fill="white" />
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

const Images = () => {
  const [images, setImages] = useState<ImageProps[]>([])
  const [imageSize, setImageSize] = useState(DEFAULT_IMAGE_SIZE)

  const handleDragStart: KonvaNodeEvents["onDragStart"] = (e) => {
    const id = e.target.id()
    setImages((prev) =>
      prev.map((image) => {
        return {
          ...image,
          isDragged: image.id === id,
        }
      })
    )
  }
  const handleDragMove: KonvaNodeEvents["onDragMove"] = useCallback(
    (e) => {
      const id = e.target.id()
      const targetX = e.target.x()
      const targetY = e.target.y()
      const borderBR = DEFAULT_CANVAS_SIZE - imageSize
      if (
        targetX < 0 ||
        targetX > borderBR ||
        targetY < 0 ||
        targetY > borderBR
      ) {
        let newPos = { x: targetX, y: targetY }

        if (targetX < 0) {
          newPos = { ...newPos, x: 0 }
        } else if (targetX > borderBR) {
          newPos = { ...newPos, x: borderBR }
        }
        if (targetY < 0) {
          newPos = { ...newPos, y: 0 }
        } else if (targetY > borderBR) {
          newPos = { ...newPos, y: borderBR }
        }

        setImages((prev) =>
          prev.map((image) => {
            if (image.id === id) {
              return {
                ...image,
                x: newPos.x,
                y: newPos.y,
              }
            }
            return image
          })
        )
      }
    },
    [imageSize]
  )
  const handleDragEnd: KonvaNodeEvents["onDragEnd"] = useCallback(
    (e) => {
      const id = e.target.id()
      setImages((prev) =>
        prev.map((image) => {
          if (image.id === id) {
            const targetX = e.target.x()
            const targetY = e.target.y()
            const borderBR = DEFAULT_CANVAS_SIZE - imageSize
            if (
              targetX > 0 &&
              targetX < borderBR &&
              targetY > 0 &&
              targetY < borderBR
            ) {
              return {
                ...image,
                x: targetX,
                y: targetY,
                isDragged: false,
              }
            }
          }
          return {
            ...image,
            isDragged: false,
          }
        })
      )
    },
    [imageSize]
  )
  const handleSelectRect = (r: number) => {
    setImageSize(r)
    setImages((prev) => prev.map((i) => ({ ...i, width: r, height: r })))
  }

  const handleSubmitCrop = (cropped: { url: string; crop: Area }) => {
    const xy = (DEFAULT_CANVAS_SIZE - imageSize) / 2
    const croppedImage: ImageProps = {
      id: Date.now().toString(16),
      alt: cropped.url,
      isDragged: false,
      x: xy,
      y: xy,
      width: imageSize,
      height: imageSize,
      ...cropped,
    }

    setImages((prev) => [...prev, croppedImage])
  }

  return (
    <div className="p-10 bg-base-100 text-base-content">
      <Stage width={DEFAULT_CANVAS_SIZE} height={DEFAULT_CANVAS_SIZE}>
        <AxisLayer rect={DEFAULT_CANVAS_SIZE} />
        <LabelLayer rect={DEFAULT_CANVAS_SIZE} />
        <Layer>
          {images.map((image) => (
            <URLImage
              {...image}
              key={image.id}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          ))}
        </Layer>
      </Stage>
      <div className="flex gap-2 justify-end">
        <button
          className="btn"
          onClick={() => handleSelectRect(DEFAULT_IMAGE_SIZE)}
        >
          S
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleSelectRect(DEFAULT_IMAGE_SIZE * 1.2)}
        >
          M
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => handleSelectRect(DEFAULT_IMAGE_SIZE * 1.4)}
        >
          L
        </button>
        <button
          className="btn btn-accent"
          onClick={() => handleSelectRect(DEFAULT_IMAGE_SIZE * 1.6)}
        >
          LL
        </button>
        <ImageCropper onSubmit={handleSubmitCrop} />
      </div>
    </div>
  )
}

export default Images
