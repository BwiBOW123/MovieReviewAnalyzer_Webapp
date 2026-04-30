
const DATA_API_BASE_URL = process.env.API_BASE_URL ?? 'http://127.0.0.1:5000';

async function getData(id: string) {
    const res = await fetch(`${DATA_API_BASE_URL}/movies/${id}`, { cache: "no-cache" });
    return res.json();
  }
  async function getComment(id: string) {
    const res = await fetch(`${DATA_API_BASE_URL}/comment/${id}`, { cache: "no-cache" });
    return res.json();
  }
  async function getSentiment(id: string) {
    const res = await fetch(`${DATA_API_BASE_URL}/sentiment/${id}`, { cache: "no-cache" });
    return res.json();
  }


  const ServerRender = async (id: string) => {
    try {
      const movie = await getData(id);
      const comment = await getComment(id);
      const sentiment = await getSentiment(id);
  
      return  [movie, comment, sentiment];
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // You might want to throw the error again to handle it at the calling site
    }
  };
  
  export default ServerRender;
