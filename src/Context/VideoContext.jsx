import { createContext, useContext, useState } from "react"

const VideoContext = createContext();
export const useVideo = () => useContext(VideoContext);

const VideoProvider = ({children}) => {
    const [videoName, setVideoName] = useState(null);
    const [videoURL, setVideoURL] = useState("");
    
    const clearVideo = () => {
        setVideoName(null);
        setVideoURL("");
    };
    
    return (
        <VideoContext.Provider value={{
            videoName,
            setVideoName,
            videoURL,
            setVideoURL,
            clearVideo
        }}>
            {children}
        </VideoContext.Provider>
    )
}

export default VideoProvider;