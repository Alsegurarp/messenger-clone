'use client'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import React, { Fragment } from 'react'
import { IoClose } from 'react-icons/io5';

interface ModalProps {
    isOpen?: boolean,
    onClose: () => void,
    children: React.ReactNode;
}


const Modal:React.FC<ModalProps> = ({
    isOpen = false, children, onClose
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={onClose}>
            <TransitionChild as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0' enterTo='opacity-100' leave='ease-in duration-200' leaveFrom='opacity-100' leaveTo='opacity-0'>
                <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
            </TransitionChild>
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0 scale-95' enterTo='opacity-100 scale-100' leave='ease-in duration-200' leaveFrom='opacity-100 scale-100' leaveTo='opacity-0 scale-95'>
                        <DialogPanel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 text-left shadow-xl transition-all w-full max-w-lg p-6'>
                            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block z-10">
                                <button className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2" type='button' onClick={onClose}>
                                    <span className="sr-only">Close</span>
                                    <IoClose className='h-6 w-6' />
                                </button>
                            </div>
                            {children}
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </Transition>
  )
}

export default Modal