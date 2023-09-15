'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import Button from './Button'

type Props = {
    startCursor: string
    endCursor: string
    hasNextPage: boolean
    hasPrevPage: boolean
}
const LoadMore = ({ startCursor, endCursor, hasNextPage, hasPrevPage }: Props) => {
    const router = useRouter()

    const handleNavigation = (type: string) => {
        const currentParams = new URLSearchParams(window.location.search);
        
        if (type === "prev" && hasPrevPage) {
            currentParams.delete("endcursor");
            currentParams.set("startcursor", startCursor);
        } else if (type === "next" && hasNextPage) {
            currentParams.delete("startcursor");
            currentParams.set("endcursor", endCursor);
        }
    
        const newSearchParams = currentParams.toString();
        const newPathname = `${window.location.pathname}?${newSearchParams}`;
    
        router.push(newPathname);
    };

    return (
        <div className='w-full flexCenter gap-5 mt-10'>
            {hasPrevPage &&
                <Button title='Prev Page' handleClick={() => handleNavigation('first')} />}
            {hasNextPage &&
                <Button title='Next' handleClick={() => handleNavigation('next')} />}
        </div>
    )
}

export default LoadMore