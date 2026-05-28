import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'


const AuthCallbackPage = async () => {
  //Authentication
  const auth = await onAuthenticateUser()

  console.log("AUTH RESULT:", auth)
  if (auth.status === 200 || auth.status === 201) {
    return redirect(`/dashboard/${auth.user?.workspace[0].id}`)
  }

  if (auth.status === 403 || auth.status === 400 || auth.status === 500) {
    return redirect('/sign-in')
  }
}

export default AuthCallbackPage