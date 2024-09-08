"use client";

import React, { ReactNode } from 'react'

export function ContextProvider({
  children
}: {
  children: ReactNode
}) {
  return (
    <>
      {children}
    </>


  )
}