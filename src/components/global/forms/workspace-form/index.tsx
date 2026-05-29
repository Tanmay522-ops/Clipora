import { useCreateWorkspace } from '@/hooks/useCreateWorkspace'
import React from 'react'
import { FormGenerator } from '../../form-generator'
import { Button } from '@/components/ui/button'
import Loader from '../../loader'

type Props = {}

const WorkspaceForm = (props: Props) => {
    const { errors, isPending, onFormSubmit, register } =
        useCreateWorkspace()

    return (
        <form
            onSubmit={onFormSubmit}
            className="flex flex-col gap-y-3"
        >
            <FormGenerator
                label="Workspace Name"
                placeholder={"Enter workspace name"}
                register={register}
                name="name"
                errors={errors}
                inputType="input"
                type="text"
            />
            <Button
                className="text-sm w-full mt-2"
                type="submit"
                disabled={isPending}
            >
                <Loader loading={false}>Create Workspace</Loader>
            </Button>
        </form>
    )
}

export default WorkspaceForm