import * as React from 'react';
import { useUser } from './UserContext';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import PeopleIcon from '@mui/icons-material/People';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // ✅ NEW

import logo from '../assets/img/Lookman.png';
import SignUp from './Signup';
import Master from './Master';
import Inventorys from './Inventorys';
import Customer from './Customer';
import SalesPerson from './SalesPerson';
import Brand from './Brand';
import Warehouses from './Warehouses';
import Location from './Location';
import Qoh from './Qoh';
import SalesInvoice from './SalesInvoice';
import Dispatch from './Dispatch';
import Invoice from './Invoice';
import InvoiceDetails from './InvoiceDetails';
import Home from './Home';
import StockInward from './StockInward';
import StockOutward from './StockOutward';
import Reports from './Reports';
import StoreDetails from './StoreDetails';


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerComponent = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const menuItems = [
  { text: 'Home', content: <Home />, icon: <HomeIcon /> },
  { text: 'Warehouses', content: <Warehouses />, icon: <WarehouseIcon /> },
  { text: 'Brands', content: <Brand />, icon: <BrandingWatermarkIcon /> },
  { text: 'Locations', content: <Location />, icon: <LocationOnIcon /> },
  { text: 'Register', content: <SignUp />, icon: <AppRegistrationIcon /> },
  { text: 'Product', content: <Master />, icon: <InventoryIcon /> },
  { text: 'Store Details', content: <StoreDetails/>, icon: <InventoryIcon /> },
  { text: 'Stock Inward', content: <StockInward />, icon: <FormatListNumberedIcon /> },
  { text: 'Stock Outward', content: <StockOutward />, icon: <FormatListNumberedIcon /> },
  { text: 'Customer', content: <Customer />, icon: <PeopleIcon /> },
  { text: 'Invoice', content: <Invoice />, icon: <RequestQuoteIcon /> },
  { text: 'Reports', content: <Reports />, icon: <AssessmentIcon /> },
  { text: 'Sales Person', content: <SalesPerson />, icon: <PointOfSaleIcon /> },
];

export default function MiniDrawer() {
  const { user, logout } = useUser();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(menuItems[0].content);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);

  // ✅ Live India time/date state
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const timeString = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
        timeZone: 'Asia/Kolkata',
        timeZoneName: 'short',
      }).format(now);
    } catch {
      // Fallback if Intl options not supported
      return now.toLocaleString('en-IN');
    }
  }, [now]);

  const getFilteredMenuItems = () => {
    if (!user) return [];
    return user.role === 'admin'
      ? menuItems
      : menuItems.filter(item =>
          ['Product', 'Invoice', 'Stock Inward', 'Stock Outward', 'Reports','Home'].includes(item.text)
        );
  };

  const filteredMenuItems = getFilteredMenuItems();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleMenuItemClick = (content) => setSelectedItem(content);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogoutClick = () => { setOpenLogoutDialog(true); handleClose(); };
  const handleLogoutConfirm = () => { setOpenLogoutDialog(false); logout(); };
  const handleLogoutCancel = () => setOpenLogoutDialog(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div">
            Inventory Management System
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* ✅ Live time/date (left of bell) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 2,
              gap: 1,
              color: 'white',
            }}
            title="Current time (Asia/Kolkata)"
          >
            <AccessTimeIcon />
            <Typography variant="body2" sx={{ lineHeight: 1 }}>
              {timeString}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" aria-label="notifications">
              <NotificationsIcon />
            </IconButton>
            <Typography variant="body1" sx={{ color: 'white', marginRight: 1 }}>
              {user?.role || 'Admin'}
            </Typography>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <AccountBoxIcon sx={{ marginRight: 1 }} />
                My Account
              </MenuItem>
              <MenuItem onClick={handleLogoutClick}>
                <LogoutIcon sx={{ marginRight: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <DrawerComponent variant="permanent" open={open}>
        <DrawerHeader>
          <img src={logo} alt="Logo" style={{ width: 'auto', height: '60px' }} />
          <IconButton onClick={handleDrawerClose} sx={{ position: 'absolute', right: 8 }}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {filteredMenuItems.slice(0, 4).map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
                onClick={() => handleMenuItemClick(item.content)}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {filteredMenuItems.slice(4).map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
                onClick={() => handleMenuItemClick(item.content)}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DrawerComponent>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {selectedItem}
      </Box>

      <Dialog
        open={openLogoutDialog}
        onClose={handleLogoutCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
