import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import "./HomePage.css";
const HomePage = () => {
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
