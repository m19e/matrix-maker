import Head from "next/head"

import { HamugoPageView } from "@/components/page/Hamugo/View"

import type { NextPage } from "next"

export const HamugoPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>ハムごまとめ</title>
        <meta
          name="description"
          content="ハムごを見やすくまとめて検索できるようにしたものです"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HamugoPageView />
    </>
  )
}
