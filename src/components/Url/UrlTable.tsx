import { Delete } from '@mui/icons-material';
import { IconButton, Paper, Toolbar, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/useAuthStore';
import axiosInstance from '../../utils/axiosInstance';
import { ConfirmationDialog } from '../ConfirmationDialog';

const columns: GridColDef[] = [
  {
    field: 'shorten',
    headerName: 'Shorten Url',
  },
  {
    field: 'origin',
    headerName: 'Original Url',
  },
  {
    field: 'clicks',
    headerName: 'Clicks',
    align: 'right',
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    valueGetter: (value: Date) =>
      value.toLocaleString('en-GB', { timeZoneName: 'short' }),
  },
];

interface Url {
  _id: string;
  origin: string;
  shorten: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const fetchUrls = async (): Promise<Url[]> => {
  const { data } = await axiosInstance.get('/urls');
  return (data.data as Record<keyof Url, string>[]).map((url) => {
    return {
      ...url,
      createdAt: new Date(url.createdAt),
      updatedAt: new Date(url.updatedAt),
      clicks: parseInt(url.clicks, 10),
    };
  });
};

const deleteUrls = async (ids: GridRowId[]): Promise<void> => {
  await axiosInstance.delete('/urls', { data: { idsToDelete: ids } });
};

export function UrlTable() {
  const { token } = useAuthStore();
  const { data: rows, isLoading } = useQuery({
    queryKey: ['urls'],
    queryFn: fetchUrls,
    enabled: Boolean(token),
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (ids: GridRowId[]) => deleteUrls(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
  });

  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const [openConfirmationDialog, setOpenConfirmationDialog] =
    React.useState<boolean>(false);

  const handleDelete = async () => {
    if (rowSelectionModel.length === 0) return;
    try {
      await deleteMutation.mutateAsync([...rowSelectionModel]);
      toast.success('Delete url(s) success.');
      setRowSelectionModel([]);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.warning(
          error.response?.data.message ??
            'A server error occurred. Please try again later.',
        );
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <Paper sx={{ height: '60vh', width: '100%' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Shorten URLs
        </Typography>
        <IconButton
          color="error"
          disabled={rowSelectionModel.length === 0}
          onClick={() => setOpenConfirmationDialog(true)}
        >
          <Delete />
        </IconButton>
      </Toolbar>
      <DataGrid
        rows={rows}
        getRowId={(row) => row._id}
        columns={columns}
        loading={isLoading}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        sx={{ border: 0, paddingBottom: '60px' }}
      />
      <ConfirmationDialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this?`}
      />
    </Paper>
  );
}
