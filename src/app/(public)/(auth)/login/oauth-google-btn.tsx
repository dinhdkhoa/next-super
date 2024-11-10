import { Button } from '@/components/ui/button'
import envConfig from '@/config'
import Link from 'next/link'
import React from 'react'

const getOauthGoogleUrl = () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = {
        redirect_uri: envConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
        client_id: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ].join(' ')
    }
    const qs = new URLSearchParams(options)
    return `${rootUrl}?${qs.toString()}`
}
const googleOauthUrl = getOauthGoogleUrl()

function OauthGoogleBtn() {
    return (
        <Link href={getOauthGoogleUrl()}>
            <Button variant="outline" className="w-full" type="button">
                Đăng nhập bằng Google
            </Button>
        </Link>
    )
}

export default OauthGoogleBtn