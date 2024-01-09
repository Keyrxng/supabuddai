import React from "react"

import NoUserHero from "./NoUserHero"

type Props = {}

function HomeHero({}: Props) {
  return (
    <div className="m-12 flex flex-col items-center object-center align-middle gap-8">
      <NoUserHero />
    </div>
  )
}

export default HomeHero
