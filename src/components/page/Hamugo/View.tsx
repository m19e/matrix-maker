import { VFC, useState, useEffect, ChangeEventHandler } from "react"

import { Hamugo } from "@/types/Hamugo"

import { HamugoList } from "@/components/model/Hamugo/HamugoList"

import { Spacer } from "@/components/ui/Spacer"

import { HAMUGO_LIST } from "@/consts"

const NavBar: VFC<{ onChange: ChangeEventHandler<HTMLInputElement> }> = ({
  onChange,
}) => {
  return (
    <div className="max-w-md rounded-md shadow-xl lg:max-w-4xl 2xl:max-w-7xl navbar bg-base-200">
      <div className="flex-1">
        <a className="text-2xl font-black normal-case text-primary zen-maru-gothic text-shadow btn btn-ghost">
          ハムごまとめ
        </a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="検索"
            className="w-32 sm:w-full input input-bordered"
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  )
}

export const HamugoPageView: VFC = () => {
  const [query, setQuery] = useState("")
  const [filteredHamugos, setFilteredHamugos] = useState<Hamugo[]>([])

  useEffect(() => {
    const f = HAMUGO_LIST.filter(
      (h) => h.word.includes(query) || h.meaning.includes(query)
    )
    setFilteredHamugos(f)
  }, [query])

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value)
  }

  const hamugos = filteredHamugos.length ? filteredHamugos : HAMUGO_LIST

  return (
    <main className="flex flex-col items-center p-4 min-h-screen bg-hamugo">
      <NavBar onChange={handleChange} />
      <Spacer size={8} />
      <HamugoList hamugos={hamugos} />
      <Spacer size={8} />
    </main>
  )
}
