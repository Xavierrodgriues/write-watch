import { Route, Routes } from "react-router";
import WriteWatch from "./WriteWatch";
import VideoWorkSpace from "./components/VideoWorkSpace";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
        <Routes>
          <Route path="/" element={<WriteWatch />} />
          <Route path="/videoworkspace" element={<VideoWorkSpace />}/>
        </Routes>
        
        <ToastContainer
        position="top-center" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" 
      />
    </>

    
  )
}

export default App;