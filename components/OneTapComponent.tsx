'use client'

import Script from 'next/script'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image';
// Type definitions for Google One Tap
type CredentialResponse = {
  credential: string;
  select_by: string;
};

type accounts = {
  id: {
    initialize: (options: {
      client_id: string | undefined;
      callback: (response: CredentialResponse) => void;
      nonce: string;
      use_fedcm_for_prompt?: boolean;
    }) => void;
    prompt: () => void;
  };
};
import { useRouter } from 'next/navigation'

declare const google: { accounts: accounts }

// generate nonce to use for google id token sign-in
const generateNonce = async (): Promise<string[]> => {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
  const encoder = new TextEncoder()
  const encodedNonce = encoder.encode(nonce)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return [nonce, hashedNonce]
}

const OneTapComponent = () => {
  const supabase = createClient()
  const router = useRouter()

  const initializeGoogleOneTap = async () => {
    console.log('Initializing Google One Tap')
    const [nonce, hashedNonce] = await generateNonce()
    console.log('Nonce: ', nonce, hashedNonce)

    // check if there's already an existing session before initializing the one-tap UI
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error getting session', error)
    }
    if (data.session) {
      router.push('/')
      return
    }

    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '994135179137-u7k8p20ssilpqvcms43rgfr114gde1rr.apps.googleusercontent.com',
      callback: async (response: CredentialResponse) => {
        try {
          // send id token returned in response.credential to supabase
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
            nonce,
          })

          if (error) throw error
          console.log('Session data: ', data)
          console.log('Successfully logged in with Google One Tap')

          // redirect to protected page
          router.push('/')
        } catch (error) {
          console.error('Error logging in with Google One Tap', error)
        }
      },
      nonce: hashedNonce,
      // with chrome's removal of third-party cookies, we need to use FedCM instead (https://developers.google.com/identity/gsi/web/guides/fedcm-migration)
      use_fedcm_for_prompt: true,
    })
    google.accounts.id.prompt() // Display the One Tap UI
  }

  return <>
  <button
                className="cursor-pointer flex items-center gap-2 px-5 py-2 border border-black rounded-full shadow-sm hover:bg-gray-100 transition duration-200"
                onClick={() => initializeGoogleOneTap()}
              >
                <Image src="/google.svg" alt="Google" width={20} height={20} />
                <span className="text-sm font-medium">Sign in with Google</span>
              </button>
<Script onReady={() => { initializeGoogleOneTap() }} src="https://accounts.google.com/gsi/client" />
    </>

}

export default OneTapComponent