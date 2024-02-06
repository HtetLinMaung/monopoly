import { sendTopic } from "../config/kafka.config";

export default async function emitEvent(
  rooms: string[],
  event: string,
  payload: any
) {
  return sendTopic("socketio-emit", {
    rooms,
    event,
    payload,
  });
}
