import "./App.css";
import { BrowserRouter, Routes } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { Toaster } from "react-hot-toast";
import useUserRoutes from "./components/routes/UserRoutes";
import useAdminRoutes from "./components/routes/AdminRoutes";

function App() {
  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes();

  return (
    <BrowserRouter>
      <div className="App">
        <Toaster position="top-center" />
        <Header />
        <div>
          <Routes>
            {userRoutes}
            {adminRoutes}
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
