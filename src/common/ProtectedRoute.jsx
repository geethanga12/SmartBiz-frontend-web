// src/common/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute ensures:
 *  - token exists in localStorage
 *  - (optional) role is in allowed list
 *
 * usage:
 * <ProtectedRoute roles={['ADMIN']}><AdminPage/></ProtectedRoute>
 */
export default function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("user-token");
  const role = localStorage.getItem("user-role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    // unauthorized for this role -> redirect to login (or show a NotAuthorized page)
    return <Navigate to="/login" replace />;
  }

  return children;
}




// // src/common/ProtectedRoute.jsx

// import React from "react";
// import { Navigate } from "react-router-dom";

// /**
//  * roles: optional array of allowed roles, e.g. ['ADMIN'] or ['OWNER']
//  */
// export default function ProtectedRoute({ children, roles }) {
//   const token = localStorage.getItem("user-token");
//   const role = localStorage.getItem("user-role");

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }
//   if (roles && !roles.includes(role)) {
//     // optionally show a "not authorized" page
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// }
