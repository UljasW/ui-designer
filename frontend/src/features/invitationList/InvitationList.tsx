import React, { useEffect, useState } from 'react'
import getInvitations from '../../api/collaboration/getInvitations';

export default function invitationList() {
    const [invitationList, setInvitationList] = useState<any[]>();
    useEffect(() => {
      fetchInvitations();
      return () => {
        console.log("Invitation List Unmounted");
      };
    }, []);
    async function fetchInvitations() {
      setInvitationList(await getInvitations(localStorage.getItem("jwt") || ""));
    }
    return (
      <div>
        {invitationList?.map((invite: any) => {
          return <div>{invite.designName}</div>;
        })}
      </div>
    );
}
