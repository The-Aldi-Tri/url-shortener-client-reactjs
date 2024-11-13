import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import React from 'react';

type ConfirmationDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || 'Confirmation'}</DialogTitle>
      <DialogContent>
        <p>{message || 'Are you sure to continue proceed this? '}</p>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            setLoading(true);
            await onConfirm();
            setLoading(false);
            onClose();
          }}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Executing...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
