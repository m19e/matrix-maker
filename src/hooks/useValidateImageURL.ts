import { useEffect, useState } from "react"

type Status = "valid" | "invalid" | "progress"

export const useValidateImageURL = (url: string): Status => {
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
