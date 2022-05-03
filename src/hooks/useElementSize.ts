import { useCallback, useState } from "react"

import { useEventListener } from "./useEventListener"
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect"
import { useDebounce } from "./useDebounce"

interface Size {
  width: number
  height: number
}

export const useElementSize = <T extends HTMLElement = HTMLDivElement>(
  initialSize: Size
): [(node: T | null) => void, Size] => {
  // Mutable values like 'ref.current' aren't valid dependencies
  // because mutating them doesn't re-render the component.
  // Instead, we use a state as a ref to be reactive.
  const [rawRef, setRef] = useState<T | null>(null)
  const [size, setSize] = useState<Size>(initialSize)
  const ref = useDebounce(rawRef, 500)

  // Prevent too many rendering using useCallback
  const handleSize = useCallback(() => {
    setSize({
      width: ref?.offsetWidth || initialSize.width,
      height: ref?.offsetHeight || initialSize.height,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.offsetHeight, ref?.offsetWidth])

  useEventListener("resize", handleSize)

  useIsomorphicLayoutEffect(() => {
    handleSize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.offsetHeight, ref?.offsetWidth])

  return [setRef, size]
}
