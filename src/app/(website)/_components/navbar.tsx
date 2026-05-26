import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu, User } from 'lucide-react';
import Image from 'next/image';

const LandingPageNavbar = () => {
    return (
        <div className='flex w-full justify-between items-center'>
            <div className='text-3xl font-semibold flex items-center gap-x-3'>
                <Menu className="w-6 h-6" />
                <Image
                    alt="logo"
                    src="/cliporra.svg"
                    width={20}
                    height={20}
                />
                cliporra
            </div>
            <div className="hidden lg:flex gap-x-10 items-center">
                <Link href="/" className="bg-[#7320DD] py-2 px-5 font-semibold text-lg rounded-full hover:bg-[#7320DD]/80">
                    Home
                </Link>
                <Link href="/" className="nav-link">
                    Pricing
                </Link>
                <Link href="/" className="nav-link">
                    Contact
                </Link>
            </div>

            <Link href="/sign-in">
                <Button className="text-base flex gap-x-2">
                    <User fill='#000' />
                    Login
                </Button>
            </Link>
        </div>
    )
}

export default LandingPageNavbar;