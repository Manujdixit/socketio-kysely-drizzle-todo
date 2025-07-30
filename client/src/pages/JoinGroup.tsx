import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { connectSocket } from "../socket/socket";
import { toast } from "sonner";
import { useJoinRoomApi } from "../hooks/useJoinRoomApi";

const JoinGroup: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  const handleScanQr = () => {
    setShowScanner(true);
    setTimeout(() => {
      if (scannerRef.current) {
        const html5Qr = new Html5Qrcode(scannerRef.current.id);
        html5Qr.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 200,
          },
          (decodedText) => {
            setRoomId(decodedText);
            setShowScanner(false);
            html5Qr.stop();
            toast.success("QR code scanned!");
          },
          (error) => {
            // ignore scan errors
            console.log(error);
          }
        );
      }
    }, 300);
  };
  const { joinRoomApi, loading, error } = useJoinRoomApi();
  const navigate = useNavigate();

  const handleJoin = async () => {
    const apiSuccess = await joinRoomApi(roomId);
    if (!apiSuccess) return;
    // Then, join room via socket
    const socket = connectSocket();
    const userId = localStorage.getItem("userId");
    socket.emit(
      "join_room",
      { roomId, userId },
      (response: { success: boolean; message?: string }) => {
        if (response.success) {
          toast.success("Joined group successfully!");
          navigate(`/group/${roomId}`);
        } else {
          toast.error(response.message || "Failed to join group");
        }
      }
    );
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 flex flex-col items-center gap-8">
      <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">
        Join a Group
      </h2>
      <div className="w-full flex flex-col gap-4">
        <button
          type="button"
          onClick={handleScanQr}
          className="py-2 px-4 mb-2 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-xl font-semibold shadow hover:scale-105 transition"
        >
          Scan QR Code with Camera
        </button>
        <input
          type="text"
          placeholder="Enter Room ID or scan QR code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full px-4 py-3 bg-[var(--input)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] font-medium"
        />
        <button
          type="button"
          onClick={handleJoin}
          disabled={loading || !roomId}
          className="py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition shadow-sm"
        >
          {loading ? "Joining..." : "Join Group"}
        </button>
        {error && (
          <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
        )}
      </div>
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-xl p-6 relative w-full max-w-xs flex flex-col items-center">
            <span className="font-semibold mb-2">Scan Group QR Code</span>
            <div
              id="qr-scanner"
              ref={scannerRef}
              style={{ width: 240, height: 240 }}
            />
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-[var(--destructive)] text-white rounded"
              onClick={() => setShowScanner(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinGroup;
