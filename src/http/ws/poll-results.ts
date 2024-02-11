import { FastifyInstance } from "fastify";
import { voting } from "../../utils/voting-pub-sub";
import { z } from "zod";
//import { voting } from "../../utils/voting-pub-sub";

export async function pollResults(app: FastifyInstance) {
  app.get(
    "/polls/:pollId/results",
    { websocket: true },
    (connection, request) => {
      // begin
      const getPollParams = z.object({
        pollId: z.string().uuid(),
      });
      const { pollId } = getPollParams.parse(request.params);
      voting.subscribe(pollId, (message) => {
        connection.socket.send(JSON.stringify(message));
      });
    },
  );
}
