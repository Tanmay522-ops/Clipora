"use client"
import React from 'react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { enableFirstView, getFirstView } from '@/actions/user'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import SystemMode from '@/components/theme/SystemMode'
import LightMode from '@/components/theme/LightMode'
import DarkMode from '@/components/theme/DarkMode'

const SettingsPage = () => {
    const [firstView, setFirstView] = useState<undefined | boolean>(undefined)
    const [mounted, setMounted] = useState(false) 
    const { setTheme, theme } = useTheme()


    useEffect(() => {
        setMounted(true)  // ← add this
    }, [])

    useEffect(() => {
        if (firstView !== undefined) return
        const fetchData = async () => {
            const response = await getFirstView()
            if (response.status === 200) setFirstView(response?.data)
        }
        fetchData()
    }, [firstView])
    
    if (!mounted) return null 

    const switchState = async (checked: boolean) => {
        const view = await enableFirstView(checked)
        if (view) {
            toast(view.status === 200 ? 'Success' : 'Failed', {
                description: view.data,
            })
        }
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Theme Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Theme</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col gap-2">
                        <div
                            className={cn(
                                'rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent',
                                theme == 'system' && 'border-purple-800'
                            )}
                            onClick={() => setTheme('system')}
                        >
                            <SystemMode />
                        </div>
                        <p className="text-sm text-center">System</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div
                            className={cn(
                                'rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent',
                                theme == 'light' && 'border-purple-800'
                            )}
                            onClick={() => setTheme('light')}
                        >
                            <LightMode />
                        </div>
                        <p className="text-sm text-center">Light</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div
                            className={cn(
                                'rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent',
                                theme == 'dark' && 'border-purple-800'
                            )}
                            onClick={() => setTheme('dark')}
                        >
                            <DarkMode />
                        </div>
                        <p className="text-sm text-center">Dark</p>
                    </div>
                </div>
            </div>

            {/* Video Sharing Settings Section */}
            <div>
                <h2 className="text-2xl font-bold mt-4">Video Sharing Settings</h2>
                <p className="text-muted-foreground">
                    Enabling this feature will send you notifications when someone watched
                    your video for the first time. This feature can help during client
                    outreach.
                </p>
                <Label className="flex items-center gap-x-3 mt-4 text-md">
                    Enable First View
                    <Switch
                        onCheckedChange={(checked) => {
                            setFirstView(checked)
                            switchState(checked)
                        }}
                        disabled={firstView === undefined}
                        checked={firstView ?? false}
                    />
                </Label>
            </div>
        </div>
    )
}

export default SettingsPage