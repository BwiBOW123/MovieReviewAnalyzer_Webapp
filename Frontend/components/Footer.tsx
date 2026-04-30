import React from 'react'
import './footer.css'
import Image from 'next/image';

type Props = {
  partName1 ?: string,
  partName2 ?: string,
  partName3 ?: string,
  detialPart1 ?: string,
  detialPart2 ?: string,
  detialPart3 ?: string,
  image : string
  w : number,
  h : number;
}
function Footer({image,w,h,partName1,partName2,partName3,detialPart1,detialPart2,detialPart3}: Props) { 
  return (
    <div className='container'>
      <Image  src={image} width={w} height={h} alt='asdasd'/>
        <ul  className={partName1}>{detialPart1}</ul>
        <ul  className={partName2}>{detialPart2}</ul>
        <ul  className={partName3}>{detialPart3}</ul>
    </div>
  )
}

export default Footer