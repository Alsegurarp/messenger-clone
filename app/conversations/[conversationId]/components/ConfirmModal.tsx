'use client'
import useConversation from '@/app/hooks/useConversation'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/app/components/Modal'
import { FiAlertTriangle } from 'react-icons/fi'
import { DialogTitle } from '@headlessui/react'
import Button from '@/app/components/inputs/Button'

interface ConfirmModalProps {
  isOpen?: boolean,
  onClose: () => void
  children: React.ReactNode;
}

const ConfirmModel:React.FC<ConfirmModalProps> = ({
  isOpen, onClose
}) => {
  const router = useRouter()
  const {conversationId} = useConversation()
  const [isLoading, setIsLoading] = useState(false); 

  const onDelete = useCallback(() => {
    setIsLoading(true);

    axios.delete(`/api/conversations/${conversationId}`).then(() => {
      onClose();
      router.push('/conversations');
      router.refresh();
    }).catch(() => {
      toast.error('Something went wrong')
    }).finally(() => setIsLoading(false));
  }, [conversationId, router, onClose]);

  return (
    <Modal  onClose={onClose} isOpen={isOpen} >
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <FiAlertTriangle className='h-6 w-6 text-red-600' />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <DialogTitle as='h3' className='text-base font-semibold leading-6 text-gray-900'>
              Delete conversation
            </DialogTitle>
            <div className="mt-2">
              <p className='text-sm text-gray-500'>Are you sure you want to delete this conversation?</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2 sm:mt-4 sm:flex sm:gap-6 sm:flex-row-reverse">
          <Button disabled={isLoading} danger onClick={onDelete}>
            Delete
          </Button>
          
          <Button disabled={isLoading} secondary onClick={onClose}>
            Cancel
          </Button>

        </div>
    </Modal>
  )
}

export default ConfirmModel