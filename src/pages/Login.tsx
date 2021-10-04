import React from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { setAccessToken } from '../accessToken';


export const Login: React.FC<RouteComponentProps> = ({history}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [login] = useLoginMutation();

  return (
    <form onSubmit={async e=>{
      e.preventDefault();
      const response = await login({
        variables: {
          loginEmail: email,
          loginPassword: password
        },
        update: (store, {data}) => {
          if(!data) {
            return null;
          }

          store.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              // __typename: 'Query',
              me: data.login.user
            }
          });
      }})
      console.log("login response is", response)

      if (response && response.data){
         setAccessToken(response.data.login.accessToken);
      }
      history.push("/")
      }}>
      <div>
        <input
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button>Login</button>
    </form>
  )
}