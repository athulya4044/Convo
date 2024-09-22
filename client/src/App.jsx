import { Routes, Route } from "react-router-dom";
import Test from "./pages/index";

const App = () => {
  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center">
      <Routes>
        <Route path="/" element={<Test />}></Route>
      </Routes>
    </div>
  );
};

export default App;
