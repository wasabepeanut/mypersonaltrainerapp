import React, { useState, useEffect } from 'react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css"; // Material Design theme
import { AgGridReact } from "ag-grid-react";
import { Button, Snackbar } from "@mui/material";
import dayjs from 'dayjs';
import AddTraining from './addTraining';



export default function TrainingList() {
    const [trainings, setTrainings] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const formatDate = (params) => {
        //console.log(params.value)
        return convertDate(params.value);
    }
    const [customers, setCustomers] = useState([]);

    // dateFormatter to convert the date to our liking
    const convertDate = (dateString) => {
        // Parse the date string using Day.js
        const date = dayjs(dateString);
        // Format the date using Day.js format method, with AM and PM
        return date.format('MMM DD, YYYY - hh:mm A');
    };



    const [colDefs, setColDefs] = useState([
        { field: "activity" },
        { field: "date", valueFormatter: formatDate },
        { field: "duration", headerName: "Duration (min)" },
        {
            headerName: "Customer",
            valueGetter: params => {
                const customer = params.data.customer;
                // Combine the firstname and lastname
                return `${customer.firstname} ${customer.lastname}`;
            }
        },
        {
            cellRenderer: (params) => (
                <Button size="small" color="error" onClick={() => deleteTraining(params)}>
                    Delete
                </Button>
            ),
        }
    ]);

    useEffect(() => fetchTrainings(), []);

    const fetchTrainings = () => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings')
            .then(response => response.json())
            .then(data => {
                setTrainings(data);
            })
            .catch(function () {
                console.log("Fetch failed!");
            });
    };

    const addTraining = (training, customerId) => {
        training.customer = customerId;
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings', {
            method: "POST", headers: {
                'Content-type': 'application/json'
            }, body: JSON.stringify(training)
        })
            .then(response => {
                if (response.ok) {
                    setOpenSnackbar(true);
                    fetchTrainings();
                } else {
                    setOpenSnackbar(true);
                }
            })
            .catch(error => {
                console.error("Error adding customer:", error);
                setOpenSnackbar(true);
            });
    };

    const deleteTraining = (params) => {
        console.log(params.data.id);
        const trainingId = params.data.id;
        if (window.confirm("Are you sure you want to delete this training?")) {
            fetch("https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings/" + trainingId,
                { method: "DELETE" })
                .then((response) => {
                    if (response.ok) {
                        window.alert("Delete Success!");
                        fetchTrainings();
                    } else {
                        window.alert("Delete Failed!")
                    };
                })
                .catch();
        }
    };


    return (
        <div className="ag-theme-material" style={{ width: 1650, height: 750, margin: "auto" }}>
            <AddTraining addTraining={addTraining} />
            <AgGridReact
                rowData={trainings}
                columnDefs={colDefs}
                animateRows={true}
                rowSelection="single"
                pagination={true}
                paginationPageSize={10}
            />
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            />
        </div >
    )

}