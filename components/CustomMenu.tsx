import { Menu } from "@headlessui/react"
import Image from "next/image"

type Props = {
    title: string
    filters: Array<string>
    state: string
    setState: (value: string) => void
}

const CustomMenu = ({ title, filters, state, setState }: Props) => {
    return (
        <div className="flexStart flex-col gap-7 w-full relative">
            <label htmlFor={title} className="w-full text-gray-100">
                {title}
            </label>
            <Menu as='div' className='self-start relative'>
                <div>
                    <Menu.Button className='flexCenter custom_menu-btn'>
                        {state || 'select category'}
                        <Image
                            src='/arrow-down.svg'
                            alt="arrow down"
                            width={10}
                            height={5}
                        />
                    </Menu.Button>
                </div>
                <Menu.Items className='flexStart custom_menu-items' >
                    {filters.map((tag) => (
                        <Menu.Item key={tag}>
                            <button type="button" className="custom_menu-item" value={tag} onClick={(e) => setState(e.currentTarget.value)}>
                                {tag}
                            </button>
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Menu>
        </div>
    )
}

export default CustomMenu