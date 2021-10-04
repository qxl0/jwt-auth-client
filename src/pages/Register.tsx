import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { useRegisterMutation } from "../generated/graphql";

export const Register: React.FC<RouteComponentProps> = ({history}) => {
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [register] = useRegisterMutation();
  return (
    <form onSubmit={async e=>{
      e.preventDefault();
      const response = await register({
        variables: {
          registerEmail: email,
          registerPassword: password
        }
      })
      console.log("response is", response)

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
      <button>Register</button>
    </form>
  );
};
