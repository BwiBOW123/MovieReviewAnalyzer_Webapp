import React from 'react'
import './tagbar.css'
import Image from 'next/image';

type Props = {
  className : string
  , children ?: string,
  image:string,
  w:number,
  h:number,
  marginL:number;
}
function TagImage({className, children,image,w,h,marginL}: Props) { 
  return (
    <div className='container-iconTagbar'>
        <p  className={className}>{children}</p>
        <Image  src={image} width={w} height={h} alt='asdasd'/>
    </div>
   
  )
}

export default TagImage