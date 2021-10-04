import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { getAccessToken, setAccessToken } from "./accessToken";
import { App } from "./App";

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";

const cache = new InMemoryCache({ });

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle: any;
    Promise.resolve(operation)
      .then((operation) => {
        const token = getAccessToken();
        if (token) {
          operation.setContext({
            headers: {
              authorization: `bearer ${token}`
            },
          });
        }
      })
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer));

    return () => {
      if (handle) handle.unsubscribe();
    };
  })
);

const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: "accessToken",
      isTokenValidOrUndefined: () =>{ 
        console.log("istokenValidOrUndefined()")
        const token = getAccessToken();
        if (!token){
          return true;
        }
        try {
          const {exp} = jwtDecode(token) as any;
          if (Date.now() >= exp * 1000){
            console.log("token expired")
            return false;
          }else {
            console.log("token valid")
            return true;
          }
        } catch(err){
          return false;
        }
      },
      fetchAccessToken: () => {
        console.log("fetchAccessToken()")
        return fetch("http://localhost:4000/refresh_token", {
          method: "POST",
          credentials: "include"
        });
      },
      handleFetch: accessToken => {
        setAccessToken(accessToken);
      },
      handleError: err => {
         // full control over handling token fetch Error
         console.warn('Your refresh token is invalid. Try to relogin');
         console.error(err);
      }
    }) as any,
    onError(({ graphQLErrors, networkError }) => {
      console.log('graphQLErrors', graphQLErrors);
      console.log('networkError', networkError);
    }),
    requestLink,
    new HttpLink({
      uri: 'http://localhost:4000/graphql',
      credentials: 'include'
    })
  ]),
  cache,
}) as any;

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
