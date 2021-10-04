import React, { useEffect } from 'react'
import { setAccessToken } from './accessToken';
import { Routes } from './Routes';


export const App: React.FC = ({}) => {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/refresh_token", {
      method: 'POST',
      credentials: "include"
    }).then(async x=>{
      const {accessToken} = await x.json();
      setAccessToken(accessToken);
      setLoading(false);
      });
    }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (<Routes />);
}