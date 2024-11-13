import { AccountCircle, Link as LinkIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeMenu } from '../components/ThemeMenu';
import { useAuthStore } from '../stores/useAuthStore';

export const Navbar: React.FC = () => {
  const { token, clearToken } = useAuthStore();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isAuth = () => {
    return (
      <div>
        <IconButton size="large" onClick={handleMenu} color="inherit">
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              navigate('/profile');
            }}
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              clearToken();
              handleClose();
              navigate('/');
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </div>
    );
  };

  const isNotAuth = () => {
    return (
      <Button
        variant="outlined"
        color="inherit"
        onClick={() => navigate('/auth')}
      >
        Login
      </Button>
    );
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <LinkIcon />
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              marginLeft: '10px',
              textDecoration: 'none',
              color: 'inherit',
            }}
            component={Link}
            to="/"
          >
            Url Shortener
          </Typography>
          <Box sx={{ marginRight: '20px' }}>
            {token ? isAuth() : isNotAuth()}
          </Box>
          <ThemeMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
