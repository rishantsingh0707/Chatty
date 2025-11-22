import React from 'react'
import { Image, Send, X, Loader2 } from 'lucide-react'
import { useMessageStore } from '../store/Message.Store.js'
import toast from 'react-hot-toast'

function MessageInput() {

    const [text, setText] = React.useState('')
    const [imagePreview, setImagePreview] = React.useState(null)
    const [isSending, setIsSending] = React.useState(false)
    const [focused, setFocused] = React.useState(false)
    const fileInputRef = React.useRef(null)

    const { sendMessage } = useMessageStore()

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return toast.error("No file selected");

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    }

    const removeImage = () => {

        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        try {

            await sendMessage({ text: text.trim(), image: imagePreview });
            setText('');
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

        } catch (error) {
            console.error("Error in sending message from input:", error);
            toast.error('Error sending message');
        }
    }

    return (
        <div className="w-full rounded-xl border border-base-300 bg-base-200/60 backdrop-blur p-2 shadow-sm">
            {imagePreview && (
                <div className="mb-3">
                    <div className="relative group inline-block">
                        <img
                            src={imagePreview}
                            alt="Image preview"
                            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl ring-1 ring-base-300/70 shadow-inner"
                        />
                        <button
                            onClick={removeImage}
                            type="button"
                            aria-label="Remove image"
                            className="absolute top-1 right-1 opacity-90 group-hover:opacity-100 transition bg-white hover:bg-gray-300 cursor-pointer text-error-content rounded-2xl w-6 h-6 flex items-center justify-center shadow"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex items-stretch gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            className={`w-full input input-bordered rounded-xl input-sm sm:input-md pr-12 focus:outline-none focus:border-base-300 ${!focused ? 'caret-transparent' : ''}`}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            placeholder="Message..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            aria-label="Message input"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSending}
                            aria-label="Attach image"
                            className={`absolute right-2 hover:cursor-pointer top-1/2 -translate-y-1/2 btn btn-circle btn-ghost btn-xs sm:btn-sm border-none shadow-none ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
                        >
                            <Image size={20} />
                        </button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>
                <button
                    type="submit"
                    disabled={(!text.trim() && !imagePreview) || isSending}
                    aria-label={isSending ? 'Sending' : 'Send message'}
                    className="btn btn-circle btn-sm sm:btn-md bg-primary text-primary-content hover:brightness-110 disabled:opacity-50"
                >
                    {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={22} />}
                </button>
            </form>
        </div>
    )
}

export default MessageInput