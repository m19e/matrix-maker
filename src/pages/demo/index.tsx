import Head from "next/head"
import type { NextPage } from "next"

const Page: NextPage = () => {
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
        <div className="flex flex-col justify-center w-11/12 h-full sm:max-w-3xl">
          <div className="w-full h-16 bg-yellow-300"></div>
          <div className="pb-full w-full bg-teal-600"></div>
          <div className="w-full h-16 bg-yellow-300"></div>
        </div>
      </div>
    </>
  )
}

export default Page
