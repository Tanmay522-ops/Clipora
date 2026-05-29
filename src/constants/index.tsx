import { BillingIcon } from '@/icons/BillingIcon';
import {NotificationsIcon} from '@/icons/NotificationIcon';
import { SettingsIcon } from '@/icons/SettingIcon';
import { HomeIcon } from '@/icons/HomeIcon';
import { LibraryIcon } from '@/icons/LiberaryIcon';




export const MENU_ITEMS = (
    workspaceId: string
): { title: string; href: string; icon: React.ReactNode }[] => [
        {
            title: 'Home',
            href: `/dashboard/${workspaceId}/home`,
            icon: <HomeIcon/>,
        },
        {
            title: 'My Library',
            href: `/dashboard/${workspaceId}`,
            icon: <LibraryIcon />,
        },
        {
            title: 'Notifications',
            href: `/dashboard/${workspaceId}/notifications`,
            icon: <NotificationsIcon />,
        },
        {
            title: 'Billing',
            href: `/dashboard/${workspaceId}/billing`,
            icon: <BillingIcon />,
        },
        {
            title: 'Settings',
            href: `/dashboard/${workspaceId}/settings`,
            icon: <SettingsIcon />,
        },
    ]