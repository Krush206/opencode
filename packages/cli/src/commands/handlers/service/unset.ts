import { Effect, Option } from "effect"
import { Commands } from "../../commands"
import { Config } from "../../../config"
import { Runtime } from "../../../framework/runtime"
import { ServiceConfig } from "../../../services/service-config"

export default Runtime.handler(
  Commands.commands.service.commands.unset,
  Effect.fn("cli.service.unset")(function* (input) {
    yield* ServiceConfig.unset(input.key, Option.getOrUndefined(input.name))
    if (input.key !== "shell") return
    // Mirror the shell into the CLI config so the TUI settings row reflects the change.
    const config = yield* Config.Service
    yield* config.update((draft) => {
      delete draft.shell
    }).pipe(Effect.orElseSucceed(() => undefined))
  }),
)
