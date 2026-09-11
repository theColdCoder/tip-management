import { QRCodeCanvas } from "qrcode.react";

function QRCodeModal({ worker, onClose }) {
  const tipUrl = `${window.location.origin}/tip/${worker.slug}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{worker.name}'s QR Code</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center">
          <QRCodeCanvas value={tipUrl} size={220} level="H" />

          <p className="mt-4 text-center text-sm text-gray-500">
            Scan this QR code to open {worker.name}'s tipping page.
          </p>

          <p className="mt-2 break-all text-center text-sm text-gray-700">
            {tipUrl}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRCodeModal;
