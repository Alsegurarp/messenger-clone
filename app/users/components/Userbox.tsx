'use client'
import React, { useCallback, useState } from 'react'

import { User } from '../../generated/prisma/client'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Avatar from '@/app/components/Avatar';
import LoadingModal from '@/app/components/LoadingModal';

interface UserboxProps {
    data: User;
}


const Userbox:React.FC<UserboxProps> = ({
    data
}) => {
    const router = useRouter();
    const [isLoading, setIsloading] = useState(false);

    const handleClick = useCallback(() => {
        setIsloading(true);

        axios.post('/api/conversations', {
            userId: data.id
        }).then(
            (data) => {
                router.push(`/conversations/${data.data.id}`)
            }
        ).finally(() => {
            setIsloading(false);
        })
    }, [data, router])
  return (
    <>
    {isLoading && (
        <LoadingModal />
    )}
    
    <div onClick={handleClick} className="w-full relative flex items-center space-x-3 bg-white py-3 hover:bg-neutral-200 rounded-lg transition cursor-pointer">
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
            <div className="focus:outline-none">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-900">
                        {data.name}
                    </p>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Userbox;