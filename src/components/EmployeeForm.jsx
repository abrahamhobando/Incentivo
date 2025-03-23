import React, { useState } from 'react';
import { Box, Button, TextField, Card, CardContent } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { addEmployee } from '../utils/storage';

const EmployeeForm = ({ onEmployeeAdded }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEmployee = addEmployee({ name });
    console.log('Employee added:', newEmployee);
    setName('');
    if (onEmployeeAdded) onEmployeeAdded();
  };

  return (
    <Card>
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            label="Nombre del Empleado"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            size="small"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            sx={{ minWidth: '120px' }}
          >
            Agregar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;