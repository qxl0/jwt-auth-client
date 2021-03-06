import React from 'react'
import { Link } from 'react-router-dom';
import { useUsersQuery } from '../generated/graphql';

interface HomeProps {

}

export const Home: React.FC<HomeProps> = ({}) => {
  const {data,error} = useUsersQuery({ fetchPolicy: 'network-only' }); // maketo the server everytime
  if (!error){
    console.log(error);
    return null;
  }
  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div>users:</div>
      <ul>
        {data.users.map(user => {
          return (
            <li key={user.id}>
              {user.email}, {user.id}
            </li>
          )
        })}
      </ul>
    </div>
  )
}