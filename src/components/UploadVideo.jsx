import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";

const UploadVideo = () => {
  const fileInputRef = useRef(null);
  const [videoName, setVideoName] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoName(file.name);
      setVideoURL(""); // Reset URL if file is selected
      console.log("Selected video file:", file);
    }
  };

  const handleURLChange = (event) => {
    setVideoURL(event.target.value);
    setVideoName(""); // Reset file name if URL is entered
  };

  const handleDone = () => {
    
    if(!videoName && !videoURL ){
      toast("Have you selected video or url ?", {
        progressClassName: "orange-progress"
      });

      return;
    }

    if(!isSignedIn){
      toast("Are you Signed In ?", {
        progressClassName: "orange-progress"
      });

      return;
    }

    navigate("/videoworkspace", {state: {video: videoName || videoURL}})

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gradient-to-br from-orange-100 to-white px-4">
      <div className="w-full max-w-2xl p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        {/* Upload from File */}
        <div
          onClick={handleClick}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-orange-300 rounded-xl cursor-pointer hover:border-orange-500 transition duration-300 ease-in-out"
        >
          <input
            type="file"
            accept="video/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-orange-500 mb-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19.5 12.75a.75.75 0 01.75.75v5.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h7.5a.75.75 0 010 1.5H6A.75.75 0 005.25 6v12.75c0 .414.336.75.75.75h12a.75.75 0 00.75-.75V13.5a.75.75 0 01.75-.75z" />
            <path d="M17.03 2.47a.75.75 0 011.06 0l3.44 3.44a.75.75 0 01-.53 1.28h-1.69v3a.75.75 0 01-1.5 0v-3h-1.69a.75.75 0 01-.53-1.28l3.44-3.44z" />
          </svg>
          <p className="text-lg font-semibold text-gray-700">
            Upload a Video File
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Drag & drop or{" "}
            <span className="text-orange-500 underline">click to browse</span>
          </p>
          {videoName && (
            <p className="mt-2 text-sm text-green-600">Selected: {videoName}</p>
          )}
        </div>

        {/* OR Separator */}
        <div className="relative my-6">
          <div className="border-t border-gray-300"></div>
          <span className="absolute inset-x-0 top-[-12px] text-center text-gray-500 bg-white px-3 text-sm">
            OR
          </span>
        </div>

        {/* Upload by URL */}
        <div className="mb-4">
          <label
            htmlFor="video-url"
            className="block text-gray-700 font-medium mb-1"
          >
            Paste Video URL
          </label>
          <input
            id="video-url"
            type="url"
            placeholder="https://example.com/video.mp4"
            value={videoURL}
            onChange={handleURLChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>

        {/* Done Button */}
        <button
          onClick={handleDone}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg mt-4 transition cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default UploadVideo;
