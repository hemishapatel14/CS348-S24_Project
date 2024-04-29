// import {BrowserRouter, Route, Routes} from 'react-router-dom'
// import { ToastContainer} from 'react-toastify';
//   import 'react-toastify/dist/ReactToastify.css';
// import './App.css';
// import Home from './components/Home';
// import AddEdit from './components/AddEdit';

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="App">
//         <ToastContainer position="top-center"/>
//         <Routes>
//           <Route exact path="/" element={<Home/>}/>
//           <Route path="/addExpense" element={<AddEdit/>}/>
//           <Route path="/updateExpense/:id" element={<AddEdit/>}/>
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Home from './components/Home';
import AddEdit from './components/AddEdit';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer position="top-center" />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/addExpense" element={<AddEdit />} />
          <Route path="/updateExpense/:id" element={<AddEdit />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
