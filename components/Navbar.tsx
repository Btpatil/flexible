import { NavLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import AuthProviders from "./AuthProviders";
import { getCurrentUser } from "@/lib/session";
import ProfileMenu from "./ProfileMenu";
// import { getCurrentUser } from "@/lib/session";

// import AuthProviders from "./AuthProviders";
// import Button from "./Button";
// import ProfileMenu from "./ProfileMenu";

const Navbar = async () => {
    const session = await getCurrentUser()

    return (
        <nav className='flexBetween navbar'>
            <div className='flex-1 flexStart gap-10'>
                <Link href='/'>
                    <Image
                        src='/logo.svg'
                        width={116}
                        height={43}
                        alt='logo'
                    />
                </Link>
                <ul className='xl:flex hidden text-small gap-7'>
                    {NavLinks.map((link) => (
                        <Link href={link.href} key={link.text}>
                            {link.text}
                        </Link>
                    ))}
                </ul>
            </div>

            <div className='flexCenter gap-4'>
                {session?.user ? (
                    <>
                        {/* {session?.user?.image &&
                            <Link href="/profile">
                                <Image src={session.user.image}
                                    width={40}
                                    height={40}
                                    alt={session.user.name}
                                    className=" rounded-full"
                                />
                            </Link>
                        } */}
                        <ProfileMenu session={session} />

                        <Link href="/create-project">
                            share work
                            {/* <Button title='Share work' /> */}
                        </Link>

                    </>
                ) : (
                    <AuthProviders />
                )}
            </div>
        </nav>
    )
}

export default Navbar