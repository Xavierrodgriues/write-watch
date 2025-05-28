import AuthenticationButton from "./AuthenticationButton";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import "react-reflex/styles.css";
import { useVideo } from "../Context/VideoContext";
import { useEffect, useState } from "react";
import YouTubePlayer from "../utils/YoutubePlayer";
import RichTextEditor from "./RichTextEditor";
// import videoFile from '../assets/mf.mp4';

const VideoWorkSpace = () => {

  const {videoName, videoURL} = useVideo();

  const [player, setPlayer] = useState();

  const extractYouTubeID = (url) => {
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
  }

  return (
    <div>
      <AuthenticationButton />
      <ReflexContainer orientation="vertical" style={{ height: "100vh" }}>
        <ReflexElement>
          <div className="w-full h-full bg-black flex items-center justify-center">
            {videoName ? (
              <video
                src={URL.createObjectURL(videoName)}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : videoURL ? (
              <YouTubePlayer
          videoId={extractYouTubeID(videoURL)}
          onPlayerReady={(p) => setPlayer(p)}
        />
            ) : (
              <p className="text-white">No video Selected</p>
            )}
          </div>
        </ReflexElement>

        <ReflexSplitter />

        <ReflexElement>
          {/* Right side: Rich Text Editor */}
          <RichTextEditor />
        </ReflexElement>
      </ReflexContainer>

    </div>
  );
};

export default VideoWorkSpace;
