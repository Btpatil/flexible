import { type } from "os"

type Props = {
    type?: string
    title: string
    placeholder: string
    state: string
    isTextArea?: boolean
    setState: (value: string) => void
}

const FormField = ({ type, title, placeholder, state, setState, isTextArea }: Props) => {
    return (
        <div className=" flexStart flex-col w-full gap-4">
            <label className="w-full text-gray-100">
                {title}
            </label>
            {isTextArea ?
                <textarea
                placeholder={placeholder}
                value={state}
                className="form_field-input"
                required
                onChange={(e) => setState(e.target.value)} />
                :
                <input
                type={type || 'text'} 
                placeholder={placeholder}
                value={state}
                className="form_field-input"
                required
                onChange={(e) => setState(e.target.value)} />
            }
        </div>
    )
}

export default FormField