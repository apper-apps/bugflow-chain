import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import BoardView from "@/components/pages/BoardView";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<BoardView />} />
            <Route path="board" element={<BoardView />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </BrowserRouter>
  );
}

export default App;