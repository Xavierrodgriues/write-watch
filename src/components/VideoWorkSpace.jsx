import AuthenticationButton from "./AuthenticationButton";
// import { useLocation } from "react-router";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import "react-reflex/styles.css";
import videoFile from '../assets/mf.mp4';


const VideoWorkSpace = () => {
  // const location = useLocation();
  // const videoName = location.state?.video;
  return (
    <div>
      <AuthenticationButton />
      <ReflexContainer orientation="vertical" style={{ height: "100vh" }}>
        <ReflexElement>
          <div className="w-full h-full bg-black flex items-center justify-center">
            <video
              src={videoFile}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
          
        </ReflexElement>

        <ReflexSplitter />

        <ReflexElement>
          {/* Right side: Rich Text Editor */}
          <div>Rich Editor</div>
        </ReflexElement>
      </ReflexContainer>

      {/* {videoName} */}
    </div>
  );
};

export default VideoWorkSpace;
