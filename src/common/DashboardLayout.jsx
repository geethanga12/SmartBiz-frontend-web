// src/common/DashboardLayout.jsx
import React, { useState } from "react"; // Added useState if not there
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Avatar,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";
import { Dashboard as DashboardIcon, Inventory as ProductsIcon, People as CustomersIcon, LocalShipping as SuppliersIcon, Work as EmployeesIcon, PointOfSale as SalesIcon, Receipt as InvoicesIcon, MoneyOff as ExpensesIcon } from "@mui/icons-material";

const drawerWidth = 220;

const iconForName = (name) => {
  if (/overview|dashboard/i.test(name)) return <DashboardIcon />;
  if (/business/i.test(name)) return <BusinessIcon />;
  if (/products/i.test(name)) return <ProductsIcon />;
  if (/customer|user|people/i.test(name)) return <CustomersIcon />;
  if (/suppliers/i.test(name)) return <SuppliersIcon />;
  if (/employees/i.test(name)) return <EmployeesIcon />;
  if (/sales/i.test(name)) return <SalesIcon />;
  if (/invoices/i.test(name)) return <InvoicesIcon />;
  if (/expenses/i.test(name)) return <ExpensesIcon />;
  if (/setting/i.test(name)) return <SettingsIcon />;
  return <HomeIcon />;
};

export default function DashboardLayout({ title = "Dashboard", menu = [], children }) {
  const theme = useTheme();
  const [open, setOpen] = useState(true); // Your existing state
  const userEmail = localStorage.getItem("user-email") || "";

  const logout = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("user-role");
    localStorage.removeItem("user-email");
    window.location.href = "/login";
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position="fixed" color="primary" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" onClick={() => setOpen((s) => !s)} edge="start" sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              {title}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
              {userEmail}
            </Typography>
            <Avatar sx={{ bgcolor: "secondary.main", width: 34, height: 34 }}>
              {userEmail ? userEmail[0].toUpperCase() : "U"}
            </Avatar>
            <IconButton color="inherit" onClick={logout} title="Logout">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{ sx: { width: open ? drawerWidth : 64, transition: "width 0.2s ease" } }} // Added ease transition
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { boxSizing: "border-box", width: open ? drawerWidth : 64, transition: "width 0.2s ease" },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {menu.map((m, idx) => (
            <ListItem key={idx} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={m.path}
                onClick={() => { /* No toggle here; stays as is */ }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <Box sx={{ mr: open ? 2 : 0 }}>{iconForName(m.name)}</Box>
                <ListItemText primary={m.name} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${open ? drawerWidth : 64}px)`, // Dynamic width fix
          transition: "width 0.2s ease", // Smooth transition
        }}
      >
        <Toolbar />
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
        </Box>

        <Box>{children}</Box>
      </Box>
    </Box>
  );
}


// // src/common/DashboardLayout.jsx
// import React, { useState } from "react"; // Added useState if not there
// import {
//   Box,
//   Drawer,
//   AppBar,
//   Toolbar,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   IconButton,
//   Typography,
//   Divider,
//   Avatar,
//   useTheme,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import LogoutIcon from "@mui/icons-material/Logout";
// import HomeIcon from "@mui/icons-material/Home";
// import BusinessIcon from "@mui/icons-material/Business";
// import PeopleIcon from "@mui/icons-material/People";
// import SettingsIcon from "@mui/icons-material/Settings";
// import { Link } from "react-router-dom";
// import { Dashboard as DashboardIcon, Inventory as ProductsIcon, People as CustomersIcon, LocalShipping as SuppliersIcon, Work as EmployeesIcon, PointOfSale as SalesIcon, Receipt as InvoicesIcon, MoneyOff as ExpensesIcon } from "@mui/icons-material";

// const drawerWidth = 220;

// const iconForName = (name) => {
//   if (/overview|dashboard/i.test(name)) return <DashboardIcon />;
//   if (/business/i.test(name)) return <BusinessIcon />;
//   if (/products/i.test(name)) return <ProductsIcon />;
//   if (/customer|user|people/i.test(name)) return <CustomersIcon />;
//   if (/suppliers/i.test(name)) return <SuppliersIcon />;
//   if (/employees/i.test(name)) return <EmployeesIcon />;
//   if (/sales/i.test(name)) return <SalesIcon />;
//   if (/invoices/i.test(name)) return <InvoicesIcon />;
//   if (/expenses/i.test(name)) return <ExpensesIcon />;
//   if (/setting/i.test(name)) return <SettingsIcon />;
//   return <HomeIcon />;
// };

// export default function DashboardLayout({ title = "Dashboard", menu = [], children }) {
//   const theme = useTheme();
//   const [open, setOpen] = useState(true); // Your existing state
//   const userEmail = localStorage.getItem("user-email") || "";

//   const logout = () => {
//     localStorage.removeItem("user-token");
//     localStorage.removeItem("user-role");
//     localStorage.removeItem("user-email");
//     window.location.href = "/login";
//   };

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh" }}>
//       <AppBar position="fixed" color="primary" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <IconButton color="inherit" onClick={() => setOpen((s) => !s)} edge="start" sx={{ mr: 1 }}>
//               <MenuIcon />
//             </IconButton>
//             <Typography variant="h6" noWrap>
//               {title}
//             </Typography>
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
//               {userEmail}
//             </Typography>
//             <Avatar sx={{ bgcolor: "secondary.main", width: 34, height: 34 }}>
//               {userEmail ? userEmail[0].toUpperCase() : "U"}
//             </Avatar>
//             <IconButton color="inherit" onClick={logout} title="Logout">
//               <LogoutIcon />
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       <Drawer
//         variant="permanent"
//         open={open}
//         PaperProps={{ sx: { width: open ? drawerWidth : 64, transition: "width 0.2s ease" } }} // Added ease transition
//         sx={{
//           width: open ? drawerWidth : 64,
//           flexShrink: 0,
//           [`& .MuiDrawer-paper`]: { boxSizing: "border-box", width: open ? drawerWidth : 64, transition: "width 0.2s ease" },
//         }}
//       >
//         <Toolbar />
//         <Divider />
//         <List>
//           {menu.map((m, idx) => (
//             <ListItem key={idx} disablePadding sx={{ display: "block" }}>
//               <ListItemButton
//                 component={Link}
//                 to={m.path}
//                 onClick={() => { /* No toggle here; stays as is */ }}
//                 sx={{
//                   minHeight: 48,
//                   justifyContent: open ? "initial" : "center",
//                   px: 2.5,
//                 }}
//               >
//                 <Box sx={{ mr: open ? 2 : 0 }}>{iconForName(m.name)}</Box>
//                 <ListItemText primary={m.name} sx={{ opacity: open ? 1 : 0 }} />
//               </ListItemButton>
//             </ListItem>
//           ))}
//         </List>
//       </Drawer>

//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: `calc(100% - ${open ? drawerWidth : 64}px)`, // Dynamic width fix
//           transition: "width 0.2s ease", // Smooth transition
//         }}
//       >
//         <Toolbar />
//         <Box sx={{ mb: 2 }}>
//           <Typography variant="h5" gutterBottom>
//             {title}
//           </Typography>
//         </Box>

//         <Box>{children}</Box>
//       </Box>
//     </Box>
//   );
// }