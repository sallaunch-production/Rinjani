"use client";
import React, { useState, useEffect } from "react";

export default function DateTime() {
  const [date, setDate] = useState<Date>(new Date());
  useEffect(() => {
    const update = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return function cleanUp() {
      clearInterval(update);
    };
  });

  return (
    <>
      {date.toLocaleDateString()} {date.toLocaleTimeString()}
    </>
  );
}