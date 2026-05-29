import { UseMutateFunction } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FieldValues } from 'react-hook-form'
import { z, ZodSchema } from 'zod'

const useZodForm = (
    schema: ZodSchema,
    mutation: UseMutateFunction,
    defaultValues?: any
) => {
    const {
        register,
        watch,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema as any),
        defaultValues: {...defaultValues,}
    })

    const onFormSubmit = handleSubmit(async (values) => mutation({ ...values }))

    return { register, watch, reset, onFormSubmit, errors }
}

export default useZodForm