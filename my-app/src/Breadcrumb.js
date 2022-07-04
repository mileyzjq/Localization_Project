import { Breadcrumb } from 'antd';
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import "./Breadcrumb.css";
import './App.css';
import React from "react";
import Home from "./Home";
import Update from "./Update";
import MergeRequest from "./MergeRequest";

const Apps = () => (
    <ul className="app-list">
        <li>
            <Link to="/update">Next</Link>
        </li>
        <li>
            <Link to="/update/merge">Merge Request</Link>
        </li>
    </ul>
);

const breadcrumbNameMap = {
    '/update': 'Update',
    '/update/merge': 'Merge Request',
};

const Navigation = () => {
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        console.log(url);
        return (
            <Breadcrumb.Item key={url} className={{fontcolor: 'blue'}}>
                <Link to={url}>{breadcrumbNameMap[url]}</Link>
            </Breadcrumb.Item>
        );
    });

    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            <Link to="/">Home</Link>
        </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems);

    return (
        <div className="demo">
            <div className="App">
                <h1> Geek Speak </h1>
            </div>
            <div className="demo-nav">
                <Breadcrumb>{breadcrumbItems}</Breadcrumb>
            </div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/update" element={<Update />} />
                <Route path="/update/merge" element={<MergeRequest />} />
            </Routes>
        </div>
    );
};

const Cpp = () => (
    <HashRouter>
        <Navigation />
    </HashRouter>
);

export default Cpp;
