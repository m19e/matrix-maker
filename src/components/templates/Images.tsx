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

const useCanvas = (): [
  RefObject<Konva.Stage>,
  { save: (size: number) => void }
] => {
  const canvasRef = useRef<Konva.Stage>(null)

  const downloadURI = (uri: string, name: string) => {
    const link = document.createElement("a")
    link.download = name
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const save = (size: number) => {
    const pixelRatio = DEFAULT_CANVAS_SIZE / size
    const uri = canvasRef.current?.toDataURL({ pixelRatio })
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

type Props = {
  isMobile: boolean
}

const Images: VFC<Props> = ({ isMobile }) => {
  const [images, setImages] = useState<ImageProps[]>([])
  const [imageSize, setImageSize] = useState(DEFAULT_IMAGE_SIZE * 2)
  const [rangeValue, setRangeValue] = useState(2)
  const [label, setLabel] = useState<Label>({
    left: "",
    bottom: "",
    top: "",
    right: "",
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
          isSelected: false,
        }
      })
    )
  }
  const handleDragMove: Exclude<KonvaNodeEvents["onDragMove"], undefined> =
    useCallback(
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
  const handleDragEnd: Exclude<KonvaNodeEvents["onDragEnd"], undefined> =
    useCallback(
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
  const handleSubmitCrop = (cropped: { url: string; crop: Area }) => {
    const xy = (DEFAULT_CANVAS_SIZE - imageSize) / 2
    const croppedImage: ImageProps = {
      id: Date.now().toString(16),
      alt: cropped.url,
      isDragged: false,
      isSelected: false,
      x: xy,
      y: xy,
      width: imageSize,
      height: imageSize,
      ...cropped,
    }

    setImages((prev) => [...prev, croppedImage])
  }
  const handleChangeImageSize = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const valueAsNumber = +e.currentTarget.value
    setRangeValue(valueAsNumber)
    const r = valueAsNumber * DEFAULT_IMAGE_SIZE
    setImageSize(r)
    setImages((prev) => prev.map((i) => ({ ...i, width: r, height: r })))
  }
  const handleDeleteImage = (id: string) => {
    setImages((prev) => prev.filter((i) => i.id !== id))
  }
  const handleSelectImage = (id: string) => {
    setImages((prev) =>
      prev.map((image) => ({ ...image, isSelected: image.id === id }))
    )
  }
  const handleDownload = useCallback(async () => {
    setImages((prev) => prev.map((image) => ({ ...image, isSelected: false })))
    await new Promise((resolve) => setTimeout(resolve, 100))
    canvasAction.save(Math.min(width, height))
  }, [canvasAction, width, height])

  const canvasSize = Math.min(width, height)
  const canvasScale = canvasSize / DEFAULT_CANVAS_SIZE

  return (
    <div className="flex justify-center w-screen h-screen bg-base-300">
      <div className="flex flex-col w-full h-full sm:gap-6 sm:w-11/12 sm:max-w-4xl text-base-content">
        <div className="grid grid-cols-4 gap-2 p-2 w-full sm:rounded-b-lg bg-base-100">
          <input
            type="text"
            placeholder="LEFT"
            className="max-w-xs text-xs bg-white input input-sm input-bordered sm:input-md"
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
            placeholder="BOTTOM"
            className="max-w-xs text-xs bg-white input input-sm input-bordered sm:input-md"
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
            placeholder="TOP"
            className="max-w-xs text-xs bg-white input input-sm input-bordered sm:input-md"
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
            placeholder="RIGHT"
            className="max-w-xs text-xs bg-white input input-sm input-bordered sm:input-md"
            value={label.right}
            onChange={(e) => {
              setLabel((prev) => ({
                ...prev,
                right: e.target.value.trim(),
              }))
            }}
          />
        </div>
        <div
          className="flex overflow-hidden flex-col flex-1 justify-center items-center w-full"
          ref={containerRef}
        >
          <Stage
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            scaleX={canvasScale}
            scaleY={canvasScale}
            className="overflow-hidden sm:rounded-2xl"
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
                  onSelect={handleSelectImage}
                  onDelete={handleDeleteImage}
                  isMobile={isMobile}
                />
              ))}
            </Layer>
          </Stage>
        </div>
        {isMobile ? (
          <div className="flex gap-2 items-center p-2 w-full bg-base-100">
            <ImageCropper onSubmit={handleSubmitCrop} />

            <select
              className="flex-1 max-w-xs select-sm select select-bordered"
              onChange={handleChangeImageSize}
            >
              <option disabled selected>
                IMAGE SIZE
              </option>
              {["XS", "S", "M", "L", "LL", "3L"]
                .map((size, i) => ({ size, value: 1 + i * 0.2 }))
                .map((v) => (
                  <option key={v.size} value={v.value}>
                    SIZE: {v.size}
                  </option>
                ))}
            </select>
            <button className="btn btn-sm sm:btn-md" onClick={handleDownload}>
              download
            </button>
          </div>
        ) : (
          <div className="flex gap-6 items-center p-2 w-full sm:gap-8 sm:items-end sm:rounded-t-lg bg-base-100">
            <ImageCropper onSubmit={handleSubmitCrop} />
            <div className="flex flex-col flex-1 items-center">
              <input
                type="range"
                min={1}
                max={2}
                className="range range-xs sm:range-md"
                step={0.2}
                value={rangeValue}
                onChange={handleChangeImageSize}
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
            <button className="btn btn-sm sm:btn-md" onClick={handleDownload}>
              download
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Images
