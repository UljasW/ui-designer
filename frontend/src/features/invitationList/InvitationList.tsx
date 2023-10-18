import React, { useEffect, useState } from 'react'
import getInvitations from '../../api/collaboration/getInvitations';

export default function InvitationList() {
    const [invitationList, setInvitationList] = useState<any[]>();
    useEffect(() => {
      fetchInvitations();
    }, []);
    async function fetchInvitations() {
      setInvitationList(await getInvitations(localStorage.getItem("jwt") || ""));
      console.log(invitationList);
    }
    return (
      <div>
        {invitationList?.map((invite: any) => {
          return <div>{invite.designName}</div>;
        })}
      </div>
    );
}
