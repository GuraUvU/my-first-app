type ModalProps = {
    open: boolean;
    onClose: () => void;
};

export default function Modal({ open, onClose }: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
            onClick={onClose}>
            <div role="dialog"
                aria-modal="true"
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-8 text-center"
                onClick={(event) => event.stopPropagation()}>
                <p className="text-lg font-medium text-white">
                    不要点这个
                </p>
                <button type="button"
                    onClick={onClose}
                    className="mt-6 w-full rounded-full border border-white/15 px-6 py-2.5 text-sm text-zinc-200 transition-colors hover:bg-white/10">
                    彳亍
                </button>
            </div>
        </div>
    );
}