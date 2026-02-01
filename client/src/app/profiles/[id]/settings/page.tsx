"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  Divider,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useSession } from "next-auth/react";

import DeleteAccountModal from "@/components/DeleteAccountModal";
import { updateUser } from "@/lib/actions/user";

import type { User } from "next-auth";

function EditField({
  label,
  value,
  defaultValue,
  onChange,
  onCancel,
}: {
  label: string;
  value?: string;
  defaultValue?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}) {
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

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [editedUsername, setEditedUsername] = useState(user?.name || "");
  const [editedEmail, setEditedEmail] = useState(user?.email || "");
  const [editedPassword, setEditedPassword] = useState<string | undefined>(undefined);
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(session?.user); // TODO: Fix this later
    setEditedUsername(user?.name || "");
    setEditedEmail(user?.email || "");
  }, [session, user]);

  const saveChangesDisabled =
    editedUsername.length === 0 ||
    editedEmail.length === 0 ||
    editedPassword?.length === 0 ||
    (editedUsername === user?.name && editedEmail === user?.email && editedPassword === undefined);

  const saveChanges = () => {
    setLoading(true);

    const fieldsToUpdate = {
      username: editedUsername !== user?.name ? editedUsername : undefined,
      email: editedEmail !== user?.email ? editedEmail : undefined,
      password: editedPassword ? editedPassword : undefined,
    };

    updateUser(fieldsToUpdate)
      .then(() => {
        setAlertOpen(true);
        setTimeout(() => window.location.reload(), 3000);
      })
      .then(() => update({ name: editedUsername }))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Snackbar
        open={alertOpen}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          Changes saved successfully
        </Alert>
      </Snackbar>

      <Box className="flex flex-col">
        <Box className="flex flex-col gap-8 bg-slate-50 px-24 py-8">
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>
            Settings
          </Typography>
          <Box className="flex flex-row items-center gap-4">
            <Avatar alt="profile" src={user?.image || ""} className="size-28">
              {user?.name ? user.name[0] : ""}
            </Avatar>
            <Box>
              <Typography variant="h4">{user?.name}</Typography>
              <Typography variant="body1">{user?.email}</Typography>
            </Box>
          </Box>

          <Box className="flex flex-row gap-2">
            <DeleteAccountModal />
          </Box>
        </Box>

        <Divider />

        <Box className="mx-16 my-4 flex max-w-[500px] flex-col gap-4 p-10">
          <EditField
            label="Username"
            value={editedUsername}
            onChange={(event) => setEditedUsername(event.target.value)}
            onCancel={() => setEditedUsername(user?.name || "")}
          />
          <EditField
            label="Email"
            value={editedEmail}
            onChange={(event) => setEditedEmail(event.target.value)}
            onCancel={() => setEditedEmail(user?.email || "")}
          />
          <EditField
            label="Password"
            defaultValue="***************"
            value={editedPassword}
            onChange={(event) => setEditedPassword(event.target.value)}
            onCancel={() => setEditedPassword(undefined)}
          />

          <Box className="flex flex-row justify-end gap-2">
            <Button
              size="small"
              variant="contained"
              color="primary"
              disabled={saveChangesDisabled}
              onClick={() => saveChanges()}
              loading={loading}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
