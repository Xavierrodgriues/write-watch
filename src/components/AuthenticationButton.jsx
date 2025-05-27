import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { useVideo } from "../Context/VideoContext";

const AuthenticationButton = () => {
  const navigate = useNavigate();
  const {setVideoName} = useVideo();
  return (
    <div className="flex flex-col sm:flex-row items-center h-16 justify-between p-4 sm:px-8 bg-white shadow-md">
      {/* Logo Container */}
      <div onClick={() => { setVideoName(null);navigate("/")}} className="w-full hover:cursor-pointer sm:w-1/4 mb-4 sm:mb-0 flex justify-center sm:justify-start">
        <img
          src="https://cdn.shopify.com/s/files/1/0558/6413/1764/files/Orange_Logo_Design_2_1024x1024.webp?v=1739886004"
          alt="Logo"
          className="max-h-12 sm:max-h-16 object-contain"
        />
      </div>

      {/* Authentication Buttons */}
      <header className="flex w-full sm:w-auto justify-center sm:justify-end gap-4">
        <SignedOut>
          <SignInButton
            style={{ background: "#FF9B45" }}
            className="text-white rounded-md py-2 px-6 cursor-pointer active:scale-90 transition-transform"
          >
            Sign In
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    </div>
  );
};

export default AuthenticationButton;
