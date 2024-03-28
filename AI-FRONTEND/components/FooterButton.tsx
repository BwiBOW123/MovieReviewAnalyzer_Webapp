import React from 'react'
import './footerbutton.css'

type Props = {
  partName1 ?: string,
  partName2 ?: string,
  partName3 ?: string,
  partName4 ?: string,
  detialPart1 ?: string,
  detialPart2 ?: string,
  detialPart3 ?: string,
  detialPart4 ?: string;
}
function FooterButton({partName1,partName2,partName3,partName4,detialPart1,detialPart2,detialPart3,detialPart4}: Props) { 
  return (
    <div className='container-fButton'>
        <ul  className={partName1}>{detialPart1}</ul>
        <ul><button className={partName2}>{detialPart2}</button></ul>
        <ul><button className={partName3}>{detialPart3}</button></ul>
        <ul><button className={partName4}>{detialPart4}</button></ul>
    </div>
  )
}

export default FooterButton