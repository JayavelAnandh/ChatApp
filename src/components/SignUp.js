import { Button, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
const SignUp = () => {
  let navigate = useNavigate();
  let toast = useToast();
  let [show, setShow] = useState(false);
  let [show2, setShow2] = useState(false);
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [pic, setPic] = useState();
  let [btnLoading, setBtnLoading] = useState(false);

  const handleSubmit = async () => {
    setBtnLoading(true);
    if (password == confirmPassword) {
      try {
        let res = await fetch("https://voluble.onrender.com/user/signup", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            pic,
          }),
        });
        let response = await res.json();

        if (response.message == "User already exists") {
          setBtnLoading(false);
          return toast({
            title: "User already exists try logging in",
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
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        console.log(error);
        setBtnLoading(false);
        toast({
          title: error,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } else {
      setBtnLoading(false);
      return toast({
        title: "Password doesn't matches Confirm password",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const postDetails = (img) => {
    setBtnLoading(true);

    if (img === undefined) {
      return toast({
        title: "Please Select an Image in JPEG or PNG format!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    console.log(img);
    if (img.type == "image/jpeg" || img.type == "image/png") {
      let data = new FormData();
      data.append("file", img);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dds8bfdsd");

      fetch("https://api.cloudinary.com/v1_1/dds8bfdsd/image/upload", {
        method: "POST",
        // headers: {
        //   "content-type": "application/json", //ithu image la so intha headers venam
        // },
        body: data,
      })
        .then((res) => res.json())
        .then((response) => {
          setPic(response.url.toString());
          console.log(response.url.toString());
          setBtnLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setBtnLoading(false);
        });
    } else {
      setBtnLoading(false);
      return toast({
        title: "Please Select an Image in JPEG or PNG format!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <div className="signupTab">
      <form>
        <label htmlFor="name">
          Name <span>*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="email">
          E-mail Address <span>*</span>
        </label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">
          Password <span>*</span>
        </label>
        <div className="passwordBar">
          <input
            type={show ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button onClick={() => setShow(!show)} type="button">
            {show ? "hide" : "show"}
          </button>
        </div>

        <label htmlFor="confirmPassword">
          Confirm Password <span>*</span>
        </label>
        <div className="passwordBar">
          <input
            type={show2 ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
          <button type="button" onClick={() => setShow2(!show2)}>
            {show2 ? "hide" : "show"}
          </button>
        </div>

        <label htmlFor="pic">
          Profile Picture <span>*</span>
        </label>
        <input
          type="file"
          id="pic"
          name="pic"
          accept="image/*"
          onChange={(event) => postDetails(event.target.files[0])}
          required
          style={{ border: "none" }}
        />

        <Button
          type="submit"
          onClick={() => handleSubmit()}
          colorScheme="green"
          style={{ marginTop: "3%" }}
          isLoading={btnLoading}
        >
          SignUp
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
