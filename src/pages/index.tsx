import Head from "next/head"
import type {
  NextPage,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next"
import { parse } from "next-useragent"

import { MatrixMaker } from "@/components/templates/MatrixMaker"

type Props = {
  isMobile: boolean
}

const Page: NextPage<Props> = ({ isMobile }) => {
  return (
    <>
      <Head>
        <title>Matrix Maker</title>
        <meta
          name="description"
          content="「Matrix Maker」は手軽に2軸マトリクス画像が作成できるサービスです。"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MatrixMaker isMobile={isMobile} />
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
