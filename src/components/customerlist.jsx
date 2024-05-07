import React, { useState, useEffect } from 'react';
import TrainingList from './traininglist';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css"; // Material Design theme
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { AgGridReact } from "ag-grid-react";
import { Button, Snackbar, TextField, Stack } from "@mui/material";
import AddCustomer from './addCustomer';
import EditCustomer from './editCustomer';
import TrainingCalendar from './trainingCalendar';
import Charts from './charts';
import { Parser } from "@json2csv/plainjs";


export default function CustomerList() {

    // Pop-up window for addCustomer and editCustomer
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [customersWithId, setCustomersWithId] = useState([]);
    const [searchText, setSearchText] = useState('');

    const [colDefs, setColDefs] = useState([
        { field: "firstname" },
        { field: "lastname" },
        { field: "streetaddress" },
        { field: "postcode" },
        { field: "city" },
        { field: "email" },
        { field: "phone" },
        {
            cellRenderer: (params) => <EditCustomer editCustomer={editCustomer} params={params} />, width: 120
        },
        {
            cellRenderer: (params) => (
                <Button size="small" color="error" onClick={() => deleteCustomer(params)}>
                    Delete
                </Button>
            ),
        }
    ]);

    useEffect(() => getCustomers(), []); // fetch only after first rendering


    // List for all customers
    const getCustomers = () => {
        fetch("https://customerrestservice-personaltraining.rahtiapp.fi/api/customers", { method: "GET" })
            .then((response) => {
                console.log(response);
                if (response.ok) {
                    return response.json();
                } else {
                }
            })
            .then((data) => {
                console.log(data._embedded.customers);
                setCustomers(data._embedded.customers);
            })
            .catch((error) => console.error(error));
    }


    const deleteCustomer = (params) => {
        console.log(params.data._links.customer.href);
        if (window.confirm("Are you sure you want to delete this customer?")) {
            fetch(params.data._links.customer.href,
                { method: "DELETE" })
                .then((response) => {
                    if (response.ok) {
                        window.alert("Delete Success!");
                        getCustomers();
                    } else {
                        window.alert("Delete Failed!")
                    };
                })
                .catch();
        }
    };

    const addCustomer = (customer) => {
        fetch("https://customerrestservice-personaltraining.rahtiapp.fi/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customer)
        })
            .then(response => {
                console.log("response" + response);
                if (response.ok) {
                    return response.json
                } else {
                    throw new Error("Data transfer unsuccessful")
                }
            })
            .then(data => {
                console.log("parsed JSON = " + data)
                getCustomers()
            })
            .catch(err => console.error(err))
    }

    const editCustomer = (customer, link) => {
        console.log(link)
        fetch(link, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customer)
        })
            .then(response => {
                if (response.ok) {
                    return response.json
                } else {
                    throw new Error("Edit error")
                }
            })
            .then(data => {
                getCustomers()
            })
            .catch(err => console.error(err))
    };



    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    // filters searchText to search only for firstname and lastname
    const filteredCustomers = customers.filter(customer =>
        customer.firstname.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.lastname.toLowerCase().includes(searchText.toLowerCase())
    );

    // Allows user to navigate between tabs, and sets default tab to value = 1.
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    // method for exporting a CSV file
    const exportToCSV = () => {
        const customersForCSV = customers.map(({ _links, ...rest }) => rest);
        const parser = new Parser();
        const csv = parser.parse(customersForCSV);
        const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const csvURL = window.URL.createObjectURL(csvData);
        const tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'export.csv');
        tempLink.click();
    };

    return (

        <Box sx={{ width: '100%', typography: 'body1' }}>

            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Home" value="1" />
                        <Tab label="Customers" value="2" />
                        <Tab label="Training" value="3" />
                        <Tab label="Calendar" value="4" />
                        <Tab label="Charts" value="5" />

                    </TabList>

                </Box>
                <TabPanel value="1">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h1>Welcome to my Personal Trainer App.</h1>
                    </div>
                </TabPanel>

                <TabPanel value="2">
                    <div className="ag-theme-material" style={{ width: 1720, height: 750, margin: "auto" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <AddCustomer addCustomer={addCustomer} sx={{ width: '150px', height: '40px' }} />
                            <Button variant="outlined"  onClick={exportToCSV} sx={{ width: '150px', height: '36px' }}>Export to
                                CSV</Button>
                        </Stack>
                        <AddCustomer addCustomer={addCustomer} />
                        <div>
                        </div>
                        <TextField
                            label="Search"
                            variant="outlined"
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                        <AgGridReact
                            rowData={filteredCustomers}
                            columnDefs={colDefs}
                            animateRows={true}
                            rowSelection="single"
                            pagination={true}
                            paginationPageSize={10}
                        />
                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={30}
                            onClose={() => setOpenSnackbar(false)}
                        />
                    </div >
                </TabPanel>

                <TabPanel value="3">
                    <TrainingList />
                </TabPanel>

                <TabPanel value="4">
                    <TrainingCalendar />
                </TabPanel>

                <TabPanel value="5">
                    <Charts />
                </TabPanel>


            </TabContext>
        </Box>
    )
}