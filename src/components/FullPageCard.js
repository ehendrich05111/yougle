import { Card, LinearProgress } from "@mui/material";

export default function FullPageCard({ loading, navbar, children, style }) {
  // don't go above a certain height: https://stackoverflow.com/a/19976062
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        padding: "4em 0",
        marginTop: navbar ? "-8em" : "-4em",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "table",
          width: "100%",
          height: "100%",
          marginTop: "4em",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "table-cell", verticalAlign: "middle" }}>
          <Card
            variant="outlined"
            sx={{
              margin: "0 auto",
              paddingX: 5,
              paddingTop: 4,
              paddingBottom: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 1,
              position: "relative",
              opacity: loading ? "0.7" : "1",
              maxWidth: 400,
              maxHeight: 725,
              boxSizing: "border-box",
              borderRadius: "20px",
              ...style,
            }}
          >
            <LinearProgress
              sx={{
                marginX: -5,
                visibility: loading ? "visible" : "hidden",
                opacity: "100%",
              }}
            />
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
}
