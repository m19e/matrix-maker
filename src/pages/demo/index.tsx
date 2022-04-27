import Head from "next/head"
import type { NextPage } from "next"

import { useElementSize } from "@/hooks/useElementSize"

const Page: NextPage = () => {
  const [containerRef, { width, height }] = useElementSize({
    width: 0,
    height: 0,
  })
  const canvasSize = window.innerWidth < 640 ? Math.max(width, height) : height

  return (
    <>
      <Head>
        <title>Next & daisyUI</title>
        <meta
          name="description"
          content="A template for prototyping with Next.js and daisy UI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-center w-screen h-screen">
        <div className="flex flex-col justify-center w-11/12 h-full sm:max-w-4xl">
          <div className="grid grid-cols-4 gap-2 p-2 w-full bg-yellow-300">
            <input
              type="text"
              placeholder="X軸左"
              className="max-w-xs bg-gray-200 input input-sm input-bordered sm:input-md"
            />
            <input
              type="text"
              placeholder="Y軸下"
              className="max-w-xs bg-gray-200 input input-sm input-bordered sm:input-md"
            />
            <input
              type="text"
              placeholder="Y軸上"
              className="max-w-xs bg-gray-200 input input-sm input-bordered sm:input-md"
            />
            <input
              type="text"
              placeholder="X軸左"
              className="max-w-xs bg-gray-200 input input-sm input-bordered sm:input-md"
            />
          </div>

          <div
            ref={containerRef}
            className="flex overflow-x-auto overflow-y-hidden flex-1 justify-center items-center w-full bg-teal-600"
          >
            <div
              className="flex justify-center items-center bg-white"
              style={{ minWidth: height, height: height }}
            >
              <span className="text-2xl font-black">
                {width > height
                  ? "canvas is here."
                  : "canvas is larger than container."}
              </span>
            </div>
          </div>
          <div className="flex gap-6 items-center p-4 w-full bg-yellow-300 sm:gap-8 sm:items-end">
            <button className="btn btn-sm sm:btn-md">add image</button>
            <div className="flex flex-col flex-1 items-center">
              <input
                type="range"
                min="1"
                max="2"
                className="range range-xs sm:range-md"
                step="0.2"
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
            <button className="btn btn-sm sm:btn-md">download</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
