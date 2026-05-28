// "use client"
// import { useSignIn, useSignUp } from "@clerk/nextjs"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useRouter } from "next/navigation"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { toast } from "sonner"
// import { OAuthStrategy } from "@clerk/types"
// import { useMutation } from "@tanstack/react-query"
// import { SignInSchema } from "@/app/(auth)/_components/forms/sign-in/schema"
// import { useState } from "react"
// import { SignUpSchema } from "@/app/(auth)/_components/forms/sign-up/schema"
// import { onSignUpUser } from "@/actions/user"


// export const useAuthSignIn = () => {
//   const { isLoaded, setActive, signIn } = useSignIn() as any
//   const router = useRouter()

//   const {
//     register,
//     formState: { errors },
//     reset,
//     handleSubmit,
//   } = useForm<z.infer<typeof SignInSchema>>({
//     resolver: zodResolver(SignInSchema),
//     mode: "onBlur",
//   })

//   const onClerkAuth = async (email: string, password: string) => {
//     if (!signIn)
//       return toast("Error", { description: "Oops! something went wrong" })

//     try {
//       const authenticated = await signIn.create({
//         identifier: email,
//         password,
//       })

//       if (authenticated?.status === "complete") {
//         reset()
//         await setActive({ session: authenticated.createdSessionId })
//         toast("Success", { description: "Welcome back!" })
//         router.push("/callback/sign-in")
//       }
//     } catch (error: any) {
//       const clerkError = error?.errors?.[0]
//       if (clerkError?.code === "form_password_incorrect") {
//         toast("Error", { description: "Email/password is incorrect, try again" })
//       } else {
//         toast("Error", { description: clerkError?.message ?? "An unexpected error occurred" })
//       }
//     }
//   }

//   const { mutate: InitiateLoginFlow, isPending } = useMutation({
//     mutationFn: ({ email, password }: { email: string; password: string }) =>
//       onClerkAuth(email, password),
//   })

//   const onAuthenticateUser = handleSubmit(async (values) => {
//     InitiateLoginFlow({ email: values.email, password: values.password })
//   })

//   return {
//     onAuthenticateUser,
//     isPending,
//     register,
//     errors,
//   }
// }


// export const useAuthSignUp = () => {
//   const { setActive, isLoaded, signUp } = useSignUp() as any
//   const [creating, setCreating] = useState<boolean>(false)
//   const [verifying, setVerifying] = useState<boolean>(false)
//   const [code, setCode] = useState<string>("")
//   const router = useRouter()

//   const {
//     register,
//     formState: { errors },
//     reset,
//     handleSubmit,
//     getValues,
//   } = useForm<z.infer<typeof SignUpSchema>>({
//     resolver: zodResolver(SignUpSchema),
//     mode: "onBlur",
//   })

//   const onGenerateCode = async (email: string, password: string) => {
//     if (!signUp)
//       return toast("Error", { description: "Oops! something went wrong" })

//     if (!email || !password)
//       return toast("Error", { description: "No fields must be empty" })

//     try {
//       await signUp.create({
//         emailAddress: email,
//         password: password,
//       })

//       await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
//       setVerifying(true)
//     } catch (error) {
//       console.error(JSON.stringify(error, null, 2))
//       toast("Error", { description: "Failed to send verification code" })
//     }
//   }

//   const onInitiateUserRegistration = handleSubmit(async (values) => {
//     if (!signUp)
//       return toast("Error", { description: "Oops! something went wrong" })

//     try {
//       setCreating(true)

//       const completeSignUp = await signUp.attemptEmailAddressVerification({ code })

//       if (completeSignUp.status !== "complete") {
//         return toast("Error", { description: "Oops! something went wrong, status incomplete" })
//       }

//       if (!signUp.createdUserId) return

//       const user = await onSignUpUser({
//         firstname: values.firstname,
//         lastname: values.lastname,
//         clerkId: signUp.createdUserId,
//         image: "",
//       })

//       reset()

//       if (user.status === 200) {
//         toast("Success", { description: user.message })
//         await setActive({ session: completeSignUp.createdSessionId })
//         router.push("/group/create")
//       } else {
//         toast("Error", { description: user.message + " action failed" })
//         router.refresh()
//       }
//     } catch (error) {
//       console.error(JSON.stringify(error, null, 2))
//       toast("Error", { description: "An unexpected error occurred" })
//     } finally {
//       setCreating(false)
//       setVerifying(false)
//     }
//   })

//   return {
//     register,
//     errors,
//     onGenerateCode,
//     onInitiateUserRegistration,
//     verifying,
//     creating,
//     code,
//     setCode,
//     getValues,
//   }
// }


// export const useGoogleAuth = () => {
//   // FIX: Clerk v7 uses signIn.sso() instead of authenticateWithRedirect()
//   const { signIn } = useSignIn() as any
//   const { signUp } = useSignUp() as any

//   const signInWith = async (strategy: OAuthStrategy) => {
//     if (!signIn) return
//     try {
//       await signIn.sso({
//         strategy,
//         redirectCallbackUrl: "/callback",
//         redirectUrl: "/callback/sign-in",
//       })
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const signUpWith = async (strategy: OAuthStrategy) => {
//     if (!signUp) return
//     try {
//       await signUp.authenticateWithRedirect({
//         strategy,
//         redirectUrl: "/callback",
//         redirectUrlComplete: "/callback/sign-in",
//       })
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   return { signUpWith, signInWith }
// }