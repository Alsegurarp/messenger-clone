'use client';
import React, { useCallback, useState, useEffect } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import toast from 'react-hot-toast';
import {signIn, useSession} from "next-auth/react";
import AuthSocialButton from './AuthSocialButton';
import Button from '@/app/components/inputs/Button';
import Input from '@/app/components/inputs/Input';
import { useRouter } from 'next/navigation';




type Variant = 'LOGIN' | 'REGISTER';
// This is to define the posibilities of the useState 'variant'

export default function AuthForm() {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);
    // this state is to disable our buttons once we have submitted our form

    useEffect(() => {
        if(session?.status == 'authenticated') {
            router.push('/users')
        }
    }, [session?.status, router]);
    
    // to change the variant depending on the current state of the variant
    const toggleVariant = useCallback(() => {
        if(variant == 'LOGIN') {
            setVariant('REGISTER');
        } else {
            setVariant('LOGIN');
        }
    }, [variant]);
    
    // To create the react form

    // inside {} we extract functions for the Form
    const  {
        register, 
        handleSubmit, 
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    });
    // we declare the default values

    const onSubmit : SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if(variant === 'REGISTER') {
                axios.post('/api/register', data).then(() => signIn('credentials', data)).catch(() => toast.error('Error in REGISTER block, in authForm')).finally(() => setIsLoading(false));
            
        }

        if(variant === 'LOGIN') {
            // we must declare which method- previously, we declared 'credentials', 'google' & 'github'
            signIn('credentials', {
                ...data,
                redirect: false
            }).then((callback) => {
                if(callback?.error) {
                    toast.error('invalid credentials')
                }
                if(callback?.ok && !callback?.error){
                    toast.success('logged in!')
                    router.push('/users')
                }
            }).finally(() => setIsLoading(false))
        }
    };

    const socialAction = (action: string) => {
        setIsLoading(true);

        // NextAuth social sign-in
        signIn(action, {redirect: false}).then((callback) => {
            if(callback?.error){
                toast.error('Invalid credentials')
            }
            if(callback?.ok && !callback?.error){
                    toast.success('logged in!')
                    router.push('/users')
                }
        }).finally(() => setIsLoading(false))
    }


    
    
    return (
        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
            <div className="bg-white px-4 py-8 shadow rounded-lg sm:px-10">
                <form 
                    className='space-y-6' 
                    onSubmit={handleSubmit(onSubmit)}>
                    {variant === 'REGISTER' && (
                        <Input 
                            id='name' 
                            label='Name' 
                            register={register}
                            errors={errors}
                        />
                    )}
                    <Input 
                            id='email' 
                            label='Email address'
                            type='email' 
                            register={register}
                            errors={errors}
                        />
                    <Input 
                            id='password' 
                            label='Password'
                            type='password' 
                            register={register}
                            errors={errors}
                        />
                    <div className="">
                        <Button
                            disabled={isLoading}
                            fullWidth
                            type='submit'
                                >
                            {variant === 'LOGIN' ? 'Sign in' : 'Register'}
                        </Button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm ">
                            <span className='bg-white px-2 text-gray-500'>
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton 
                            onClick={() => socialAction('github')} 
                            icon={BsGithub}/>
                        <AuthSocialButton 
                            onClick={() => socialAction('google')} 
                            icon={BsGoogle}/>
                    </div>
                </div>
                
                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                    <div className="">
                        {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account' }
                    </div>
                    <div className="underline cursor-pointer" onClick={toggleVariant}>
                    {variant === 'LOGIN' ? 'Create an account' : 'Login'}
                    </div>
                </div>
            </div>
        </div>
    )
}
