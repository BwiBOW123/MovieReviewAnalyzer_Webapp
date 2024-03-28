import React from 'react'
import Image from 'next/image';

type Props = {
  image:string,
  w:number,
  h:number;
}
function ShowImage({image,w,h }: Props) { 
  return (
    <div className=''>
        <Image  src={image} width={w} height={h} alt='asdasd'/>
    </div>
   
  )
}

export default ShowImage