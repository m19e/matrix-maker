import { useState, useCallback } from "react"
import type { VFC } from "react"
import Cropper from "react-easy-crop"
import type { Area, Point } from "react-easy-crop/types"

import { Dropzone } from "./Dropzone"
import { useValidateImageURL } from "@/hooks/useValidateImageURL"

interface Props {
  onSubmit: ({ url, crop }: { url: string; crop: Area }) => void
}

export const ImageCropper: VFC<Props> = ({ onSubmit }) => {
  const [url, setUrl] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [area, setArea] = useState<Area>({ x: 0, y: 0, width: 0, height: 0 })
  const [zoom, setZoom] = useState(1)

  const imageStatus = useValidateImageURL(urlInput)
  const validImage = imageStatus === "valid"
  const invalidImage = urlInput.trim() !== "" && imageStatus === "invalid"

  const handleCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setArea(croppedAreaPixels)
  }, [])
  const handleInitialize = () => {
    setUrl("")
    setUrlInput("")
    setCrop({ x: 0, y: 0 })
    setArea({ x: 0, y: 0, width: 0, height: 0 })
    setZoom(1)
  }
  const handleSubmitUrlInput = () => {
    if (!validImage) return
    setUrl(urlInput)
  }
  const handleSubmitCrop = () => {
    onSubmit({ url, crop: area })
  }

  return (
    <>
      <label
        htmlFor="cropper-modal"
        className="btn modal-button btn-sm sm:btn-md"
        onClick={handleInitialize}
      >
        ADD IMAGE
      </label>
      <input type="checkbox" id="cropper-modal" className="modal-toggle" />
      <div className="items-center modal">
        <div>
          <div className="flex flex-col items-center">
            {url ? (
              <div className="p-8 w-full shadow-xl card bg-base-100">
                <div className="relative w-96 h-96 bg-white">
                  <Cropper
                    image={url}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 1}
                    onCropChange={setCrop}
                    onCropComplete={handleCropComplete}
                    onZoomChange={setZoom}
                    maxZoom={5}
                  />
                </div>
              </div>
            ) : (
              <div className="w-96 shadow-xl card bg-base-100">
                <div className="flex flex-col items-center px-8 pt-8">
                  <Dropzone onDrop={setUrl} />
                  <div className="divider">OR</div>
                  <div className="flex flex-col w-full max-w-xs form-control">
                    <div className="w-full max-w-xs input-group">
                      <input
                        type="text"
                        placeholder="Image URL"
                        className="w-full max-w-xs input input-bordered"
                        value={urlInput}
                        onChange={(e) => {
                          setUrlInput(e.currentTarget.value.trim())
                        }}
                      />

                      <button
                        className="btn btn-primary"
                        onClick={handleSubmitUrlInput}
                      >
                        load
                      </button>
                    </div>
                    <label className="h-8">
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
                </div>
              </div>
            )}
          </div>
          <div className="mt-2 modal-action">
            {url && (
              <label
                htmlFor="cropper-modal"
                className="btn btn-primary"
                onClick={handleSubmitCrop}
              >
                crop
              </label>
            )}
            <label htmlFor="cropper-modal" className="btn">
              cancel
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
