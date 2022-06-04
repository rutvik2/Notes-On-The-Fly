import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import About from './components/About';
import Alert from './components/Alert';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import NoteState from './context/notes/NoteState';
import { useState } from 'react';

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert=(message, type)=>{
    setAlert({message, type});
    setTimeout(() => {
      setAlert(null);      
    }, 1500);
  }

  return (
    <NoteState>
      <BrowserRouter>
        <Navbar />
        <Alert alert={alert}/>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home showAlert={showAlert}/>}></Route>
            <Route path="about" element={<About />}></Route>
            <Route path="/login" element={<Login showAlert={showAlert}/>}></Route>
            <Route path="/signup" element={<SignUp showAlert={showAlert}/>}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </NoteState>
  );
}

export default App;
