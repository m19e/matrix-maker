import { useState, useRef } from "react"
import type { VFC, ChangeEvent } from "react"
import { Stage, Layer, Line, Text } from "react-konva"
import type { KonvaNodeEvents } from "react-konva"
import type { Stage as KonvaStage } from "konva/lib/Stage"
import type { Vector2d } from "konva/lib/types"

interface LineProps {
  tool: "pen" | "eraser"
  points: number[]
  color: string
}

const getMousePosition = (stage: KonvaStage | null): Vector2d | null => {
  if (!stage) return null
  const pos = stage.getPointerPosition()
  if (!pos) return null
  return pos
}

const Canvas: VFC = () => {
  const [tool, setTool] = useState<"pen" | "eraser">("pen")
  const [lines, setLines] = useState<LineProps[]>([])
  const isDrawing = useRef(false)

  const handleMouseDown: KonvaNodeEvents["onMouseDown"] = (e) => {
    isDrawing.current = true

    const pos = getMousePosition(e.target.getStage())
    if (!pos) return

    setLines([...lines, { tool, color: "red", points: [pos.x, pos.y] }])
  }

  const handleMouseMove: KonvaNodeEvents["onMouseMove"] = (e) => {
    if (!isDrawing.current) return

    const pos = getMousePosition(e.target.getStage())
    if (!pos) return

    const lastLine = lines.slice(-1)[0]
    const newPoints = lastLine.points.concat([pos.x, pos.y])
    const newLastLine: LineProps = { ...lastLine, points: newPoints }
    setLines((prev) => [...prev.slice(0, -1), newLastLine])
  }

  const handleMouseUp = () => {
    isDrawing.current = false
  }

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value
    if (selected !== "pen" && selected !== "eraser") return
    setTool(selected)
  }

  return (
    <div>
      <select value={tool} onChange={handleSelectChange}>
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
      <div className="bg-base-300">
        <Stage
          width={500}
          height={500}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            <Text text="Just start drawing" x={5} y={5} />
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.tool === "eraser" ? 20 : 5}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default Canvas
