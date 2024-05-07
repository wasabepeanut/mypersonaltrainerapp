import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function TrainingCalendar() {
    const [events, setEvents] = useState([]);

    const getTrainings = () => {
        const trainingURL = 'https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings';

        // fetch all activities
        fetch(trainingURL)
            .then(response => response.json())
            .then(responseData => {
                const formattedEvents = responseData
                    .filter(training => training.customer)
                    .map(training => ({
                        id: training.id,
                        title: training.activity,
                        customerFirstname: training.customer.firstname,
                        customerLastname: training.customer.lastname,
                        start: new Date(training.date),
                        end: new Date(moment(training.date).add(training.duration, 'minutes')),
                    }));

                setEvents(formattedEvents);
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        getTrainings();
    }, []);

    
    const EventComponent = ({ event }) => (
        <div>
            {event.title}
            {event.customerFirstname && event.customerLastname && (
                <div>{`${event.customerFirstname} ${event.customerLastname}`}</div>
            )}

            <br />
        </div>
    );

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h2>Calendar</h2>
            <div style={{ height: 1000, width: 1280, padding: 20 }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    components={{
                        event: EventComponent,
                    }}
                />
            </div>
        </div>
    );
}