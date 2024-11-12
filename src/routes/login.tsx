import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            setError(null);
            const response = await axios.post(
                'http://localhost:3000/api/auth/login',
                data,
                {
                    withCredentials: true,
                },
            );

            if (response.data.user) {
                navigate('/calendar');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message || 'Invalid email or password',
                );
            } else {
                setError('An unexpected error occurred');
            }
            console.error('Login failed:', err);
        }
    };

    return (
        <div className='h-screen w-screen flex items-center justify-center bg-gray-50'>
            <Card className='w-[350px]'>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        {error && (
                            <p className='text-sm text-red-500 text-center'>
                                {error}
                            </p>
                        )}
                        <div className='grid w-full items-center gap-4'>
                            <div className='flex flex-col space-y-1.5'>
                                <Label htmlFor='email'>Email</Label>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='Enter your email'
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className='text-sm text-red-500'>
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <Label htmlFor='password'>Password</Label>
                                <Input
                                    id='password'
                                    type='password'
                                    placeholder='Enter your password'
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className='text-sm text-red-500'>
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            type='submit'
                            className='w-full'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </Button>
                        <p className='text-sm text-gray-500 text-center'>
                            Don't have an account?{' '}
                            <Link
                                to='/signup'
                                className='text-blue-500 hover:underline'
                            >
                                Sign up
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
