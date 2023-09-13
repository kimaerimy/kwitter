import React, { useContext, useEffect, useState } from "react";
import styles from "./Search.module.scss";
import { UserContext } from "components/App/App";
import FollowRecom from "components/Follow/FollowRecom/FollowRecom";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "fbase";

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
      const allDocs = await getDocs(query(collection(db, "users")));
      const searchDocs = allDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllData(searchDocs);
    };
    searchSnapshot();
  }, []);

  useEffect(() => {
    console.log("searchText called");
    if (searchText) {
      //allData
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
        {/* <div className={styles["search-input"]}><input type="text" placeholder="search" /></div> */}
        {/* <div className={styles["search-button"]}><SearchIcon /></div> */}
      </div>
      <div className={styles["result-form"]}>{searchResult}</div>
      <FollowRecom />
    </div>
  );
};

export default Search;
