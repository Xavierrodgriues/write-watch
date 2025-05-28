import { useEffect, useRef } from "react";

const YouTubePlayer = ({ videoId, onPlayerReady }) => {
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);

  useEffect(() => {
    // Check if API script is already loaded
    const loadYouTubeAPI = () => {
      return new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve(window.YT);
        } else {
          const script = document.createElement("script");
          script.src = "https://www.youtube.com/iframe_api";
          document.body.appendChild(script);
          window.onYouTubeIframeAPIReady = () => resolve(window.YT);
        }
      });
    };

    let player;

    loadYouTubeAPI().then((YT) => {
      // Destroy any existing player
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      player = new YT.Player(playerContainerRef.current, {
        videoId,
        events: {
          onReady: () => {
            playerRef.current = player;
            if (onPlayerReady) onPlayerReady(player);
          },
        },
      });
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  return (
    <div
      ref={playerContainerRef}
      className="w-full h-full"
    ></div>
  );
};

export default YouTubePlayer;
