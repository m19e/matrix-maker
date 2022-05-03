import { useCallback } from "react"
import type { VFC } from "react"
import { useDropzone } from "react-dropzone"

interface Props {
  onDrop: (url: string) => void
}

export const Dropzone: VFC<Props> = ({ onDrop }) => {
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
      className="grid place-items-center p-2 w-full max-w-xs h-32 card bg-base-200 rounded-box"
    >
      <div className="flex flex-col justify-center items-center w-full h-full text-sm font-black text-center border-2 border-gray-400 border-dashed sm:text-base text-primary-content rounded-box">
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
