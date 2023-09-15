import React, { useContext, useEffect, useState } from "react";
import styles from "./Search.module.scss";
import { UserContext } from "components/App/App";
import FollowRecom from "components/Follow/FollowRecom/FollowRecom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "fbase";
import Follow from "components/Follow/Follow";

const Search = () => {
  const { user, setUser, userConnections, setUserConnections } =
    useContext(UserContext);
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [allData, setAllData] = useState([]);
  const onChange = (event) => {
    setSearchText(event.target.value);
  };
  useEffect(() => {
    const searchSnapshot = async () => {
      const allDocs = await getDocs(
        query(collection(db, "users"), where("userId", "!=", user.userId))
      );
      const searchDocs = allDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllData(searchDocs);
    };
    searchSnapshot();
  }, []);

  useEffect(() => {
    if (searchText) {
      const searchInName = allData.filter((doc) =>
        doc.userName.includes(searchText)
      );
      const searchInEmail = allData.filter((doc) =>
        doc.userEmail.includes(searchText)
      );
      const filteredArr = [...searchInEmail, ...searchInName].filter(
        (ele, idx, arr) => arr.indexOf(ele) === idx
      );
      setSearchResult(filteredArr);
    } else {
      setSearchResult([]);
    }
  }, [searchText]);
  return (
    <div className={styles["inner-container"]}>
      <div className={styles["search-form"]}>
        <input
          type="text"
          placeholder="search"
          value={searchText}
          onChange={onChange}
        />
      </div>
      <div className={styles["result-form"]}>
        {searchResult?.map((user, idx) => (
          <Follow key={idx} user={user} searchText={searchText} />
        ))}
        <FollowRecom />
      </div>
    </div>
  );
};

export default Search;
