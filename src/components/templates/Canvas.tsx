import { useState, useRef } from "react"
import type { VFC, ChangeEvent } from "react"
import { Stage, Layer, Line, Text, Star, Image } from "react-konva"
import type { KonvaNodeEvents } from "react-konva"
import type { Stage as KonvaStage } from "konva/lib/Stage"
import type { Vector2d } from "konva/lib/types"
import useImage from "use-image"

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
            {/* Matrix Base */}
            <Line points={[30, 250, 470, 250]} stroke={"gray"} />
            <Line points={[250, 30, 250, 470]} stroke={"gray"} />

            {/* Martix Contents */}
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

            {Array.from({ length: 5 }, (_, i) => "0" + i).map((id) => (
              <LionImage key={id} id={id} />
            ))}

            {/* Matrix Label */}
            <Text
              text="縦軸上"
              x={0}
              y={8}
              width={500}
              align={"center"}
              fontSize={16}
            />
            <Text
              text="縦軸下"
              x={0}
              y={476}
              width={500}
              align={"center"}
              fontSize={16}
            />
            <Text
              text="横軸右"
              x={476}
              y={0}
              height={500}
              width={16}
              verticalAlign={"middle"}
              fontSize={16}
            />
            <Text
              text="横軸左"
              x={8}
              y={0}
              height={500}
              width={16}
              verticalAlign={"middle"}
              fontSize={16}
            />
          </Layer>
        </Stage>
        <Stars />
      </div>
    </div>
  )
}

const LionImage = ({ id }: { id: string }) => {
  const [image] = useImage("https://konvajs.org/assets/lion.png")
  return (
    <Image
      id={id}
      image={image}
      alt="Lion"
      draggable
      onClick={(e) => {
        console.log("clicked id:", e.target.id())
      }}
    />
  )
}

function generateShapes() {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * 500,
    y: Math.random() * 500,
    rotation: Math.random() * 180,
    isDragging: false,
  }))
}

const INITIAL_STATE = generateShapes()

const Stars = () => {
  const [stars, setStars] = useState(INITIAL_STATE)

  const handleDragStart: KonvaNodeEvents["onDragStart"] = (e) => {
    const id = e.target.id()
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: star.id === id,
        }
      })
    )
  }
  const handleDragEnd: KonvaNodeEvents["onDragEnd"] = (e) => {
    const id = e.target.id()
    setStars(
      stars.map((star) => {
        if (star.id === id) {
          return {
            ...star,
            x: e.target.x(),
            y: e.target.y(),
            isDragging: false,
          }
        }
        return {
          ...star,
          isDragging: false,
        }
      })
    )
  }

  return (
    <Stage width={500} height={500}>
      <Layer>
        <Text text="Try to drag a star" />
        {stars.map((star) => (
          <Star
            key={star.id}
            id={star.id}
            x={star.x}
            y={star.y}
            numPoints={5}
            innerRadius={20}
            outerRadius={40}
            fill="#89b717"
            opacity={0.8}
            draggable
            rotation={star.rotation}
            shadowColor="black"
            shadowBlur={10}
            shadowOpacity={0.6}
            shadowOffsetX={star.isDragging ? 10 : 5}
            shadowOffsetY={star.isDragging ? 10 : 5}
            scaleX={star.isDragging ? 1.2 : 1}
            scaleY={star.isDragging ? 1.2 : 1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Layer>
    </Stage>
  )
}

export default Canvas
