import React, { useState, createContext, useContext } from "react";
const CountContext = createContext(0);

const Example = () => {
    const [count, setCount] = useState(0);
    return (
        <div>
            <p>父组件点击数量：{count}</p>
            <button onClick={() => setCount(count + 1)}>{"点击+1"}</button>
            <CountContext.Provider value={count}>
                <Counter />
            </CountContext.Provider>
        </div>
    );
};

const Counter = () => {
    const count = useContext(CountContext);
    return <p>子组件获得的点击数量：{count}</p>;
};

export default Example;