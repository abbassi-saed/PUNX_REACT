import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TablePagination,
} from '@mui/material';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DeleteOutline, UpdateRounded } from '@mui/icons-material';
import apiClient from '../../Api';
import TextField from '@mui/material/TextField';
import Title from './Title';


export default function Users() {
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState({ passw: '' });
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', passw: '' });

  const validatePassword = (password) => {
    return password.length >= 8;
  };
  
  const handleDelete = (id) => {
    setConfirmDialogOpen(false);

    apiClient.delete(`/api/Users/${id}`)
      .then(response => {
        toast.success('User deleted successfully');

        const updatedUsers = users.filter(user => user.id !== id);
        setUsers(updatedUsers);
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  const handleConfirmDelete = (user) => {
    setSelectedUser(user);
    setConfirmDialogOpen(true);
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setEditedUser({ passw: '' });
  };

  const handleEditSubmit = async () => {

    const updatedPassword = editedUser.passw;
    console.log(validatePassword(updatedPassword))
    if(validatePassword(updatedPassword)){

      await apiClient.put(`/api/Users/${selectedUser.id}?password=${updatedPassword}`, {

      })
      .then(response => {
        const updatedUsers = users.map(user =>
          user.id === selectedUser.id ? { ...user, passw: editedUser.passw } : user
        );
        setUsers(updatedUsers);

        setOpenDialog(false);
        setEditedUser({ passw: '' });
        toast.success('Password updated successfully');
      })
      .catch(error => {
        console.error('Error updating user:', error);
        toast.error('An error occurred while updating the user');
      });
    }
    else{
      toast.error('Password must be at least 8 characters');
    }


  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setSelectedUser(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggleCreateDialog = () => {
    setOpenCreateDialog(!openCreateDialog);
    setNewUser({ name: '', email: '', passw: '' });
  };

  const handleCreateUser = async () => {
    let response;
    try {
      const userData = {
        name: newUser.name,
        // lastName: lastName,
        email: newUser.email,
        password: newUser.passw,
        type: "1"
      };
      console.log(userData);
      response = await apiClient.post("/api/Users/register", userData, {
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json-patch+json"
        },
      });
      console.log(response.data.message);
      if (response.status === 201) {
        toast.success('Sign up successful!', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        const formData = new FormData();
        formData.append('Name', userData.name);
        formData.append('Password', userData.password);
        const response = await apiClient.post("/api/Authentication/login", formData, {
          headers: {
            "Accept": "application/json",
          },

        });
        if (response.status === 200) {

          setUsers([...users, { id: response.data.id, name: newUser.name, email: newUser.email }]);
          setOpenCreateDialog(false);
          
        }
      } else if (response.status === 400 || response.status === 409) {
        const errorMessage = response.data;
        toast.error(errorMessage, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else {
        toast.error('Error signing up', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
     
    } catch (error) {
      toast.error(error.response.data, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };
    

  useEffect(() => {
    apiClient.get('/api/Users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const userSlice = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <React.Fragment>
      <Title>User Management</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {userSlice.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell align="right">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<UpdateRounded />}
                onClick={() => handleUpdate(user)}
                style={{ marginRight: '8px' }}
              >
                Edit Password
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<DeleteOutline />}
                onClick={() => handleConfirmDelete(user)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      </Table>
      <TableCell align="right">
      <Button variant="contained" color="primary" onClick={handleToggleCreateDialog}>
        Create User
      </Button>
      </TableCell>
      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedUser && selectedUser.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDelete(selectedUser.id)} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the password for {selectedUser && selectedUser.name}.
          </DialogContentText>
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={editedUser.passw}
            onChange={(e) => setEditedUser({ ...editedUser, passw: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary" disabled={editedUser.passw === ''}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCreateDialog} onClose={handleToggleCreateDialog}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUser.passw}
            onChange={(e) => setNewUser({ ...newUser, passw: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleCreateDialog} color="primary">
            Cancel
          </Button>
          <Button 
          onClick={handleCreateUser} 
          color="primary" 
          disabled={!newUser.name || !newUser.email || !newUser.passw}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>


      <ToastContainer position="bottom-right" />
    </React.Fragment>
  );
}
