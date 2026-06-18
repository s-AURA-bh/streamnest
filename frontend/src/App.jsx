import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get("https://streamnest-hdup.onrender.com/api/videos")
      .then((res) => setVideos(res.data.items))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
        padding: "30px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>🎬 StreamNest</h1>

      {videos.map((video) => (
        <div
          key={video.id}
          style={{
            maxWidth: "800px",
            margin: "40px auto",
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <img
            src={video.thumbnail_url}
            alt={video.title}
            style={{
              width: "100%",
              borderRadius: "10px",
            }}
          />

          <h2>{video.title}</h2>
          <p>{video.description}</p>

          <video
            controls
            width="100%"
            src={video.video_url}
            poster={video.thumbnail_url}
          />
        </div>
      ))}
    </div>
  );
}
