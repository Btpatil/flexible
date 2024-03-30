'use client'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Button from './Button'

type Props = {
    // startCursor: string
    // endCursor: string
    hasNextPage: boolean
    hasPrevPage: boolean
}
const LoadMore = ({  hasNextPage, hasPrevPage }: Props) => {
    const router = useRouter()
    const params = useSearchParams()
    const [number, setnumber] = useState(() => 2)
    useEffect(() => {
        if (!params.get('nextPage') && number !== 2) {
            setnumber(prev => 2);
        }
        // else {
        //     console.log(params.get('nextPage'), number, parseInt(params.get('nextPage')!) == number)
        // }
    }, [params.get('nextPage')])

    const changePageNumber = () => {
        setnumber((prev) => {
            console.log(params.get('nextPage'), count)
            prev = count
            return prev
        })
        const count = parseInt(params.get('nextPage')!) + 1
        return count
    }

    const prevPageNum = () => {
        setnumber((prev) => {
            console.log(params.get('nextPage'), count)
            prev = count
            return prev
        })
        const count = parseInt(params.get('nextPage')!) - 1
        return count
    }

    const handleNavigation = (type: string) => {
        const currentParams = new URLSearchParams(window.location.search);

        if (type === "prev" && hasPrevPage) {
            const num = prevPageNum()
            currentParams.delete("nextPage");
            currentParams.set("nextPage", num.toString());
            // currentParams.delete("endcursor");
            // currentParams.set("startcursor", startCursor);
        } else if (type === "next" && hasNextPage) {
            if (params.get('nextPage')) {
                const num = changePageNumber()
                currentParams.delete("nextPage");
                currentParams.set("nextPage", num.toString());
            } else {
                currentParams.delete("nextPage");
                currentParams.set("nextPage", number.toString());
            }
        }

        const newSearchParams = currentParams.toString();
        const newPathname = `${window.location.pathname}?${newSearchParams}`;

        router.push(newPathname, { scroll: false });
    };

    return (
        <div className='w-full flexCenter gap-5 mt-10'>
            {hasPrevPage &&
                <Button title='Prev Page' handleClick={() => handleNavigation('prev')} />}
            {hasNextPage &&
                <Button title='Next Page' handleClick={() => handleNavigation('next')} />}
        </div>
    )
}

export default LoadMore