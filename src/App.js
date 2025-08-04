import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { ArrowDownUp, Search } from 'lucide-react';
import axios from 'axios';

function App() {
  const [userTableData, setUserTableData] = useState([]);
  const [isloading,setLoading] = useState(true)
  async function fetchUsers() {
    try {
      setLoading(true)
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users`);
      setUserTableData(response.data);
      setLoading(false)
    } catch (error) {
      console.error("Somthing went wrong", error);
      setLoading(false)
    }
  }
  const handleSort = () =>{ 
    
  }
  useEffect(() => {
    fetchUsers()
  }, [])
  return (
    <div className="App">
      <div className='container'>
          {isloading && <h3>Loading...</h3>}
        <div className='table-search'>
          <h2>Users Table</h2>
          <div className='search-wrap'><input type='text' className='seach-input' placeholder='search'/><Search /></div>
        </div>
        <div className='table-wrapper'>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("id")}>User Id <ArrowDownUp /></th>
                <th onClick={() => handleSort("name")}>Name <ArrowDownUp /></th>
                <th>Address</th>
                <th>Company Name</th>
              </tr>
            </thead>
            <tbody>
              {userTableData.length > 0 && (
                userTableData.map((user) => {
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
              )}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default App;
