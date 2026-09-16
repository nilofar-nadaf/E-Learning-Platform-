import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function VideoPlayer() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axiosInstance.get(`/student/video/${videoId}`);
        if (response.data.status === "success") {
          setVideo(response.data.data);
        } else {
          setError(response.data.error);
        }
      } catch (err) {
        setError("Unable to load video");
      }
    };
    fetchVideo();
  }, [videoId]);

  const getEmbedUrl = (youtubeUrl) => {
  const videoIdMatch = youtubeUrl.match(
    /(?:v=|\/)([0-9A-Za-z_-]{11})/
  );

  const id = videoIdMatch ? videoIdMatch[1] : null;

  return id
    ? `https://www.youtube.com/embed/${id}`
    : null;
};

  return (
    <div className="video-player-container">
      <button onClick={() => navigate(-1)}>← Back to Courses</button>

      {error && <p className="error">{error}</p>}

      {video && (
        <>
          <h1>{video.TITLE}</h1>
          <p>{video.DESCRIPTION}</p>

          <div className="video-frame">
            {getEmbedUrl(video.YOUTUBE_URL) ? (
              <iframe
                width="100%"
                height="480"
                src={getEmbedUrl(video.YOUTUBE_URL)}
                title={video.TITLE}
                allowFullScreen
              ></iframe>
            ) : (
              <p>Video unavailable — invalid URL.</p>
            )}
          </div>

          <p><strong>Added:</strong> {new Date(video.ADDED_AT).toLocaleString()}</p>
        </>
      )}
    </div>
  );
}

export default VideoPlayer;