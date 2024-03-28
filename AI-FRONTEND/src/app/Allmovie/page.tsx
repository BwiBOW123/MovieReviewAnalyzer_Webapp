
import "./style.css"
import Card2 from "../../../components/Card2"


async function getSentiment() {
  const res = await fetch(`http://127.0.0.1:8000/search_by_sort/sentiment/1/80`,{next:{revalidate:3000}})
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




export default function Home() {

  return (
    <>
      <h1 id="TRENDING">ALL MOVIE</h1>
      <div className='container-content'>
          {renderimage()}
      </div>
    </>
  )
}
