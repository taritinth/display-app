/* eslint-disable react/prop-types */
import { SnackbarContent } from "notistack";
import { forwardRef } from "react";

const NewConnection = forwardRef(function NewConnection(props, ref) {
  const { id, message, user1, user2, ...other } = props;

  return (
    <SnackbarContent ref={ref} role="alert" {...other}>
      <div className="flex items-center text-black bg-white p-3 rounded-xl">
        <div className="relative flex items-center mr-6">
          <img
            src={user1?.avatarUrl}
            alt={user1?.displayName}
            className="z-[2] w-8 h-8 rounded-full"
          />
          <img
            src={user2?.avatarUrl}
            alt={user2?.displayName}
            className="z-[1] w-8 h-8 rounded-full -m-3"
          />
        </div>
        <strong>{user1?.displayName}</strong>&nbsp;connected with&nbsp;
        <strong>{user2?.displayName}</strong>
      </div>
    </SnackbarContent>
  );
});

export default NewConnection;
