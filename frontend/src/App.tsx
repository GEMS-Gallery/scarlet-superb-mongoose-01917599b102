import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import DataTable from 'react-data-table-component';
import { useForm, Controller } from 'react-hook-form';
import Modal from 'react-modal';

type TaxPayer = {
  tid: string;
  firstName: string;
  lastName: string;
  address: string;
};

const App: React.FC = () => {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [searchTid, setSearchTid] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<TaxPayer>();

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const fetchTaxPayers = async () => {
    const result = await backend.getTaxPayers();
    setTaxPayers(result);
  };

  const onSubmit = async (data: TaxPayer) => {
    setIsLoading(true);
    try {
      await backend.createTaxPayer(data.tid, data.firstName, data.lastName, data.address);
      await fetchTaxPayers();
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error creating tax payer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTid) {
      setIsLoading(true);
      try {
        const result = await backend.searchTaxPayer(searchTid);
        if (result) {
          setTaxPayers([result]);
        } else {
          setTaxPayers([]);
        }
      } catch (error) {
        console.error('Error searching tax payer:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      fetchTaxPayers();
    }
  };

  const columns = [
    { name: 'TID', selector: (row: TaxPayer) => row.tid, sortable: true },
    { name: 'First Name', selector: (row: TaxPayer) => row.firstName, sortable: true },
    { name: 'Last Name', selector: (row: TaxPayer) => row.lastName, sortable: true },
    { name: 'Address', selector: (row: TaxPayer) => row.address, sortable: true },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        TaxPayer Management System
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Search by TID"
          variant="outlined"
          value={searchTid}
          onChange={(e) => setSearchTid(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch} disabled={isLoading}>
          Search
        </Button>
        <Button variant="contained" color="secondary" onClick={() => setIsModalOpen(true)}>
          Add New TaxPayer
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={taxPayers}
        pagination
        progressPending={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add New TaxPayer"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
          },
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Add New TaxPayer
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="tid"
            control={control}
            defaultValue=""
            rules={{ required: 'TID is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="TID"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            rules={{ required: 'First Name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="First Name"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            rules={{ required: 'Last Name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Last Name"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: 'Address is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Address"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </form>
      </Modal>
    </Container>
  );
};

export default App;
