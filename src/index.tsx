import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { getAccessToken } from "./accessToken";
import { App } from "./App";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
  request: (operation) => {
    const token = getAccessToken();
    console.log("got token:", token);
    if (token) {
      operation.setContext({
        headers: {
          authorization: `bearer ${token}`
        },
      });
    }
  }
 }) as any;

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
