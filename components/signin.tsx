'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { signIn } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function SignIn() {
    return (
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle className="text-2xl md:text-3xl">Sign In</CardTitle>
                <CardDescription className="text-md md:text-lg">
                    Select your preferred provider to sign in
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div
                        className={cn(
                            'w-full gap-4 flex items-center',
                            'justify-center flex-row',
                            'text-md md:text-lg',
                        )}
                    >
                        <Button
                            variant="secondary"
                            className={cn('h-16 w-16 rounded-full')}
                            onClick={async () => {
                                await signIn.social({
                                    provider: 'google',
                                    callbackURL: '/dashboard',
                                })
                            }}
                        >
                            <Image src="/google.png" alt="Google" width={32} height={32} />
                        </Button>
                        <Button
                            variant="secondary"
                            className={cn('h-16 w-16 rounded-full')}
                            onClick={async () => {
                                await signIn.social({
                                    provider: 'github',
                                    callbackURL: '/dashboard',
                                })
                            }}
                        >
                            <Image src="/github.png" alt="GitHub" width={32} height={32} />
                        </Button>
                        <Button
                            variant="secondary"
                            className={cn('h-16 w-16 rounded-full')}
                            onClick={async () => {
                                await signIn.social({
                                    provider: 'discord',
                                    callbackURL: '/dashboard',
                                })
                            }}
                        >
                            <Image src="/discord.png" alt="Discord" width={32} height={32} />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
