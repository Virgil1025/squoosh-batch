import "./App.css";
// import "./assets/css/dashboard.css";
// import "animate.css";
// import "react-image-lightbox/style.css";
import MainPage from "./features/main-page";
import Header from "./features/header";

function App() {
  return (
    <div className="main-page">
      <Header />
      <MainPage />
    </div>
  );
}

export default App;
