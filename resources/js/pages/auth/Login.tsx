import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { AppLogo } from '@/components/shared/app-logo';

interface LoginForm {
    username: string;
    password: string;
}

export default function Login() {
    const { data, setData, post, processing, errors } = useForm<LoginForm>({
        username: '',
        password: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Masuk" />
            <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4">
                <section className="w-full rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                    <AppLogo subtitle="Login Kasir" />
                    <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Masuk Kasir</h1>
                    <p className="mt-1 text-sm text-neutral-600">Silakan masuk untuk melanjutkan ke dashboard.</p>

                    <form className="mt-6 space-y-4" onSubmit={submit}>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-800" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={data.username}
                                onChange={(event) => setData('username', event.target.value)}
                                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-neutral-900"
                                autoComplete="username"
                            />
                            {errors.username ? <p className="mt-1 text-xs text-red-600">{errors.username}</p> : null}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-800" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-neutral-900"
                                autoComplete="current-password"
                            />
                            {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={processing}
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>
                </section>
            </main>
        </>
    );
}
