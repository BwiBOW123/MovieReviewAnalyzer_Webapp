import Image from "next/image"
import "./card.css"
import React from 'react'
import Link from "next/link"
import Tagbar from "./Tagbar"
import TagIcon from "./TagIcon"


function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
      return `${remainingMinutes} m`;
  }

  if (remainingMinutes === 0) {
      return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} m`;
}


type Props = {
    Data:any,
    link?:string,
    classNameCTN?:string,
    classNameC?:string,
    classNameTag?:string,
    w?:number,
    h?:number,
}

const Card2 = ({Data,classNameCTN,classNameC,w = 350,h = 350,link="/"}:Props) => {
  const base64String = Data['Image'];
  const Tag:[] = Data['Tag']
  const decodedImage = atob(base64String);
  return (
    <Link id={Data['id'].toString()} className="Card" href={`/movie-info/${Data['id']}`}>
        <div id={Data['id'].toString()} className={classNameCTN}>
            <div id={Data['id'].toString()} className={classNameC}>
            <Image className="image" src={`data:image/jpeg;base64,${decodedImage}`} width={w} height={h} alt="Image in Card"/>
            </div>
            <div className="time">
              <Tagbar className="Tagtime">{formatTime(Data['duration'])}</Tagbar>
              <Tagbar className='tagRating' >{Data['sentiment']+'%   ⯭'}</Tagbar>
            </div>
            <div className="Rating-display">
              
            </div>
            <div className="info">
              <div className="Tag">
                {Tag.map(data=> (<><Tagbar className="tagCategory back-color-red">{data}</Tagbar></>) )}

              </div >
              <span className="Rating-display">
                <p>{Data['m_name']}</p>
                <TagIcon image="/star.png" w={50} h={50} marginL={2} className='' >{Data['rating']+''}</TagIcon>
              </span>
              
            </div>
        </div>
    </Link>
  )
}

export default Card2