
import "./home.css"
import "./globals.css"

import Card2 from '../../components/Card2';



async function getData(c_name:string) {
  const res = await fetch(`http://127.0.0.1:8000/Category/${c_name}/4`,{next:{revalidate:3000}})
  const data = res.json()
  return data
}
async function getSentiment() {
  const res = await fetch(`http://127.0.0.1:8000/search_by_sort/sentiment/1/8`,{next:{revalidate:3000}})
  const data = res.json()
  return data
}
async function getSentimentLOW() {
  const res = await fetch(`http://127.0.0.1:8000/search_by_sort/sentiment/0/8`,{next:{revalidate:3000}})
  const data = res.json()
  return data
}
async function getDataRating() {
  const res = await fetch(`http://127.0.0.1:8000/Rating/4`,{next:{revalidate:3000}})
  const data = res.json()
  return data
}

async function renderimage() {
  const data = await getSentiment();
  const realData:[] = await data['data']
      return await realData.map((d) => (
      <>  
          <Card2 Data={d[0]} classNameCTN="container-card2" classNameC="container-image2" w={266} h={344}/>
      </>
  ));
}
async function renderimage2() {
  const data = await getSentimentLOW();
  const realData:[] = await data['data']
      return await realData.map((d) => (
      <>  
          <Card2 Data={d[0]} classNameCTN="container-card2" classNameC="container-image2" w={266} h={344}/>
      </>
  ));
}



export default function Home() {

  return (
    <>
      <h1 id="TRENDING">SENTIMENT POSITIVE HIGH</h1>
      <div className='container-content'>
          {renderimage()}
      </div>
      <h1 id="TRENDING">SENTIMENT POSITIVE LOW</h1>
      <div className='container-content'>
          {renderimage2()}
      </div>
    </>
  )
}
