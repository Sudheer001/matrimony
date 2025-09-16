import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.js";
import MatrimonyForm from "../pages/MatrimonyForm.js";
import ProfileView from "../pages/ProfileView.js";
import EditProfile from "../pages/EditProfile.js";
import AddManager from "../pages/Add_manager.js";
import EditManager from "../pages/Edit_manager.js";
import ViewManagers from "../pages/View_managers.js";
import Login from "../pages/LoginPage.js";
import { ProtectedRoute } from "./ProtectedRoute.js";
import PendingProfile from "../pages/PendingProfile.js";
const RoutePath = () => {
  return (
    <Routes>
      <Route path={process.env.PUBLIC_URL + "/login"} element={<Login />} />
      <Route path={process.env.PUBLIC_URL + "/matrimony"} element={<MatrimonyForm />} />
      <Route path={process.env.PUBLIC_URL + "/"} element={<ProtectedRoute roles={["admin", "manager"]}><Home /></ProtectedRoute>} />
      <Route path={process.env.PUBLIC_URL + "/pendingProfiles"} element={<ProtectedRoute roles={["admin"]}><PendingProfile /></ProtectedRoute>} />

      {/* <Route
        path={process.env.PUBLIC_URL + "/matrimony"}
        element={<ProtectedRoute roles={["admin", "manager"]}><MatrimonyForm /></ProtectedRoute>}
      /> */}

      <Route
        path={process.env.PUBLIC_URL + "/profile/:id"}
        element={<ProtectedRoute roles={["admin", "manager"]}><ProfileView /></ProtectedRoute>}
      />

      <Route
        path={process.env.PUBLIC_URL + "/editProfile/:id"}
        element={
          <ProtectedRoute roles={["admin"]}>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path={process.env.PUBLIC_URL + "/addManager"}
        element={
          <ProtectedRoute roles={["admin"]}>
            <AddManager />
         </ProtectedRoute>
        }
      />
      <Route
        path={process.env.PUBLIC_URL + "/editManager/:id"}
        element={
          <ProtectedRoute roles={["admin"]}>
            <EditManager />
           </ProtectedRoute>
        }
      />
      <Route
        path={process.env.PUBLIC_URL + "/viewManagers"}
        element={
          <ProtectedRoute roles={["admin"]}>
            <ViewManagers />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default RoutePath;
