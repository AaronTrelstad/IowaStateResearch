import Main from './main/main'
import Datasets from './datasets/datasets';
import Publications from './publications/publications';
import Faculty from './faculty/faculty';

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
