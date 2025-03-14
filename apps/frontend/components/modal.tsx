const Modal = ({
  isOpen,
  onClose,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed left-0 top-0 blur-sm h-screen w-screen bg-[rgba(154,143,164,0.75)]"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 flex items-center justify-center z-50">
        {children}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-3 text-white cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12" /><path fill="currentColor" d="M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z" /></svg>
        </button>
      </div>
    </>
  );
};

export default Modal;
