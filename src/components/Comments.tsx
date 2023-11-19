import React from "react";

import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import Link from "next/link";

import type { RecipeComment, User } from "@prisma/client";


interface Props {
  comments: Array<RecipeComment & { author: User }>;
}

const Comments = async ({ comments }: Props) => {

  return (
    <List style={{ display: 'flex', flexDirection: 'column', width: '100%', background: 'white' }}>
      <Divider>
        <Typography variant="body1">{comments.length} COMMENTS</Typography>
      </Divider>
      {comments.map((comment, index) => (
        <ListItem key={index} style={{
          background: '#f9f9f9',
          borderRadius: 5,
          margin: '10px 0px 10px 0px',
          padding: 10
        }}>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant='body1'>
                <Link href={`/profiles/${comment.authorId}`}>
                  {comment.author.username}
                </Link>
              </Typography>
            }
            secondary={comment.message}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default Comments;