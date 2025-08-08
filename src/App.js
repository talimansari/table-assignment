import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp, Search } from "lucide-react";
import axios from "axios";
import { debounce } from "./utils/debounce";

function App() {
  const [userTableData, setUserTableData] = useState([]);
  const [sortObj, setSortObj] = useState({ key: "id", direction: "asc" });
  const [debouncedInput, setDebouncedInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isloading, setLoading] = useState(true);
  // Fetch users Data from APi
  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users`
      );
      setUserTableData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Somthing went wrong", error);
      setLoading(false);
    }
  }

  // Debounce effect with useMemo
  const debounceSearch = useMemo(
    () =>
      debounce((val) => {
        setDebouncedInput(val);
      }, 500),
    []
  );

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchInput(value);
    debounceSearch(value);
  };

  const handleSort = (key) => {
    setSortObj((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };
  // Search and Sort Function implementd
  const filtredSortedData = useMemo(() => {
    let filtredData = userTableData.filter(
      (user) =>
        user.name.toLowerCase().includes(debouncedInput.toLowerCase()) ||
        user.id.toString().includes(debouncedInput)
    );
    return filtredData.sort((a, b) => {
      const aValue = a[sortObj.key];
      const bValue = b[sortObj.key];
      if (aValue < bValue) return sortObj.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortObj.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [debouncedInput, sortObj, userTableData]);

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isloading) {
    return (
      <div className="container">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container">
        <div className="table-search">
          <h2>Users Table</h2>
          <div className="search-wrap">
            <input
              value={searchInput}
              id="search"
              onChange={handleSearch}
              type="text"
              className="seach-input"
              placeholder="search"
            />
            <Search />
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("id")}>
                  User Id <ArrowDownUp style={{ cursor: "pointer" }} />
                </th>
                <th onClick={() => handleSort("name")}>
                  Name <ArrowDownUp style={{ cursor: "pointer" }} />
                </th>
                <th>Address</th>
                <th>Company Name</th>
              </tr>
            </thead>
            <tbody>
              {filtredSortedData.length > 0 ? (
                filtredSortedData.map((user) => {
                  const { id, address, company, name } = user;
                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{name}</td>
                      <td>
                        City: {address.city}
                        <br />
                        ZipCode: {address.zipcode}
                      </td>
                      <td>{company.name}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
