import Head from "next/head"
import type { NextPage } from "next"

import { MatrixMaker } from "@/components/templates/MatrixMaker"

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

      <MatrixMaker />
    </>
  )
}

export default Page
