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
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <link
          rel="icon alternate"
          type="image/png"
          href="https://twemoji.maxcdn.com/v/14.0.2/72x72/1f4a0.png"
        />
        <title>Matrix Maker</title>
        <meta
          name="description"
          content="「Matrix Maker」は手軽に2軸マトリクス画像が作成できるサービスです。"
        />
        <meta property="og:site_name" content="Matrix Maker" />
        <meta property="og:title" content="Matrix Maker" />
        <meta
          property="og:description"
          content="「Matrix Maker」は手軽に2軸マトリクス画像が作成できるサービスです。"
        />
        <meta
          property="og:image"
          content="https://twemoji.maxcdn.com/v/14.0.2/72x72/1f4a0.png"
        />
        <meta property="og:type" content="website" />
        <meta property="twitter:title" content="Matrix Maker" />
        <meta
          property="twitter:description"
          content="「Matrix Maker」は手軽に2軸マトリクス画像が作成できるサービスです。"
        />
        <meta
          property="twitter:image"
          content="https://twemoji.maxcdn.com/v/14.0.2/72x72/1f4a0.png"
        />
        <meta property="twitter:url" content="" />
        <meta property="twitter:card" content="summary" />
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
