import React from "react";
import DesignManager from "../../features/designManager/DesignManager";
import InvitationList from "../../features/invitationList/InvitationList";

export default function home() {
  return (
    <div style={{display:"flex", flexDirection:"row"}}>
      <DesignManager></DesignManager>
    </div>
  );
}
