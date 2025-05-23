import { Box, Grid, IconButton } from "@mui/material";
import React from "react";
import Brightness1Icon from "@mui/icons-material/Brightness1";
export default function Road({
  top,
  right,
  horizontal,
  open,
  crossWalkOpen,
  crossWalkDisabled,
  handleCrosswalkPress,
}) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: open ? "#417C1D" : "#999999",
        position: "relative",
      }}
    >
      {/* line on road */}
      <div
        style={{
          height: horizontal ? "unset" : "100%",
          width: horizontal ? "100%" : "unset",
          position: "absolute",
          left: horizontal ? 0 : "50%",
          top: horizontal ? "50%" : 0,
          borderLeft: horizontal ? 0 : "0.5px dotted #fff",
          borderTop: horizontal ? "0.5px dotted #fff" : 0,

          //rotate: horizontal ? "unset" : "90deg",
        }}
      />
      {/* crosswalk */}
      <div
        style={{
          width: horizontal ? "40px" : "100%",
          height: horizontal ? "100%" : "40px",
          position: "absolute",
          bottom: horizontal ? 0 : top ? "6px" : "unset",
          top: horizontal ? 0 : top ? "unset" : "6px",
          right: !horizontal ? 0 : right ? "unset" : "6px",
          left: !horizontal ? 0 : right ? "6px" : "unset",
        }}
      >
        {crossWalkOpen ? (
          <div
            style={{ width: "100%", height: "100%", background: "#417C1D" }}
          />
        ) : (
          <img
            src={horizontal ? "/crosswalk-vertical.png" : "/crosswalk.png"}
            alt='cross-walk'
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>

      {/* crosswalk buttom */}
      <div
        style={{
          position: "absolute",
          left: horizontal
            ? right
              ? "6px"
              : "unset"
            : top
            ? "unset"
            : "-25px",
          right: horizontal
            ? right
              ? "unset"
              : "6px"
            : top
            ? "-25px"
            : "unset",
          top: horizontal ? (right ? "unset" : "-30px") : top ? "unset" : "6px",
          bottom: horizontal
            ? right
              ? "-25px"
              : "unset"
            : top
            ? "6px"
            : "unset",
        }}
      >
        <IconButton
          style={{ padding: 0, background: "transparent" }}
          onClick={handleCrosswalkPress}
          disabled={crossWalkDisabled}
        >
          <Brightness1Icon
            style={{
              color: crossWalkDisabled ? "orange" : "red",
              fontSize: "40px",
            }}
          />
        </IconButton>
      </div>
    </Box>
  );
}
