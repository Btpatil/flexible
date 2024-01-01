import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Props = {
    type?: string
    title: string
    placeholder: string
    state: string
    setState: (value: string) => void
}

export const FormRichTextDescription = ({ type, title, placeholder, state, setState, }: Props) => {

  return (
    <div className=" flexStart flex-col w-full gap-4">
    <label className="w-full text-gray-100">
        {title}
    </label>
    <ReactQuill 
    placeholder={placeholder}
    theme="snow" 
    value={state}  
    className="form_field-input"
    onChange={(value) => setState(value)}
        />
</div>
  )
}
