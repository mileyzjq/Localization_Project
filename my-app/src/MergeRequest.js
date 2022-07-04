import './App.css';
import {Button, Input, Select} from 'antd';
import React, {useState, useMemo} from 'react';
import axios from 'axios';
import {axiosRequest} from "./utils";

const {baseApiUrl, localizationFolderPath} = require('./constants');

const monolithId = 102;
const buildBase = (projectId) => `${baseApiUrl}/projects/${projectId}/`;
const buildUri = (projectId) => `${buildBase(projectId)}/repository/`;

function MergeRequest() {
    const [branch, setBranch] = useState("");
    const [MRLink, setMRLink] =  useState("");
    const remoteBranch = sessionStorage.getItem("sourceBranch");

    const onChangeAdd = e => {
        console.log('Change:', e.target.value);
        setBranch(e.target.value);
    };

    const handleCreateBranches = async () => {
        await axios({
            method: 'post',
            url: buildUri(monolithId) + "branches",
            headers: {"PRIVATE-TOKEN": "glpat-7fB58fLMLq9WfW22BxLu"},
            json: true,
            params: {
                'branch': branch,
                'ref': remoteBranch
            },
        })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleUpdatedContent = async () => {
        let res = await axios.get("/newFiles");
        console.log(res);
        return res.data;
    }

    const handleCommit = async () => {
        const content = await handleUpdatedContent();
        const fileName = "LocalizedStrings.properties";
        const pathToProperties = 'src/main/java/com/jostleme/jostle/ui/localization/' + fileName;
        await axios({
            method: 'post',
            url: buildUri(monolithId) + "commits",
            headers: {"PRIVATE-TOKEN": "glpat-7fB58fLMLq9WfW22BxLu"},
            json: true,
            data: {
                "branch": branch,
                "commit_message": branch + "-" + "update value",
                "actions": [{
                    "action": "update",
                    "file_path": pathToProperties,
                    "content": content,
                }]
            }
        })
            .then((response) => {
                console.log(content);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleMergeRequest = async () => {
        await handleCreateBranches();
        await handleCommit();
        console.log(remoteBranch);
        await axios({
            method: 'post',
            url: buildBase(monolithId) + "merge_requests",
            headers: {"PRIVATE-TOKEN": "glpat-7fB58fLMLq9WfW22BxLu"},
            json: true,
            data: {
                "source_branch": branch,
                "target_branch": remoteBranch,
                "title": "commit " + branch,
            }
        })
            .then((response) => {
                console.log(response);
                console.log(response.data.web_url);
                setMRLink(response.data.web_url);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const displayLink =()=> {
        return (<a href={MRLink}> {MRLink} </a>);
    }

    return (
        <div className="App">
            <br/>
            <br/>
            <span>
                <Input onChange={onChangeAdd} placeholder="New Branch" style={{width: 400, marginRight: 20}}/>
                <Button type="primary" onClick={handleMergeRequest}>Merge Request</Button>
            </span>
            <br/>
            {displayLink()}
        </div>
    );
}

export default MergeRequest;
