import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import React from 'react';


export default function AddCustomer(props) {

    const [customer, setCustomer] = React.useState({
        firstname: "",
        lastname: "",
        streetaddress: "",
        postcode: "",
        city: "",
        email: "",
        phone: "",
    });

    // open = false, when window is closed
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleSave = () => {
        console.log("Add Customer");
        props.addCustomer(customer);
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button style={{ margin: 15, backgroundColor: '#007474' }} variant='contained' onClick={handleClickOpen}> Add a Customer</Button>
            <Dialog open={open}>
                <DialogTitle> Add New Customer </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Firstname"
                        value={customer.firstname}
                        onChange={(e) => setCustomer({...customer, firstname: e.target.value})}
                        variant="standard"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Lastname"
                        value={customer.lastname}
                        onChange={(e) => setCustomer({...customer, lastname: e.target.value})}
                        variant="standard"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Street Address"
                        value={customer.streetaddress}
                        onChange={(e) => setCustomer({...customer, streetaddress: e.target.value})}
                        variant="standard"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Postcode"
                        value={customer.postcode}
                        onChange={(e) => setCustomer({...customer, postcode: e.target.value})}
                        variant="standard"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="City"
                        value={customer.city}
                        onChange={(e) => setCustomer({...customer, city: e.target.value})}
                        variant="standard"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        value={customer.email}
                        onChange={(e) => setCustomer({...customer, email: e.target.value})}
                        variant="standard"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Phone Number"
                        value={customer.phone}
                        onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                        variant="standard"
                        fullWidth
                    />
                    
                </DialogContent>

                <Button onClick={handleSave}> Save </Button>
                <Button onClick={handleCancel}> Cancel </Button>

            </Dialog>
        </div>
    )
}