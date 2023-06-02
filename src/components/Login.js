import { Button, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  let toast = useToast();
  let navigate = useNavigate();
  let [show, setShow] = useState(false);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [btnLoading, setBtnLoading] = useState(false);

  const handleSubmit = async () => {
    setBtnLoading(true);
    try {
      let res = await fetch("https://voluble.onrender.com/user/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      let response = await res.json();

      if (response.message) {
        setBtnLoading(false);
        return toast({
          title: response.message,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

      localStorage.setItem(
        "user-details",
        JSON.stringify(response.userDetails)
      );
      localStorage.setItem("x-auth-token", response.authToken);
      setBtnLoading(false);
      navigate("/chatpage");
      toast({
        title: "Logged-In Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      setBtnLoading(false);
      toast({
        title: error,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const guestUserCredentials = () => {
    setEmail("guest123@gmail.com");
    setPassword("guest");
  };
  return (
    <div className="signupTab">
      <form>
        <label htmlFor="Loginemail">
          E-mail Address <span>*</span>
        </label>
        <input
          type="text"
          id="Loginemail"
          name="Loginemail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="Loginpassword">
          Password <span>*</span>
        </label>
        <div className="passwordBar">
          <input
            type={show ? "text" : "password"}
            id="Loginpassword"
            name="Loginpassword"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button onClick={() => setShow(!show)} type="button">
            {show ? "hide" : "show"}
          </button>
        </div>

        <Button
          type="submit"
          onClick={() => handleSubmit()}
          colorScheme="green"
          style={{ marginTop: "3%" }}
          isLoading={btnLoading}
        >
          Log In
        </Button>
        <button
          type="button"
          className="btn btn-outline-success credentialsBtn"
          onClick={() => {
            guestUserCredentials();
          }}
        >
          Use Guest User's Credentials
        </button>
      </form>
    </div>
  );
};

export default Login;
