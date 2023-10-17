import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function Variants() {
  return (
    <div>
      <Stack spacing={1}>
        {/* For variant="text", adjust the height via font-size */}
        <Skeleton variant="rounded" height={60} animation="wave" />

        <Skeleton variant="rounded" height={220} animation="wave" />
        <Skeleton variant="rounded" height={220} animation="wave" />
      </Stack>
    </div>
  );
}
