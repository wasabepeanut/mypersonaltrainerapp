import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";


export default function AddTraining(props) {
    const [open, setOpen] = React.useState(false);
    const [customers, setCustomers] = React.useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = React.useState("");
    const [training, setTraining] = React.useState({
        date: null,
        duration: "",
        activity: ""
    });

    const [customerError, setCustomerError] = React.useState(false)

    React.useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = () => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers')
            .then(response => response.json())
            .then(data => {
                setCustomers(data._embedded.customers);
            })
            .catch(function () {
                console.log("Fetch failed!");
            });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        setTraining({ ...training, [event.target.name]: event.target.value });
    };

    const handleDateChange = (date) => {
        setTraining({ ...training, date: date });
    }

    const saveTraining = () => {
        if (selectedCustomerId) {
            props.addTraining(training, selectedCustomerId);
            handleClose();
            setCustomerError(false); // Reset customer selection error
        } else {
            setCustomerError(true); // Set customer selection error
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button style={{ margin: 15, backgroundColor: '#007474' }} variant='contained' onClick={handleClickOpen}>Add Training</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Training</DialogTitle>
                <DialogContent>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            value={training.date}
                            onChange={handleDateChange}
                            renderInput={(props) => (
                                <TextField
                                    {...props}
                                    margin="dense"
                                    label="Date and Time"
                                    fullWidth
                                />
                            )}
                        />
                    </LocalizationProvider>
                    <TextField
                        margin="dense"
                        name="duration"
                        value={training.duration}
                        onChange={handleInputChange}
                        label="Duration"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        name="activity"
                        value={training.activity}
                        onChange={handleInputChange}
                        label="Activity"
                        fullWidth
                    />
                    <TextField
                        select
                        label="Customer"
                        value={selectedCustomerId}
                        onChange={event => setSelectedCustomerId(event.target.value)}
                        fullWidth
                        required
                        error={customerError} // Apply error if customer is not selected
                        helperText={customerError && "Please select a customer"} // Error message if customer is not selected
                    >
                        {customers.map((customer) => (
                            <MenuItem key={customer._links.self.href} value={customer._links.self.href}>
                                {customer.firstname} {customer.lastname}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={saveTraining} color="primary">Save</Button>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
