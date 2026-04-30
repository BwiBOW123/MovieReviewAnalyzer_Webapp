import React from 'react'
import './tagbar.css'


type Props = {
  className : string
  , children : string
}

function Tagbar({className, children }: Props) {
  return (
    <div  className={className}>{children}</div>
  )
}

export default Tagbar

