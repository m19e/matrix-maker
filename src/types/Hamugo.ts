export type Hamugo = {
  word: string
  meaning: string
  hint: string
  example: string
  url: string
}

export interface HamugoProps {
  hamugo: Hamugo
}

export interface HamugoListProps {
  hamugos: Hamugo[]
}
