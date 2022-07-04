import { Select } from 'antd';

import axios from 'axios';
import qs from 'qs';
import { useState, useEffect } from 'react';
import './App.css';
const { Option } = Select;
let timeout;
let currentValue;

const fetch = (value, callback) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }

  currentValue = value;

  const fake = () => {
    const str = qs.stringify({
      code: 'utf-8',
      q: value,
    });
    axios.get(`https://suggest.taobao.com/sug?${str}`)
      .then((response) => response.json())
      .then((d) => {
        if (currentValue === value) {
          const { result } = d;
          const data = result.map((item) => ({
            value: item[0],
            text: item[0],
          }));
          callback(data);
        }
      });
  };

  timeout = setTimeout(fake, 300);
};

export const SearchInput = (props) => {
  const {update} = props;
  const [data, setData] = useState([]);
  const [value, setValue] = useState();

  const handleSearch = (newValue) => {
    if (newValue) {
      fetch(newValue, setData);
      //setInput(newValue);
      update(newValue);
    } else {
      setData([]);
    }
  };

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const options = data.map((d) => <Option key={d.value}>{d.text}</Option>);
  return (
    <Select
      showSearch
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      notFoundContent={null}
      {...props}
    >
      {options}
    </Select>
  );
};

const Bpp = () => {
  const [value, setValue] = useState([]);
  useEffect(() => {
    const list = ['red', 'blue', 'green'];
    sessionStorage.setItem('colors', list);
    console.log(list);
  }, []);


  const handleChange = (newValue) => {
    setValue(newValue);
    console.log(newValue);
    const list = sessionStorage.getItem('colors');
    console.log(list);
  };


  const handleClick =()=> {
    const list = sessionStorage.getItem('colors');
    console.log([list]);
  }

  const update =(newValue)=> {
    setValue(newValue);
    console.log(newValue);
  }
  return (
    <div>
      <SearchInput
        placeholder="input search text"
        value={value}
        style={{
          width: 200,
        }}
        update={update}
        onChange={update}
    />
    <button onClick={handleClick}>storage</button>
  </div>
  );
}
  

export default Bpp;

