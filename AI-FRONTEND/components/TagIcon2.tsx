import React from 'react'
import './tagbar.css'
import Image from 'next/image';

type Props = {
  className : string
  , children ?: string,
  image:string,
  w:number,
  h:number;
}
function TagIcon2({className, children,image,w,h}: Props) { 
  return (
    <div className='container-icon'>
        <div>
          <Image  src={image} width={w} height={h}alt='asdasd'/>
        </div>
        <div  className={className}>{children}</div>
    </div>
   
  )
}

export default TagIcon2