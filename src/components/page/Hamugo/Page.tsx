import Head from "next/head"

import { HamugoPageView } from "@/components/page/Hamugo/View"

import type { NextPage } from "next"

export const HamugoPage: NextPage = () => {
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

      <HamugoPageView />
    </>
  )
}
