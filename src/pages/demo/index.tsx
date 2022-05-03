import Head from "next/head"
import type {
  NextPage,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next"
import { parse } from "next-useragent"

import { useElementSize } from "@/hooks/useElementSize"

type Props = {
  isMobile: boolean
}

const Page: NextPage<Props> = ({ isMobile }) => {
  const [containerRef, { width, height }] = useElementSize({
    width: 0,
    height: 0,
  })
  const canvasSize = Math.min(width, height)
  const canvasStyle = isMobile
    ? { width: height, height }
    : { width: canvasSize, height: canvasSize }

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
        <div className="flex flex-col justify-center w-full h-full sm:w-11/12 sm:max-w-4xl">
          <div className="grid grid-cols-4 gap-2 p-2 w-full bg-yellow-300">
            <input
              type="text"
              placeholder="X軸左"
              className="max-w-xs bg-gray-200 input input-sm input-bordered"
            />
            <input
              type="text"
              placeholder="Y軸下"
              className="max-w-xs bg-gray-200 input input-sm input-bordered"
            />
            <input
              type="text"
              placeholder="Y軸上"
              className="max-w-xs bg-gray-200 input input-sm input-bordered"
            />
            <input
              type="text"
              placeholder="X軸左"
              className="max-w-xs bg-gray-200 input input-sm input-bordered"
            />
          </div>
          <div
            ref={containerRef}
            className="flex overflow-x-auto overflow-y-hidden flex-1 justify-center items-center w-full bg-teal-600"
          >
            <div
              className="flex justify-center items-center bg-white"
              style={canvasStyle}
            >
              <span className="text-2xl font-black">
                {width < height && isMobile
                  ? "canvas is larger than container."
                  : "canvas is here."}
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

export const getServerSideProps = ({
  req,
}: GetServerSidePropsContext): GetServerSidePropsResult<Props> => {
  const { isMobile } = parse(req.headers["user-agent"] ?? "")

  return {
    props: {
      isMobile,
    },
  }
}

export default Page
