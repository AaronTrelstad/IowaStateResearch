import Main from './components/main/main'
import Datasets from './components/datasets/datasets';
import Publications from './components/publications/publications';
import Faculty from './components/faculty/faculty';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main />} />
        <Route path='/' element={<Main />}></Route> 
        <Route path='/datasests' element={<Datasets />}></Route>
        <Route path='/publications' element={<Publications />}></Route>
        <Route path='/faculty' element={<Faculty />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
