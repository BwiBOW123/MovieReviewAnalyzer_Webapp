import Image from "next/image"
import "./card.css"
import React from 'react'
import Link from "next/link"
import Tagbar from "./Tagbar"


interface MovieData{
  id : number
  m_name : string
  duration: number
  rating: number
  story: string
  Image: string
}
type Props = {
    image:string,
    link?:string,
    classNameCTN?:string,
    classNameC?:string,
    classNameTag?:string,
    w?:number,
    h?:number
}



const Card = ({image,classNameCTN,classNameC,classNameTag="",w = 350,h = 350,link="/"}:Props) => {

  return (
    <Link  className="Card" href={link}>
        <div className={classNameCTN}>
            <div className={classNameC}>
            <Image className="image" src={image} width={w} height={h} alt='...'/>
            </div>
        </div>
    </Link>
  )
}

export default Card