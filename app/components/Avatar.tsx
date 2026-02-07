import {User} from '../generated/prisma/client'
import React from 'react'
import Image from 'next/image';
import useActiveList from '../hooks/useActiveList';

interface AvatarProps {
    user?: User;
}

const Avatar:React.FC<AvatarProps> = ({
    user
}
) => {
    const {members} = useActiveList();
    const isActive = members.indexOf(user!.email!)!= -1;

  return (
    <div className='relative px-2'>
        <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:w-11 md:h-11">
            <Image 
                alt='Avatar'
                src={user?.image || '/images/placeholder.png'}
                fill 
                />
        </div>
        {isActive && (
            <span className='absolute block rounded-full ring-2 bg-green-500 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3' />
        )}
    </div>
  )
}

export default Avatar;