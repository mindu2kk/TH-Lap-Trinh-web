import "./App.css";

import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";

const App = () => {
  const [context, setContext] = useState("");
  const [advancedFeatures, setAdvancedFeatures] = useState(false);

  return (
    <Router>
      <TopBar
        context={context}
        advancedFeatures={advancedFeatures}
        onToggleAdvanced={() => setAdvancedFeatures((prev) => !prev)}
      />
      <div className="main-topbar-buffer">
        <Grid container spacing={2}>
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList />
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route
                  path="/users/:userId"
                  element={<UserDetail setContext={setContext} />}
                />
                <Route
                  path="/photos/:userId"
                  element={
                    <UserPhotos
                      setContext={setContext}
                      advancedFeatures={advancedFeatures}
                    />
                  }
                />
                <Route
                  path="/photos/:userId/stepper/:photoIndex"
                  element={
                    <UserPhotos
                      setContext={setContext}
                      advancedFeatures={advancedFeatures}
                    />
                  }
                />
                <Route path="/users" element={<UserList />} />
                <Route
                  path="/comments/:userId"
                  element={<UserComments setContext={setContext} />}
                />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
