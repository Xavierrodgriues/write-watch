import { createContext, useContext, useState } from "react"


const VideoContext = createContext();
export const useVideo = () => useContext(VideoContext);

const VideoProvider = ({children}) => {
    const [videoName, setVideoName] = useState(null);
    return (
        <VideoContext.Provider value={{videoName, setVideoName}}>
            {children}
        </VideoContext.Provider>
    )
}

export default VideoProvider;