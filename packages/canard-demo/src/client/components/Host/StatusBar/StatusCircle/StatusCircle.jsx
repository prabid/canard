import React from "react";

const StatusCircle = (props) =>(
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill={props.fill} className={props.class} style={{ height: "100%" }}>
    <circle cx="50" cy="50" r="50"/>
  </svg>
) 

export default StatusCircle;