'use client';
import { useEffect,useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '../../../../components/Card3';
import Tagbar from '../../../../components/Tagbar';
import Button from '../../../../components/Button';
import DoughnutChart from '../../../../components/Chart/DoughnutChart';
import LineChart from '../../../../components/Chart/LineChart';
import Card2 from '../../../../components/Card2';
import CommentForm from '../../../../components/CommentForm';
import CommentList from '../../../../components/CommentList';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import TagIcon2 from '../../../../components/TagIcon2';
import TagIcon from '../../../../components/TagIcon';
import "./info.css";

interface SentimentObj{
  cmt_id:number
  Positive:number
  Negative:number
}

async function getData(id: string) {
  const res = await fetch(`http://127.0.0.1:8000/movies/${id}`,{next:{revalidate:3000}});
  return res.json();
}
async function getComment(id: string) {
  const res = await fetch(`http://127.0.0.1:8000/comment/${id}`, {next:{revalidate:3000}});
  return res.json();
}
async function getSentiment(id: string) {
  const res = await fetch(`http://127.0.0.1:8000/sentiment/${id}`, {next:{revalidate:3000}});
  return res.json();
}

const User = () => {
  const params = useParams();
  const id = params.id;

  const [commentsClient, setCommentsClient] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (commentText: string) => {
  
    addCommentClient(commentText);
  
    const formData = new FormData();
    const formData2 = new FormData();
    const jsonData = { cmt_text: commentText, m_id: id };
    const jsonData2 = { text: commentText,m_id: id};

    formData.append('cmt_data', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));
    formData2.append('file', new Blob([JSON.stringify(jsonData2)], { type: 'application/json' }));
  
    try {
      const response = await fetch('http://127.0.0.1:8000/comment', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        console.log('Comment created successfully');
      } else {
        console.error('Failed to create comment');
      }
      const response2 = await fetch('http://127.0.0.1:8001/predict', {
        method: 'POST',
        body: formData2,
      });
      if (response2.ok) {
        console.log('Ai created successfully');
      } else {
        console.error('Failed to create comment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addCommentClient = (comment: string) => {
    setCommentsClient([comment, ...commentsClient]);
  };

  const [comments, setComments] = useState([]);
  const [timeat, setTimeat] = useState([]);
  const [userData, setUserData] = useState(null);
  const [sentiment, setSentiment] = useState<SentimentObj>({
    cmt_id: 0,
    Positive: 0,
    Negative: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData(id.toString());
      setUserData(data['data'][0]);

      const datacmt = await getComment(id.toString());
      const Allcomment:[] = datacmt['data'];
      setComments(Allcomment.map((d)=>d['cmt_text']))
      setTimeat(Allcomment.map((d)=>d['create_at']))

      const datasen = await getSentiment(id.toString());
      const sampleData = {
        cmt_id: datasen['data'][0]['m_id'],
        Positive: datasen['data'][0]['positive'], 
        Negative: datasen['data'][0]['negative'],
      };
      setSentiment(sampleData)
    };

    fetchData();
  }, [id]);

  if (!userData || !comments) {
    return <div>Loading...</div>;
  }

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

  let ReadData = userData
  const base64String = ReadData['Image']; const decodedImage = atob(base64String); const ShowImage = `data:image/jpeg;base64,${decodedImage}`
  let AllTag:[] = ReadData['Tag']
  let time = ReadData['duration']

  const start:[] = ReadData['actor']
  const writers:[] = ReadData['writers']
  const yearRelease = ReadData['yearRelease']
  const director = ReadData['director']
  return (
    <>
  <div className='container'>
    <div className='back-image'>
      <Image style={{filter: "blur(3px) brightness(40%)",}} src={"/image2.png"} width={1980} height={1060} alt='Background'/>
    </div>
    <div className='card-single'>
      <Card image={ShowImage}  w={315} h={426} />
      <p >{ReadData['m_name']}</p>
    </div>
    <div className='info-content'>
          
          <div className='info'>
            <TagIcon2 image='/time.png' className='tagTime' w={20} h={20}>{formatTime(time)}</TagIcon2>
            <TagIcon2 image='/calendar.png' className='tagDate' w={20} h={15}>{yearRelease}</TagIcon2>
            <TagIcon2 image='/rating2.png' className='tagRating2' w={25} h={15}>{ReadData['sentiment']+'%'}</TagIcon2>
          </div>
          <div className='tag'>
            {AllTag.map(data=> (<><Tagbar className="tagCategory back-color-white">{data}</Tagbar></>) )}
          </div>

          <div className='tag'>
            <p className='text-info'>Start</p>
          </div>
          <div className='tag'>
            <p className='text-narmal'>{start.map((d=>d+" , "))}</p>
          </div>

          <div className='tag'>
            <p className='text-info'>Writers</p>
          </div>
          <div className='tag'>
            <p className='text-narmal'>{writers.map((d=>d+" , "))}</p>
          </div>
          
          <div className='tag'>
            <p className='text-info'>Director</p>
          </div>
          <div className='tag'>
            <p className='text-narmal'>{director}</p>
          </div>
          <div className='tag'>
            <p className='text-info'>Story</p>
          </div >
          <div className='tag'>
          <p className='text-story'>{ReadData['story']}</p>
          </div>
    </div>

   

    <div className='doughnut-container'>
        <div className='Chart1'>
          <DoughnutChart Data={sentiment} width={300} height={300}/>
          <div className='posNag-info'>
            <span className='NumPositive'><p>{sentiment.Positive}</p><p>Positive</p></span>
            <span className='NumNagative'><p>{sentiment.Negative}</p><p>Negative</p></span>
          </div>
        </div>
    </div>
    
    <div className='coment-nakub'>
      <CommentForm onSubmit={handleSubmit} />
      <div className='comment-list'>
        <CommentList comments={comments} timeAt={timeat} />
        <CommentList comments={commentsClient} timeAt={timeat} />
      </div>
    </div>
    
  </div>
    </>)
};



export default User;