import React from "react";
import { Divider, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Drawer, IconButton } from "@mui/material";
import { Inbox, Mail } from "@mui/icons-material";

// TODO: handle better
const drawerWidth = 240;

const UserDetails: React.FC = () => {
  return <Typography>User details</Typography>;
};

// TODO: Need to complete this nav list
const drawerItems = (
  <div>
    <UserDetails />
    <Toolbar />
    <Divider />
    <List>
      {["Dashboard", "Portfolio", "DEX"].map((text, index) => (
        <ListItem button key={text}>
          <ListItemIcon>{index % 2 === 0 ? <Inbox /> : <Mail />}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  </div>
);

// TODO: rename NavDrawer?
const JUPDrawer: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
          <Mail />
        </IconButton>
      </Toolbar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawerItems}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawerItems}
      </Drawer>
    </>
  );
};

export default React.memo(JUPDrawer);
