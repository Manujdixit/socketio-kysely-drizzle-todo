import React, { useEffect, useState } from "react";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { toast } from "sonner";
import QRCode from "qrcode";

// interface Member {
//   id: string;
//   name: string;
// }

const GroupSheet: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const { createRoom, loading, error, roomId } = useCreateRoom();
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    if (roomId) {
      toast.success("Room created successfully!");
    }
  }, [roomId]);

  const handleCreateRoom = async () => {
    if (!groupName) return;
    await createRoom(groupName);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId || "");
    toast.success("Group Id copied to clipboard");
  };

  useEffect(() => {
    if (roomId) {
      QRCode.toDataURL(roomId, { width: 180 }, (err: any, url: string) => {
        if (!err) setQrUrl(url);
      });
    }
  }, [roomId]);

  return (
    <div className="w-full">
      {!roomId ? (
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
              Group Name
            </label>
            <input
              type="text"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--input)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] font-medium"
              autoFocus
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
              Add Members
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add member name"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-[var(--input)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] font-medium"
              />
              <button
                type="button"
                onClick={handleAddMember}
                className="px-4 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition shadow-sm"
              >
                Add Member
              </button>
            </div>
            <ul className="mt-2 flex flex-wrap gap-2">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="px-3 py-1 bg-[var(--muted)] rounded-xl text-sm text-[var(--foreground)]"
                >
                  {m.name}
                </li>
              ))}
            </ul>
          </div> */}
          <button
            type="button"
            onClick={handleCreateRoom}
            disabled={loading || !groupName}
            className="py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition shadow-sm"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 py-10">
          <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">
            Group Created!
          </h2>
          <div className="flex flex-col items-center gap-2">
            <span className="text-base text-[var(--muted-foreground)]">
              Room ID:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg bg-[var(--input)] px-3 py-1 rounded-lg border border-[var(--border)] text-[var(--primary)]">
                {roomId}
              </span>
              <button
                type="button"
                className="px-2 py-1 text-xs bg-[var(--primary)] text-[var(--primary-foreground)] rounded hover:bg-[var(--primary)]/80 transition font-semibold border border-[var(--border)]"
                onClick={handleCopy}
                title="Copy Room ID"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="my-4">
            {qrUrl && (
              <img
                src={qrUrl}
                alt="QR Code"
                className="rounded-lg shadow-lg border border-[var(--border)] bg-white p-2"
              />
            )}
          </div>
          <p className="text-sm text-[var(--muted-foreground)] text-center max-w-xs">
            Share this QR code or Room ID to invite others.
            <br />
            <span className="text-xs text-[var(--primary)]">
              Anyone with this code can join your group.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupSheet;
