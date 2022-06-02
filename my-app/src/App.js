import logo from './logo.svg';
import './App.css';
import { Button, Input } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import { axiosRequest } from "./utils";

const { baseApiUrl } = require('./constants');
// projectId may change to geekSpeak
const projectId = 290;
const buildUri = (projectId) => `${baseApiUrl}/projects/${projectId}/repository/branches`;

function App() {
  const [branch, setBranch] = useState("");
  const [deletedbranch, setDeletedBranch] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [entries, setEntries] = useState("");

  const onChangeAdd = e => {
    console.log('Change:', e.target.value);
    setBranch(e.target.value);
  };

  const onChangeDelete = e => {
    console.log('Change:', e.target.value);
    setDeletedBranch(e.target.value);
  };

  const onChangeContent = e => {
    console.log('Change:', e.target.value);
    setContent(e.target.value);
  };

  const onChangeTarget = e => {
    console.log('Change:', e.target.value);
    setTarget(e.target.value);
  };

  const handleGetBranches = () => {
    axios({
      method: 'get',
      url: buildUri(projectId),
      headers: { 'Private-Token': "glpat-7fB58fLMLq9WfW22BxLu" },
    })
      .then((response) => {
        console.log(buildUri(projectId));
        console.log(process.env.gitlabApiToken);
        console.log(response)
      })
      .catch((error) => {
        console.log(buildUri(projectId));
        console.log(process.env.gitlabApiToken);
        console.log(error)
      })
  }

  const handleCreateBranches = () => {
    axios({
      method: 'post',
      url: "https://git.jostle.us/api/v4/projects/290/repository/branches",
      headers: {"PRIVATE-TOKEN": "glpat-7fB58fLMLq9WfW22BxLu" },
      json: true,
      params: {
        'branch': branch,
        'ref': "main"
      },
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(buildUri(projectId));
        console.log(branch);
        console.log(error)
      })
  }

  const handleDeleteBranches = () => {
    axios({
      method: 'delete',
      url: "https://git.jostle.us/api/v4/projects/290/repository/branches/" + deletedbranch,
      headers: {"PRIVATE-TOKEN": "glpat-7fB58fLMLq9WfW22BxLu" },
      json: true,
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(buildUri(projectId));
        console.log(branch);
        console.log(error)
      })
  }

  const handleCommit =()=> {
    axios({
      method: 'post',
      url: "https://git.jostle.us/api/v4/projects/290/repository/commits",
      headers: {"PRIVATE-TOKEN": "glpat-7fB58fLMLq9WfW22BxLu" },
      json: true,
      data: {
        "branch": branch,
        "commit_message": content,
        "actions": [{
          "action": "update",
          "file_path": "foo/bar",
          "content": content,
        }]
      }
    })
      .then((response) => {
        console.log(response)
      }) 
      .catch((error) => {
        console.log(content);
        console.log(branch);
        console.log(error)
      })
  }

    const handleMergeRequest =()=> {
        axios({
            method: 'post',
            url: "https://git.jostle.us/api/v4/projects/290/merge_requests",
            headers: {"PRIVATE-TOKEN": "glpat-7fB58fLMLq9WfW22BxLu" },
            json: true,
            data: {
                "source_branch": branch,
                "target_branch": "main",
                "title": "commit " + branch,
            }
        })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(content);
                console.log(branch);
                console.log(error)
            })
    }

    const handleConnectMysql =()=> {
      axios({
        method: 'get',
        url: "http://localhost:3090",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        }
      })
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const handleSearch =()=> {
      console.log(target);
      axios({
        method: 'post',
        url: "http://localhost:3090/doSearch",
        params: {searchTerm: target},
        data: {searchTerm: JSON.stringify(target)}
      })
        .then((response) => {
            console.log(response);
            console.log(response.data.data);
            setSearchResult([...response.data.data]);
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const displayData =()=> {
      return (
        searchResult.map(re => {return (<p key={re.id}>id: {re.id}, key: {re.key} value: {re.value}</p>)}));
    }

    const handleRepositoryFile =async()=> {
      const fileName =  "LocalizedStrings.properties";
      const pathToProperties = 'src/main/java/com/jostleme/jostle/ui/localization/' + fileName;
      const encodedPath = encodeURIComponent(pathToProperties);
      console.log(encodedPath);

      const data = {
        method: 'get',
        url: "https://git.jostle.us/api/v4/projects/102/repository/files/" + encodedPath + "/raw",
        headers: {"PRIVATE-TOKEN": "glpat-7fB58fLMLq9WfW22BxLu" },
        json: true,
        data: {
          ref: "develop"
        }
      }
      axios(data)
      .then((response) => {
        console.log(response);
        setEntries(response.data);
      })
      .catch((error) => {
          console.log(error)
      })
     
    }

  return (
    <div className="App">
      <h1> Test </h1>
      <Button type="primary" onClick={handleGetBranches}>get Branches</Button>
      <br />
      <br />
      <Input onChange={onChangeAdd} style={{ width: '20%' }} />
      <br />
      <br />
      <Button type="primary" onClick={handleCreateBranches}>Create Branch</Button>
      <br />
      <br />
      <Input onChange={onChangeDelete} style={{ width: '20%' }} />
      <br />
      <br />
      <Button type="primary" onClick={handleDeleteBranches}>Delete Branch</Button>
      <br />
      <br />
      <span>
        <Input onChange={onChangeContent} style={{ width: '30%', marginRight: '5%' }} />
        <Button type="primary" onClick={handleCommit} style={{marginRight: '5%'}}>Commit</Button>
        <Button type="primary" onClick={handleMergeRequest}>Merge Request</Button>
      </span>
      <br />
      <br />
      <Button type="primary" onClick={handleConnectMysql}>Connect Mysql</Button>
      <br />
      <br />
      <span>
        <Input onChange={onChangeTarget} style={{ width: '30%', marginRight: '5%' }} />
        <Button type="primary" onClick={handleSearch} style={{marginRight: '5%'}}>Search</Button>
      </span>
      {displayData()}
      <br />
      <br />
      <Button type="primary" onClick={handleRepositoryFile}>fetch file</Button>
      <p>{entries}</p>
    </div>
  );
}

export default App;
