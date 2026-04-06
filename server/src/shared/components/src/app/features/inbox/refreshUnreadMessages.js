import { BASE_URL } from "../../utils/constants";
import { setInboxSummary } from "./inboxSlice";

/**
 * @param {import("@reduxjs/toolkit").Dispatch} dispatch
 * @param {{ isCancelled?: () => boolean }} [options]
 */
export async function refreshUnreadMessages(dispatch, options = {}) {
  const { isCancelled = () => false } = options;
  try {
    const res = await fetch(`${BASE_URL}user/messages/unread/summary`, {
      credentials: "include",
    });

    if (isCancelled()) return { unauthorized: false };

    if (res.status === 401) {
      dispatch(setInboxSummary({ totalUnread: 0, threads: [] }));
      return { unauthorized: true };
    }

    const json = await res.json();
    if (isCancelled()) return { unauthorized: false };

    const d = json.data || {};
    dispatch(
      setInboxSummary({
        totalUnread: d.totalUnread ?? 0,
        threads: d.threads ?? [],
      })
    );
    return { unauthorized: false };
  } catch (err) {
    if (!isCancelled()) console.error("refreshUnreadMessages:", err);
    return { unauthorized: false };
  }
}
