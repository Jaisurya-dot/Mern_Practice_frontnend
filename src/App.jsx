import React from 'react'
import Table from './components/table/Table'
import { Route, Routes } from 'react-router-dom'
import Login from './components/login/Login'
 
 

const App = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/table' element={<Table/>}/>
        </Routes>
    </div>
  )
}

export default App
