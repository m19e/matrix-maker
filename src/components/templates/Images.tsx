import { useState, useCallback, useRef } from "react"
import type { VFC, RefObject, ChangeEvent } from "react"
import { Stage, Layer, Rect, Line, Text } from "react-konva"
import type { KonvaNodeEvents } from "react-konva"
import type Konva from "konva"
import type { Area } from "react-easy-crop/types"

import { ImageProps } from "@/types"
import { useElementSize } from "@/hooks/useElementSize"
import { ImageCropper } from "@/components/molecules/ImageCropper"
import { URLImage } from "@/components/atoms/URLImage"

const URLS = [
  "https://poplinks.idolmaster-official.jp/images/idol/y3xf3qyq/img_thumb.png",
  "https://poplinks.idolmaster-official.jp/images/idol/ahfrudkf/img_thumb.png",
  "https://poplinks.idolmaster-official.jp/images/idol/qq21osxs/img_thumb.png",
  "https://poplinks.idolmaster-official.jp/images/idol/fjtgwau6/img_thumb.png",
  "https://poplinks.idolmaster-official.jp/images/idol/s7mg8tvk/img_thumb.png",
]

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

interface Label {
  left: string
  bottom: string
  top: string
  right: string
}

const LabelLayer: VFC<{ rect: number; label: Label }> = ({ rect, label }) => {
  const fontSize = rect * 0.03
  const paddingTL = fontSize / 4
  const paddingBR = rect - fontSize - paddingTL

  return (
    <Layer>
      <Text
        text={label.left}
        x={paddingTL}
        y={0}
        height={rect}
        width={fontSize}
        verticalAlign={"middle"}
        fontSize={fontSize}
      />
      <Text
        text={label.bottom}
        x={0}
        y={paddingBR}
        width={rect}
        align={"center"}
        fontSize={fontSize}
      />
      <Text
        text={label.top}
        x={0}
        y={paddingTL}
        width={rect}
        align={"center"}
        fontSize={fontSize}
      />
      <Text
        text={label.right}
        x={paddingBR}
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
  const [rangeValue, setRangeValue] = useState(1)
  const [label, setLabel] = useState<Label>({
    left: "Ｘ軸左",
    bottom: "Ｙ軸下",
    top: "Ｙ軸下",
    right: "Ｘ軸右",
  })

  const [containerRef, { width, height }] = useElementSize({
    width: DEFAULT_CANVAS_SIZE,
    height: DEFAULT_CANVAS_SIZE,
  })

  const [canvasRef, canvasAction] = useCanvas()

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

  const handleChangeRangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setRangeValue(e.currentTarget.valueAsNumber)
    handleSelectRect(e.currentTarget.valueAsNumber * DEFAULT_IMAGE_SIZE)
  }

  const stageRect = Math.min(width, height)
  const scale = stageRect / DEFAULT_CANVAS_SIZE

  return (
    <div className="flex justify-center bg-base-300">
      <div
        className="flex flex-col justify-center items-center w-11/12 h-screen sm:max-w-3xl bg-base-100 text-base-content"
        ref={containerRef}
      >
        <div className="grid grid-cols-4 gap-2 p-4 w-full">
          <input
            type="text"
            placeholder="Type here"
            className="max-w-xs bg-gray-200 input input-bordered"
            value={label.left}
            onChange={(e) => {
              setLabel((prev) => ({
                ...prev,
                left: e.target.value.trim(),
              }))
            }}
          />
          <input
            type="text"
            placeholder="Type here"
            className="max-w-xs bg-gray-200 input input-bordered"
            value={label.bottom}
            onChange={(e) => {
              setLabel((prev) => ({
                ...prev,
                bottom: e.target.value.trim(),
              }))
            }}
          />
          <input
            type="text"
            placeholder="Type here"
            className="max-w-xs bg-gray-200 input input-bordered"
            value={label.top}
            onChange={(e) => {
              setLabel((prev) => ({
                ...prev,
                top: e.target.value.trim(),
              }))
            }}
          />
          <input
            type="text"
            placeholder="Type here"
            className="max-w-xs bg-gray-200 input input-bordered"
            value={label.right}
            onChange={(e) => {
              setLabel((prev) => ({
                ...prev,
                right: e.target.value.trim(),
              }))
            }}
          />
        </div>
        <Stage
          ref={canvasRef}
          width={stageRect}
          height={stageRect}
          scaleX={scale}
          scaleY={scale}
          className=""
        >
          <AxisLayer rect={DEFAULT_CANVAS_SIZE} />
          <LabelLayer rect={DEFAULT_CANVAS_SIZE} label={label} />
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
        <div className="flex gap-6 items-center p-4 w-full sm:gap-8 sm:items-end">
          <ImageCropper onSubmit={handleSubmitCrop} />
          <div className="flex flex-col flex-1 items-center">
            <input
              type="range"
              min="1"
              max="2"
              className="range range-xs sm:range-md"
              step="0.2"
              value={rangeValue}
              onChange={handleChangeRangeValue}
            />
            <div className="hidden justify-between px-2 w-full text-xs sm:flex">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
          </div>
          <button className="btn btn-sm sm:btn-md" onClick={canvasAction.save}>
            download png
          </button>
        </div>
      </div>
    </div>
  )
}

export default Images
