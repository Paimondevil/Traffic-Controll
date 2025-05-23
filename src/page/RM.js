import React, {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function RM() {
    const [activeRoad, setActiveRoad] = useState("");
    const [currentTime, setCurrentTime] = useState(-1);
    const [road1, setRoad1] = useState({period: 4, totalExecTime: 1, remainingExecTime: 1, releaseTime: 0, initialPeriod: 4});
    const [road2, setRoad2] = useState({period: 5, totalExecTime: 1, remainingExecTime: 1, releaseTime: 0, initialPeriod: 5});
    const [road3, setRoad3] = useState({period: 10, totalExecTime: 2, remainingExecTime: 2, releaseTime: 0, initialPeriod: 10});
    const [road4, setRoad4] = useState({period: 20, totalExecTime: 4, remainingExecTime: 4, releaseTime: 0, initialPeriod: 20});

    useEffect(() => {
        const originalRoads = [
          { id: 0, stateSetter: setRoad1, ...road1 },
          { id: 1, stateSetter: setRoad2, ...road2},
          { id: 2, stateSetter: setRoad3, ...road3 },
          { id: 3, stateSetter: setRoad4, ...road4},
        ];
    
        const scheduler = setInterval(() => {
            // Increment current time
            setCurrentTime((prevTime) => {
                const newTime = prevTime + 1;

                // Use a local representation of the roads
                let updatedRoads = [
                    { id: 0, state: road1 },
                    { id: 1, state: road2 },
                    { id: 2, state: road3 },
                    { id: 3, state: road4 },
                ];

                // Update task states locally if their period matches the current time
                updatedRoads = updatedRoads.map((task) => {
                    if (newTime === task.state.period) {
                        return {
                            ...task,
                            state: {
                                ...task.state,
                                remainingExecTime: task.state.totalExecTime, // Reset execution time
                                releaseTime: task.state.period, // Update release time
                                period: task.state.period + task.state.initialPeriod, // Update to next period
                            },
                        };
                    }
                    return task;
                });

                // Filter tasks based on release time and sort by priority (period)
                const tasks = updatedRoads
                    .filter(
                        (task) =>
                            task.state.releaseTime <= newTime &&
                            task.state.remainingExecTime > 0
                    )
                    .sort((a, b) => {
                        if (a.state.period === b.state.period) {
                            // If periods are the same, prioritize by lower execution time
                            return a.state.remainingExecTime - b.state.remainingExecTime;
                        }
                        // Otherwise, prioritize by lower period
                        return a.state.period - b.state.period;
                    });

                // Determine the highest-priority task
                let nextActiveRoad = "None";
                if (tasks.length > 0) {
                    const nextTask = tasks[0]; // Highest priority task
                    nextActiveRoad = nextTask.id;

                    // Execute the task locally by decrementing its remaining execution time
                    updatedRoads = updatedRoads.map((task) =>
                        task.id === nextTask.id
                            ? {
                                ...task,
                                state: {
                                    ...task.state,
                                    remainingExecTime: task.state.remainingExecTime - 1,
                                },
                            }
                            : task
                    );
                }

                // Apply updates to state variables in a batch
                updatedRoads.forEach((task) => {
                    const { id, state } = task;
                    switch (id) {
                        case 0:
                            setRoad1(state);
                            break;
                        case 1:
                            setRoad2(state);
                            break;
                        case 2:
                            setRoad3(state);
                            break;
                        case 3:
                            setRoad4(state);
                            break;
                        default:
                            break;
                    }
                });

                // Set the active road
                setActiveRoad(nextActiveRoad);

                // Return the new time to ensure `currentTime` is updated correctly
                return newTime;
            });
        }, 2500); // Update every second
    
        return () => {
          clearInterval(scheduler);
        };
      }, [road1, road2, road3, road4]);

    return (
        <>
             <div className="meta">
                <div className="time">
                    <h2>Rate Monotonic Algorithm</h2>
                    <h1>Current Time: {currentTime}</h1>
                    <h2>Active Road: {activeRoad + 1}</h2>
                    <Link to="/">Back to Round Robin Schedule</Link>
                </div>
                <div className="info">
                    <h3>Road Details:</h3>
                    <table className="road-table">
                        <thead>
                            <tr>
                                <th>Road</th>
                                <th>Period</th>
                                <th>Remaining Exec Time</th>
                                <th>Release Time</th>
                                <th>Total Exec Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Road 1</td>
                                <td>{road1.period}</td>
                                <td>{road1.remainingExecTime}</td>
                                <td>{road1.releaseTime}</td>
                                <td>{road1.totalExecTime}</td>
                            </tr>
                            <tr>
                                <td>Road 2</td>
                                <td>{road2.period}</td>
                                <td>{road2.remainingExecTime}</td>
                                <td>{road2.releaseTime}</td>
                                <td>{road2.totalExecTime}</td>
                            </tr>
                            <tr>
                                <td>Road 3</td>
                                <td>{road3.period}</td>
                                <td>{road3.remainingExecTime}</td>
                                <td>{road3.releaseTime}</td>
                                <td>{road3.totalExecTime}</td>
                            </tr>
                            <tr>
                                <td>Road 4</td>
                                <td>{road4.period}</td>
                                <td>{road4.remainingExecTime}</td>
                                <td>{road4.releaseTime}</td>
                                <td>{road4.totalExecTime}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="grid">
                <div className={`light light1 ${(activeRoad + 1) == 1 ? "green" : "red"}`}></div>
                <div className={`road road1 ${(activeRoad + 1) == 1 ? "greenroad" : ""}`}>
                    <div className="crosswalk"></div>
                </div>
                <div className={`light light2 ${(activeRoad + 1) == 2 ? "green" : "red"}`}></div>
                <div className={`road road2 ${(activeRoad + 1) == 2 ? "greenroad" : ""}`}>
                    <div className="crosswalk"></div>
                </div>
                <div className={`light light3 ${(activeRoad + 1) == 3 ? "green" : "red"}`}></div>
                <div className={`road road3 ${(activeRoad + 1) == 3 ? "greenroad" : ""}`}>
                    <div className="crosswalk"></div>
                </div>
                <div className={`light light4 ${(activeRoad + 1) == 4 ? "green" : "red"}`}></div>
                <div className={`road road4 ${(activeRoad + 1) == 4  ? "greenroad" : ""}`}>
                    <div className="crosswalk"></div>
                </div>
                <div className="road middle"></div>
            </div>
        </>
    )
}