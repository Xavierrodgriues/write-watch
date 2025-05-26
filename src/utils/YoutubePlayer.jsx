import { useEffect, useRef } from "react";

const YouTubePlayer = ({ videoId, onPlayerReady }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId,
        events: {
          onReady: () => {
            if (onPlayerReady) onPlayerReady(playerRef.current);
          },
        },
      });
    };
  }, [videoId]);

  return <div id="yt-player" className="w-full h-full"></div>;
};

export default YouTubePlayer;
