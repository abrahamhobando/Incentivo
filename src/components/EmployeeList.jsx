import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteEmployee } from '../utils/storage';

const EmployeeList = ({ employees, onEmployeeDeleted }) => {
  const handleDelete = (employeeId) => {
    deleteEmployee(employeeId);
    if (onEmployeeDeleted) onEmployeeDeleted();
  };

  return (
    <Card>
      <CardContent>
        <List sx={{ width: '100%' }}>
          {employees.map((employee, index) => (
            <React.Fragment key={employee.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" color="text.primary">
                      {employee.name}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(employee.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default EmployeeList;