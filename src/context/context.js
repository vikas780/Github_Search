import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repo, setRepos] = useState(mockRepos);
  const [Followers, setFollowers] = useState(mockFollowers);
  const [request, setRequest] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => {
    checkError();
    setLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;
      //Repos

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repo, followers] = results;
          const status = "fulfilled";
          if (repo.status === status) {
            setRepos(repo.value.data);
          }

          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
        .catch((err) => console.log(err));
      //https://api.github.com/users/john-smilga/repos?per_page=100
      //https://api.github.com/users/john-smilga/followers
    } else {
      checkError(true, "There is no such user present with that name");
    }
    checkRequest();
    setLoading(false);
  };

  const checkRequest = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;

        setRequest(remaining);
        if (remaining === 0) {
          {
            checkError(true, "sorry you have exceeded your request's limit!");
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const checkError = (show = false, msg = "") => {
    setError({ show, msg });
  };

  useEffect(checkRequest, []);
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repo,
        Followers,
        request,
        error,
        loading,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
