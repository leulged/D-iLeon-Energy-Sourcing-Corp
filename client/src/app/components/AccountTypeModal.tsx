interface AccountTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (role: "buyer" | "seller" | "both") => void;
}

export default function AccountTypeModal({
  open,
  onClose,
  onSelect,
}: AccountTypeModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-neutral-900 rounded-xl shadow-xl p-8 w-full max-w-md flex flex-col items-center relative">
        <button
          className="absolute top-4 right-4 text-neutral-400 hover:text-white text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-2 text-center">
          Choose Your Account Type
        </h2>
        <p className="text-neutral-400 mb-6 text-center">
          Select whether you&apos;re looking to buy oil or sell oil products to
          get started with the right features for your needs.
        </p>
        <div className="flex flex-col gap-4 w-full">
          <button
            className="w-full border-2 border-orange-500 rounded-lg px-6 py-4 text-left hover:bg-orange-500 hover:text-white transition font-semibold text-lg flex items-center gap-3"
            onClick={() => onSelect("buyer")}
          >
            <span>🛒</span> I&apos;m a Buyer
          </button>
          <button
            className="w-full border-2 border-orange-500 rounded-lg px-6 py-4 text-left hover:bg-orange-500 hover:text-white transition font-semibold text-lg flex items-center gap-3"
            onClick={() => onSelect("seller")}
          >
            <span>🏭</span> I&apos;m a Seller
          </button>
          <button
            className="w-full border-2 border-yellow-400 rounded-lg px-6 py-4 text-left hover:bg-yellow-400 hover:text-black transition font-semibold text-lg flex items-center gap-3"
            onClick={() => onSelect("both")}
          >
            <span>🤝</span> Both Buyer &amp; Seller
          </button>
        </div>
      </div>
    </div>
  );
}
 