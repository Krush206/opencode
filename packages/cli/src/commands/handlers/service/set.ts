import { Effect, Option } from "effect"
import { Commands } from "../../commands"
import { Config } from "../../../config"
import { Runtime } from "../../../framework/runtime"
import { ServiceConfig } from "../../../services/service-config"

export default Runtime.handler(
  Commands.commands.service.commands.set,
  Effect.fn("cli.service.set")(function* (input) {
    yield* ServiceConfig.set(input.key, input.value, Option.getOrUndefined(input.nestedValue))
    if (input.key !== "shell") return
    // Mirror the shell into the CLI config so the TUI settings row reflects the change.
    const config = yield* Config.Service
    yield* config
      .update((draft) => {
        if (input.value) draft.shell = input.value
        else delete draft.shell
      })
      .pipe(Effect.orElseSucceed(() => undefined))
  }),
)
