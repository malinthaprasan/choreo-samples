// src/App.js
import React, { useState, useEffect } from 'react';

function App() {
  const [showList, setShowList] = useState(false);
  const [data, setData] = useState([]);
  const [pvValue, setPvValue] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const getAccessToken = async () => {
    try {
      const response = await fetch(
        'https://sts.choreo.dev/oauth2/token',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Basic aWRNNTk1OU1lNllGSjdJSHNEWWZyRzNmYWt3YTpCSUVNR3lReDl6YVBEeHVENVM4c3VFWnJPWVFh',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials',
        }
      );
      const jsonData = await response.json();
      setAccessToken(jsonData.access_token);
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  const toggleList = async () => {
    setShowList(!showList);
    if (!showList) {
      try {
        const response = await fetch(
          'https://bf5745e0-bd1a-4374-9aae-aeb681a4ba54-dev.e1-us-east-azure.choreoapis.dev/cxny/solar-energy/solar-energy-769/1.0.0/generation-stats',
          {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
          }
        );
        const jsonData = await response.json();
        console.log(jsonData);
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

    const handleAddValue = async () => {
    if (!isNaN(pvValue) && pvValue !== '') {
      try {
        const response = await fetch(
          'https://bf5745e0-bd1a-4374-9aae-aeb681a4ba54-dev.e1-us-east-azure.choreoapis.dev/cxny/solar-energy/solar-energy-769/1.0.0/generation-stats',
          {
            method: 'POST',
            headers: {
              'accept': 'text/plain',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              pv: pvValue,
            }),
          }
        );
        if (response.ok) {
          // API call successful, update the list
          toggleList();
        } else {
          console.error('Error adding value: ', response.statusText);
        }
      } catch (error) {
        console.error('Error adding value: ', error);
      }
      setPvValue('');
    }
  };

  useEffect(() => {
    getAccessToken();
  }, []);
  
  return (
    <div>
      <h1>Welcome to My Simple React App</h1>
      <p>This is a basic React app.</p>

      <button onClick={toggleList}>List</button>
      {showList && (
        <ul>
          {
            data.map((item) => (
            <li key={item._id.timestamp}>PV: {item.pv}</li>
          ))}
        </ul>
      )}

    <input
        type="text"
        value={pvValue}
        onChange={(e) => setPvValue(e.target.value)}
        placeholder="Enter numeric value"
      />
      <button onClick={handleAddValue}>Add</button>
    </div>
  );
}


export default App;