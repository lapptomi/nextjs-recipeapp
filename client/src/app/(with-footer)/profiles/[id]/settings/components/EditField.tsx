"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";

import { Box } from "@mui/system";
import { Button, TextField } from "@mui/material";

interface EditFieldProps {
  label: string;
  value?: string;
  defaultValue?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

export default function EditField({
  label,
  value,
  defaultValue,
  onChange,
  onCancel,
}: EditFieldProps) {
  const [edit, setEdit] = useState(false);

  return (
    <Box className="flex flex-row justify-between gap-2">
      <TextField
        fullWidth
        variant="standard"
        label={label || ""}
        value={value}
        disabled={!edit}
        onChange={onChange}
        defaultValue={defaultValue}
      />
      <Button
        color="secondary"
        variant="text"
        size="small"
        onClick={() => {
          setEdit(!edit);
          onCancel();
        }}
      >
        {edit ? "Cancel" : "Edit"}
      </Button>
    </Box>
  );
}
