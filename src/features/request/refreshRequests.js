import { BASE_URL } from "../../utils/constants";
import { setReceivedRequests, setSentRequests } from "./requestSlice";

/**
 * Refetch pending received/sent requests and update Redux (navbar badge, Requests page).
 * @param {import("@reduxjs/toolkit").Dispatch} dispatch
 * @param {{ isCancelled?: () => boolean }} [options]
 */
export async function refreshRequests(dispatch, options = {}) {
  const { isCancelled = () => false } = options;
  try {
    const opts = { method: "GET", credentials: "include" };
    const [receivedRes, sentRes] = await Promise.all([
      fetch(`${BASE_URL}user/requests/received`, opts),
      fetch(`${BASE_URL}user/requests/sent`, opts),
    ]);

    if (isCancelled()) return;

    if (receivedRes.status === 401 || sentRes.status === 401) {
      dispatch(setReceivedRequests([]));
      dispatch(setSentRequests([]));
      return { ok: false, unauthorized: true };
    }

    const receivedJson = await receivedRes.json();
    const sentJson = await sentRes.json();
    if (isCancelled()) return { ok: false, cancelled: true };
    dispatch(setReceivedRequests(receivedJson.data));
    dispatch(setSentRequests(sentJson.data));
    return { ok: true, unauthorized: false };
  } catch (err) {
    if (!isCancelled()) console.error("refreshRequests:", err);
    return { ok: false, unauthorized: false };
  }
}
