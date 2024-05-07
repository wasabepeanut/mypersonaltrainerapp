import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import React from 'react';

export default function EditCustomer(props) {


    
    const [customer, setCustomer] = React.useState({
        firstname: "",
        lastname: "",
        streetaddress: "",
        postcode: "",
        city: "",
        email: "",
        phone: "",
    });

    // open = false, when window closed
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
        console.log(props.params.data._links.customer.href)
        setCustomer({
            firstname: props.params.data.firstname,
            lastname: props.params.data.lastname,
            streetaddress: props.params.data.streetaddress,
            postcode: props.params.data.postcode,
            city: props.params.data.city,
            email: props.params.data.email,
            phone: props.params.data.phone
        })
    };

    const handleSave = () => {
        props.editCustomer(customer, props.params.data._links.customer.href);
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button color='success' onClick={handleClickOpen}> Edit </Button>

            <Dialog open={open}>
                <DialogTitle> Edit Customer </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Firstname"
                        value={customer.firstname}
                        onChange={(e) => setCustomer({...customer, firstname: e.target.value})}
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Lastname"
                        value={customer.lastname}
                        onChange={(e) => setCustomer({...customer, lastname: e.target.value})}
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Street Address"
                        value={customer.streetaddress}
                        onChange={(e) => setCustomer({...customer, streetaddress: e.target.value})}
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Postcode"
                        value={customer.postcode}
                        onChange={(e) => setCustomer({...customer, postcode: e.target.value})}
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="City"
                        value={customer.city}
                        onChange={(e) => setCustomer({...customer, city: e.target.value})}
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        value={customer.email}
                        onChange={(e) => setCustomer({...customer, email: e.target.value})}
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Phone Number"
                        value={customer.phone}
                        onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                        variant="standard"
                    />
                </DialogContent>
                
                <Button onClick={handleSave}> Save </Button>
                <Button onClick={handleCancel}> Cancel </Button>
            </Dialog>
        </div>
    )
}
