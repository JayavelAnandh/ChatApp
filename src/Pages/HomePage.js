import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import "./HomePage.css";
const HomePage = () => {
  let navigate = useNavigate();
  let toast = useToast();
  useEffect(() => {
    let user_Details = localStorage.getItem("user-details");

    if (user_Details) {
      toast({
        title: "User Already Logged-In , Trying logging out",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      navigate("/chatpage");
    }
  }, [navigate]);

  return (
    <div className="container-xl homepage">
      <div className="row">
        <div className="appName col-lg-10">VOLUBLE</div>
        <div className="tabChange col-lg-10">
          <Tabs
            variant="soft-rounded"
            colorScheme="green"
            color="black"
            width="100%"
          >
            <TabList mb="1em">
              <Tab width="50%">Log In</Tab>
              <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
