// source for the chart 
// https://recharts.org/en-US/api/RadialBarChart

// source to group trainings by activity name
// https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects

import { useState, useEffect } from "react";
import { RadialBarChart, ResponsiveContainer } from "recharts";
import { RadialBar } from "recharts";
import { Legend, Tooltip } from "recharts";

export default function Charts() {

    const [trainings, setTrainings] = useState([]);



    const REST_URL = "https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings";

    const getTrainings = () => {
        fetch(REST_URL)
            .then(response => response.json())
            .then(responseData => {
                const groupedTrainings = groupTrainings(responseData);

                const trainingsForChart = groupedTrainings.map((trainings, index) => ({
                    name: trainings.name,
                    fill: getColor(index),
                    durations: trainings.trainings.reduce((total, training) => total + training.duration, 0),
                }));
                setTrainings(trainingsForChart);
                console.log("Trainings for chart: " + trainingsForChart);

            })
            .catch(error => {
                console.log(error)
            });
    }

    const groupTrainings = (trainings) => {
        const groupedTrainings = {};
        trainings.forEach(training => {
            if (!groupedTrainings[training.activity]) {
                groupedTrainings[training.activity] = { name: training.activity, trainings: [] };
            }
            groupedTrainings[training.activity].trainings.push(training);
        });
        return Object.values(groupedTrainings);
    };

    const getColor = (index) => {
        const colors = [
            "#FF33C7", "#9333FF", "#BEFF33", "#33FF58", "#33D1FF",
            "#FF5733", "#33FFD1", "#FF3333", "#33FF8C", "#CC33FF",
            "#FFC733", "#33B0FF", "#FF3381", "#33FFD1", "#7A33FF",
            "#FF3333", "#33FF9A", "#FF33C7", "#33FF58", "#336DFF"
        ];
        return colors[index % colors.length];
    };

    useEffect(() => getTrainings(), []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width={1030} height={1000} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <RadialBarChart
                    innerRadius="20%"
                    outerRadius="100%"
                    data={trainings}
                    startAngle={180}
                    endAngle={0}
                >
                    <RadialBar minAngle={15}
                        label={{ fill: '#00000', position: 'middle' }}
                        background clockWise={true}
                        dataKey='durations'
                        fill={(_, index) => getColor(index)} />
                    <Legend
                        iconSize={10}
                        width={120}
                        height={140}
                        layout="vertical"
                        verticalAlign="right"
                        align="right"
                    />
                    <Tooltip />
                </RadialBarChart>
            </ResponsiveContainer>
        </div>
    );
}