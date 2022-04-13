import { useState, useCallback, useEffect } from "react"
import type { VFC } from "react"
import { Stage, Layer, Image as KonvaImage, Line, Text } from "react-konva"
import type { KonvaNodeEvents } from "react-konva"
import useImage from "use-image"

import Cropper from "react-easy-crop"
import { Point, Area } from "react-easy-crop/types"

import { useDropzone } from "react-dropzone"

export type Status = "valid" | "invalid" | "progress"

const useValidateImageURL = (url: string): Status => {
  const [status, setStatus] = useState<Status>("progress")
  useEffect(() => {
    setStatus("progress")
    let hasChangedURL = false
    const image = new Image()
    image.src = url
    image.addEventListener("load", () => {
      if (!hasChangedURL) setStatus("valid")
    })
    image.addEventListener("error", () => {
      if (!hasChangedURL) setStatus("invalid")
    })
    return () => {
      hasChangedURL = false
    }
  }, [url])
  return status
}

const Dropzone = ({ onDrop }: { onDrop: (url: string) => void }) => {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return
      const files = acceptedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }))
      onDrop(files[0].url)
    },
    [onDrop]
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: ["image/*"],
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className="grid place-items-center p-2 w-full max-w-xs h-32 card bg-base-300 rounded-box"
    >
      <div className="flex flex-col justify-center items-center w-full h-full font-black text-center border-2 border-gray-400 border-dashed text-primary-content rounded-box">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <>
            <p>{"Drag 'n' Drop image file here,"}</p>
            <p>or click to select file</p>
          </>
        )}
      </div>
    </div>
  )
}

interface ImageProps extends Area {
  url: string
  id: string
  alt: string
  crop: Area
  isDragged: boolean
}

interface ImagePropsWithHandler extends ImageProps {
  onDragStart: KonvaNodeEvents["onDragStart"]
  onDragMove: KonvaNodeEvents["onDragMove"]
  onDragEnd: KonvaNodeEvents["onDragEnd"]
}

const DEFAULT_CANVAS_SIZE = 800
const DEFAULT_IMAGE_SIZE = DEFAULT_CANVAS_SIZE * 0.1

const URLImage: VFC<ImagePropsWithHandler> = ({ url, ...props }) => {
  const [image] = useImage(url)

  return <KonvaImage {...props} image={image} draggable _useStrictMode />
}

interface ImageCropperProps {
  onSubmit: ({ url, crop }: { url: string; crop: Area }) => void
}

const ImageCropper: VFC<ImageCropperProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [area, setArea] = useState<Area>({ x: 0, y: 0, width: 0, height: 0 })
  const [zoom, setZoom] = useState(1)

  const imageStatus = useValidateImageURL(urlInput)
  const validImage = imageStatus === "valid"
  const invalidImage = urlInput.trim() !== "" && imageStatus === "invalid"

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setArea(croppedAreaPixels)
    },
    []
  )
  const initCropper = () => {
    setUrlInput("")
    setUrl("")
    setCrop({ x: 0, y: 0 })
    setArea({ x: 0, y: 0, width: 0, height: 0 })
    setZoom(1)
  }
  const submitCrop = () => {
    onSubmit({ url, crop: area })
  }

  const handleSubmitUrlInput = () => {
    if (!validImage) return
    setUrl(urlInput)
  }

  return (
    <>
      <label
        htmlFor="my-modal"
        className="btn modal-button"
        onClick={initCropper}
      >
        ADD IMAGE
      </label>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div>
          <div className="flex flex-col items-center">
            <div className="w-96 shadow-xl card bg-base-200">
              {url ? (
                <figure className="p-8">
                  <div className="relative w-80 h-80">
                    <Cropper
                      image={url}
                      crop={crop}
                      zoom={zoom}
                      aspect={1 / 1}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                </figure>
              ) : (
                <div className="flex flex-col items-center pt-8">
                  <Dropzone onDrop={setUrl} />
                  <div className="divider">OR</div>
                  <div className="flex flex-row gap-2 w-full max-w-xs form-control">
                    <div className="w-full max-w-xs">
                      <input
                        type="text"
                        placeholder="Image URL"
                        className="w-full max-w-xs input input-bordered"
                        value={urlInput}
                        onChange={(e) => {
                          setUrlInput(e.currentTarget.value.trim())
                        }}
                      />
                      <label className="justify-end h-8 label">
                        {validImage && (
                          <span className="label-text-alt text-success">
                            Valid URL
                          </span>
                        )}
                        {invalidImage && (
                          <span className="label-text-alt text-error">
                            Invalid URL
                          </span>
                        )}
                      </label>
                    </div>

                    <div
                      className="btn btn-primary"
                      onClick={handleSubmitUrlInput}
                    >
                      set
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-action">
            {url && (
              <label
                htmlFor="my-modal"
                className="btn btn-primary"
                onClick={submitCrop}
              >
                crop
              </label>
            )}
            <label htmlFor="my-modal" className="btn">
              cancel
            </label>
          </div>
        </div>
      </div>
    </>
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

const INITIAL_STATE = generateShapes(500)

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
    <>
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
    </>
  )
}

export default Images
