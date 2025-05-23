import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import {
  Box,
  Button,
  Container,
  Grid,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Road from "../component/Road";

const scheduleSeconds = 5;
const crosswalkSeconds = 5;
const emergencyModeSeconds = 5;

export default function RoundRobin() {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("md"));
  const matchesXS = useMediaQuery(theme.breakpoints.down("sm"));
  const roadSize = matchesXS ? "100px" : matchesSM ? "150px" : "200px";
  const [emergencyMenu, setEmergencyMenu] = React.useState(null);
  const [currentRoad, setCurrentRoad] = useState(1);
  const [crossWalkOpen, setCrossWalkOpen] = useState({
    open: false,
    roadNumber: -1,
  });

  const [emergencyMode, setEmergencyMode] = useState({
    open: false,
    roadNumber: -1,
  });
  const [roadTimer, setRoadTimer] = useState(null);

  // Function to switch to the next road
  const switchRoad = (emergencySwitched = false) => {
    setRoadTimer(
      //after n second it will add 1 to current road
      setTimeout(() => {
        //if emergency switch happened we wont increament road number and start from where it is closed
        if (emergencySwitched) {
          switchRoad();
        } else {
          //we are using mod so we are back to road 1 when road 4 done 4 mod 4=0
          setCurrentRoad((currentRoad % 4) + 1);
        }
      }, scheduleSeconds * 1000)
    );
  };
  React.useEffect(() => {
    //if no crosswalk and emergency open and simply add road
    if (crossWalkOpen.roadNumber === -1 && emergencyMode.roadNumber === -1) {
      // Start the road switch function
      switchRoad();
    } else {
      //else crossWalkOpen is open, we wont switch to next road and open crosswalk
      clearTimeout(roadTimer);

      setCrossWalkOpen((c) => {
        return {
          ...c,
          open: true,
        };
      });
      // After `n` seconds, close the crosswalk
      setTimeout(() => {
        setCrossWalkOpen({ open: false, roadNumber: -1 });

        // Resume road scheduling if emergency mode not activated during cross walk open
        if (emergencyMode.roadNumber === -1) {
          switchRoad(); // Call the function to resume road scheduling
        }
      }, crosswalkSeconds * 1000);
    }
    return () => clearTimeout(roadTimer);
  }, [currentRoad, setCurrentRoad]);

  //this will run exactly when exergency mode is on and crosswalk switch to off
  useEffect(() => {
    //means emergencyMode activated when crossWalkOpen off
    if (emergencyMode.roadNumber !== -1) {
      setEmergencyMode((c) => {
        return {
          ...c,
          open: true,
        };
      });

      setTimeout(() => {
        setEmergencyMode({ open: false, roadNumber: -1 });
        // Resume road scheduling
        switchRoad(true); // Call the function to resume road scheduling
      }, emergencyModeSeconds * 1000);
    }
  }, [crossWalkOpen.roadNumber]);

  const handleCrosswalkPress = (roadNumber) => {
    setCrossWalkOpen({
      open: false,
      roadNumber: roadNumber,
    });
  };
  const emergencyClickHandler = (roadNumber) => {
    setEmergencyMenu(null);
    //first we need to check if crosswalk is on so we can wait to finish it
    if (crossWalkOpen.roadNumber !== -1) {
      //means crosswalk on
      setEmergencyMode({
        open: false,
        roadNumber: roadNumber,
      });
    } else {
      //road scheduling running
      clearTimeout(roadTimer);
      setEmergencyMode({
        open: true,
        roadNumber: roadNumber,
      });
      setTimeout(() => {
        setEmergencyMode({ open: false, roadNumber: -1 });
        // Resume road scheduling
        switchRoad(); // Call the function to resume road scheduling
      }, emergencyModeSeconds * 1000);
    }
  };

  const renderEmergencyMenu = (
    <Menu
      id='basic-menu'
      anchorEl={emergencyMenu}
      open={Boolean(emergencyMenu)}
      onClose={() => setEmergencyMenu(null)}
      MenuListProps={{
        "aria-labelledby": "basic-button",
        sx: { width: emergencyMenu && emergencyMenu.offsetWidth }, // <-- The line that does all
      }}
    >
      <MenuItem onClick={() => emergencyClickHandler(1)}>Road 1</MenuItem>
      <MenuItem onClick={() => emergencyClickHandler(2)}>Road 2</MenuItem>
      <MenuItem onClick={() => emergencyClickHandler(3)}>Road 3</MenuItem>
      <MenuItem onClick={() => emergencyClickHandler(4)}>Road 4</MenuItem>
    </Menu>
  );
  return (
    <>
    <Link to="/rm" className="rm-link"> To Rate Monotonic Schedule</Link>
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            background: "#CCCCCC",
            height: { md: "80%", sm: "90%", xs: "95%" },
            width: { md: "80%", sm: "90%", xs: "95%" },
            position: "relative",
          }}
        >
          {renderEmergencyMenu}
          <Button
            variant='contained'
            disabled={emergencyMode.roadNumber !== -1}
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              boxShadow: "none",
              borderRadius: 0,
              border: "2px solid #000",
              color: "#000",
              background: "#FAFD54",
              textTransform: "none",
              fontSize: "24px",
            }}
            id='basic-button'
            aria-controls={Boolean(emergencyMenu) ? "basic-menu" : undefined}
            aria-haspopup='true'
            aria-expanded={Boolean(emergencyMenu) ? "true" : undefined}
            onClick={(e) => setEmergencyMenu(e.currentTarget)}
          >
            Emergency
          </Button>
          <Grid container direction='column' sx={{ height: "100%" }}>
            {/* vertical road */}
            <Grid item sx={{ flex: 1 }}>
              <Grid container justifyContent='center' sx={{ height: "100%" }}>
                <Grid item sx={{ width: roadSize }}>
                  <Road
                    top
                    open={
                      emergencyMode.open
                        ? emergencyMode.roadNumber === 1
                        : currentRoad === 1 && !crossWalkOpen.open
                    }
                    crossWalkOpen={
                      crossWalkOpen.open && crossWalkOpen.roadNumber === 1
                    }
                    crossWalkDisabled={crossWalkOpen.roadNumber !== -1}
                    handleCrosswalkPress={() => handleCrosswalkPress(1)}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* horizontal road */}
            <Grid item sx={{ height: roadSize }}>
              <Grid container justifyContent='center' sx={{ height: "100%" }}>
                <Grid item sx={{ flex: 1 }}>
                  <Road
                    horizontal
                    left
                    open={
                      emergencyMode.open
                        ? emergencyMode.roadNumber === 4
                        : currentRoad === 4 && !crossWalkOpen.open
                    }
                    crossWalkOpen={
                      crossWalkOpen.open && crossWalkOpen.roadNumber === 4
                    }
                    crossWalkDisabled={crossWalkOpen.roadNumber !== -1}
                    handleCrosswalkPress={() => handleCrosswalkPress(4)}
                  />
                </Grid>
                <Grid item sx={{ width: roadSize, background: "#999999" }} />
                <Grid item sx={{ flex: 1 }}>
                  <Road
                    horizontal
                    right
                    open={
                      emergencyMode.open
                        ? emergencyMode.roadNumber === 2
                        : currentRoad === 2 && !crossWalkOpen.open
                    }
                    crossWalkOpen={
                      crossWalkOpen.open && crossWalkOpen.roadNumber === 2
                    }
                    crossWalkDisabled={crossWalkOpen.roadNumber !== -1}
                    handleCrosswalkPress={() => handleCrosswalkPress(2)}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* vertical road */}
            <Grid item sx={{ flex: 1 }}>
              <Grid container justifyContent='center' sx={{ height: "100%" }}>
                <Grid item sx={{ width: roadSize }}>
                  <Road
                    bottom
                    open={
                      emergencyMode.open
                        ? emergencyMode.roadNumber === 3
                        : currentRoad === 3 && !crossWalkOpen.open
                    }
                    crossWalkOpen={
                      crossWalkOpen.open && crossWalkOpen.roadNumber === 3
                    }
                    crossWalkDisabled={crossWalkOpen.roadNumber !== -1}
                    handleCrosswalkPress={() => handleCrosswalkPress(3)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
