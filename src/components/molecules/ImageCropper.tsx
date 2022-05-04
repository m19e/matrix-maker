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

  const handleInitialize = useCallback(() => {
    setUrl("")
    setUrlInput("")
    setCrop({ x: 0, y: 0 })
    setArea({ x: 0, y: 0, width: 0, height: 0 })
    setZoom(1)
  }, [])
  const handleCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setArea(croppedAreaPixels)
  }, [])
  const handleSubmitUrlInput = useCallback(() => {
    if (!validImage) return
    setUrl(urlInput)
  }, [validImage, urlInput])
  const handleSubmitCrop = useCallback(() => {
    onSubmit({ url, crop: area })
  }, [onSubmit, url, area])

  return (
    <>
      <label
        htmlFor="cropper-modal"
        className="btn modal-button btn-sm sm:btn-md"
        onClick={handleInitialize}
      >
        add image
      </label>
      <input type="checkbox" id="cropper-modal" className="modal-toggle" />
      <div className="items-center modal">
        <div className="w-11/12 max-w-md">
          <div className="flex flex-col items-center">
            {url ? (
              <div className="p-4 w-full shadow-xl sm:p-8 card bg-base-100">
                <div className="relative w-full h-96 bg-white sm:w-96">
                  <Cropper
                    image={url}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 1}
                    zoomSpeed={1 / 3}
                    maxZoom={5}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                  />
                </div>
              </div>
            ) : (
              <div className="w-5/6 shadow-xl sm:w-96 card bg-base-100">
                <div className="flex flex-col items-center px-4 pt-8 sm:px-8">
                  <Dropzone onDrop={setUrl} />
                  <div className="divider">OR</div>
                  <div className="flex flex-col w-full">
                    <div className="inline-flex w-full">
                      <input
                        type="text"
                        placeholder="Image URL"
                        className="flex-1 min-w-0 placeholder:text-gray-600 rounded-r-none input input-bordered input-sm sm:input-md"
                        value={urlInput}
                        onChange={(e) => {
                          setUrlInput(e.currentTarget.value.trim())
                        }}
                      />
                      <button
                        className="rounded-l-none btn btn-primary btn-sm sm:btn-md"
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
          {url ? (
            <div className="mt-2 modal-action">
              <label
                htmlFor="cropper-modal"
                className="btn btn-primary btn-sm sm:btn-md"
                onClick={handleSubmitCrop}
              >
                crop
              </label>
              <label htmlFor="cropper-modal" className="btn btn-sm sm:btn-md">
                cancel
              </label>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <div className="mt-2 w-5/6 sm:w-96 modal-action">
                <label htmlFor="cropper-modal" className="btn btn-sm sm:btn-md">
                  cancel
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
