import React from 'react';
import { Button, Input } from 'antd';
import './App.css';

function App() {

  return (
    <div className="App">
      <Input showCount maxLength={20}/>
      <Button type="primary"> Create Branch </Button>
    </div>
  );
}

export default App;
