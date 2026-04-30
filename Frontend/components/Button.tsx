import React from 'react'
import './button.css'


type Props = {
  className : string
  , children : string;
}
function Button({className, children }: Props) {
  return (
    <button className={className}>{children}</button>
  )
}


export default Button

