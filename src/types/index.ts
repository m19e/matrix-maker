import type { KonvaNodeEvents } from "react-konva"
import type { Area } from "react-easy-crop/types"

export interface ImageProps extends Area {
  url: string
  id: string
  alt: string
  crop: Area
  isDragged: boolean
  isSelected: boolean
}

export interface ImagePropsWithHandler extends ImageProps {
  onDragStart: KonvaNodeEvents["onDragStart"]
  onDragMove: KonvaNodeEvents["onDragMove"]
  onDragEnd: KonvaNodeEvents["onDragEnd"]
  onDelete: (id: string) => void
}
