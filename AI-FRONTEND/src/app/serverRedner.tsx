
async function getData(id: string) {
    const res = await fetch(`http://127.0.0.1:8000/movies/${id}`, { cache: "no-cache" });
    return res.json();
  }
  async function getComment(id: string) {
    const res = await fetch(`http://127.0.0.1:8000/comment/${id}`, { cache: "no-cache" });
    return res.json();
  }
  async function getSentiment(id: string) {
    const res = await fetch(`http://127.0.0.1:8000/sentiment/${id}`, { cache: "no-cache" });
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