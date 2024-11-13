import { DarkMode, LightMode, SettingsBrightness } from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useColorScheme,
} from '@mui/material';
import * as React from 'react';

export const ThemeMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        style={{ border: '1px solid', borderColor: 'white' }}
      >
        {mode === 'dark' ? (
          <DarkMode />
        ) : mode === 'light' ? (
          <LightMode style={{ color: '#fff' }} />
        ) : (
          <SettingsBrightness />
        )}
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            setMode('system');
            handleClose();
          }}
        >
          <ListItemIcon>
            <SettingsBrightness />
          </ListItemIcon>
          <ListItemText>System</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMode('dark');
            handleClose();
          }}
        >
          <ListItemIcon>
            <DarkMode />
          </ListItemIcon>
          <ListItemText>Dark</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMode('light');
            handleClose();
          }}
        >
          <ListItemIcon>
            <LightMode />
          </ListItemIcon>
          <ListItemText>Light</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
