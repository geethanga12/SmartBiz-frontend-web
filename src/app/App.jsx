// src/app/App.jsx
import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import OwnerDashboard from "../pages/Owner/OwnerDashboard";
import RegisterBusiness from "../pages/Owner/RegisterBusiness";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Products from "../pages/Owner/Products";
import Customers from "../pages/Owner/Customers"; // New: Import Customers
import Suppliers from "../pages/Owner/Suppliers"; // New: Import Suppliers
import Employees from "../pages/Owner/Employees"; // New: Import Employees
import ProtectedRoute from "../common/ProtectedRoute";
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import instance from "../service/AxiosOrder";

export default function App() {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const token = localStorage.getItem("user-token");
      if (!token) {
        if (mounted) setChecking(false);
        return;
      }

      try {
        await instance.get("/api/profile");

        const role = localStorage.getItem("user-role") || "OWNER";

        const shouldAuto = ["/", "/login", "/register"].includes(
          location.pathname
        );

        if (role === "ADMIN") {
          if (shouldAuto) navigate("/admin/dashboard", { replace: true });
        } else {
          try {
            await instance.get("/api/business/my");
            if (shouldAuto) navigate("/owner/dashboard", { replace: true });
          } catch (err) {
            console.error("No business found for owner", err);
            if (shouldAuto)
              navigate("/owner/register-business", { replace: true });
          }
        }
      } catch (err) {
        console.error("Error checking user profile", err);
        localStorage.removeItem("user-token");
        localStorage.removeItem("user-role");
        localStorage.removeItem("user-email");
        if (location.pathname !== "/login")
          navigate("/login", { replace: true });
      } finally {
        if (mounted) setChecking(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [navigate, location]);

  if (checking) {
    return (
      <>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Owner routes */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute roles={["OWNER"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/register-business"
          element={
            <ProtectedRoute roles={["OWNER"]}>
              <RegisterBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/products"
          element={
            <ProtectedRoute roles={["OWNER"]}>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route // New: Customers route
          path="/owner/customers"
          element={
            <ProtectedRoute roles={["OWNER"]}>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route // New: Suppliers route
          path="/owner/suppliers"
          element={
            <ProtectedRoute roles={["OWNER"]}>
              <Suppliers />
            </ProtectedRoute>
          }
        />
        <Route // New: Employees route
          path="/owner/employees"
          element={
            <ProtectedRoute roles={["OWNER"]}>
              <Employees />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

// // src/app/App.jsx
// import React, { useEffect, useState } from "react";
// import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
// import Login from "../pages/Login/Login";
// import Register from "../pages/Register/Register";
// import OwnerDashboard from "../pages/Owner/OwnerDashboard";
// import RegisterBusiness from "../pages/Owner/RegisterBusiness";
// import AdminDashboard from "../pages/Admin/AdminDashboard";
// // import Products from "../pages/Owner/Products";
// import Products from "../pages/Owner/Products"; // New: Import Products page
// import ProtectedRoute from "../common/ProtectedRoute";
// import { CssBaseline, Box, CircularProgress } from "@mui/material";
// import instance from "../service/AxiosOrder";

// export default function App() {
//   const [checking, setChecking] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     let mounted = true;
//     const init = async () => {
//       const token = localStorage.getItem("user-token");
//       if (!token) {
//         if (mounted) setChecking(false);
//         return;
//       }

//       try {
//         await instance.get("/api/profile");

//         const role = localStorage.getItem("user-role") || "OWNER";

//         const shouldAuto = ["/", "/login", "/register"].includes(location.pathname);

//         if (role === "ADMIN") {
//           if (shouldAuto) navigate("/admin/dashboard", { replace: true });
//         } else {
//           try {
//             await instance.get("/api/business/my");
//             if (shouldAuto) navigate("/owner/dashboard", { replace: true });
//           } catch (err) {
//             console.error("No business found for owner", err);
//             if (shouldAuto) navigate("/owner/register-business", { replace: true });
//           }
//         }
//       } catch (err) {
//         console.error("Error checking user profile", err);
//         localStorage.removeItem("user-token");
//         localStorage.removeItem("user-role");
//         localStorage.removeItem("user-email");
//         if (location.pathname !== "/login") navigate("/login", { replace: true });
//       } finally {
//         if (mounted) setChecking(false);
//       }
//     };

//     init();
//     return () => {
//       mounted = false;
//     };
//   }, [navigate, location]);

//   if (checking) {
//     return (
//       <>
//         <CssBaseline />
//         <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
//           <CircularProgress />
//         </Box>
//       </>
//     );
//   }

//   return (
//     <>
//       <CssBaseline />
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" replace />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Owner routes */}
//         <Route
//           path="/owner/dashboard"
//           element={
//             <ProtectedRoute roles={["OWNER"]}>
//               <OwnerDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/owner/register-business"
//           element={
//             <ProtectedRoute roles={["OWNER"]}>
//               <RegisterBusiness />
//             </ProtectedRoute>
//           }
//         />
//         <Route  // New: Products route
//           path="/owner/products"
//           element={
//             <ProtectedRoute roles={["OWNER"]}>
//               <Products />
//             </ProtectedRoute>
//           }
//         />

//         {/* Admin routes */}
//         <Route
//           path="/admin/dashboard"
//           element={
//             <ProtectedRoute roles={["ADMIN"]}>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </>
//   );
// }
