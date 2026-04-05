import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import "./styles.css";

/**
 * TopBar - App-wide header.
 * Props:
 *   context {string}          - Describes what is shown in the main content area.
 *   advancedFeatures {bool}   - Whether advanced features are enabled.
 *   onToggleAdvanced {func}   - Callback to toggle advanced features.
 */
function TopBar({ context, advancedFeatures, onToggleAdvanced }) {
  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side: your name */}
        <Typography variant="h5" color="inherit">
          Your Name
        </Typography>

        {/* Right side: context + advanced features checkbox */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {context ? (
            <Typography variant="h6" color="inherit">
              {context}
            </Typography>
          ) : null}
          <FormControlLabel
            control={
              <Checkbox
                checked={!!advancedFeatures}
                onChange={onToggleAdvanced}
                sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
              />
            }
            label={
              <Typography variant="body2" color="inherit">
                Enable Advanced Features
              </Typography>
            }
          />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
