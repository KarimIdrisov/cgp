import React from 'react';
import FileLayout from "../components/Layout/FileLayout";

export default function FilePage() {
    const file = localStorage.getItem('file')

    return (
        <>
            <FileLayout file={file}>

            </FileLayout>
        </>
    )
}
