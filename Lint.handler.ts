// src/cli/lint/Lint.handler.ts
// -------------------------------------------------------------
// Handler for the command:
//
//    zowe quicklint lint <DATASET(MEMBER)>
//
// or (if your pluginDef name is "zcrafter-quicklint")
//
//    zowe zcrafter-quicklint lint <DATASET(MEMBER)>
//
// It
//   1) Builds a z/OSMF session (merging profile + CLI flags).
//   2) Downloads the COBOL member as text.
//   3) Sends the code to OpenAI ChatGPT for linting.
//   4) Prints the AI feedback.
//
// -------------------------------------------------------------

import {
  ICommandHandler,
  IHandlerParameters,
  ISession,
  Session,
  ConnectionPropsForSessCfg
} from "@zowe/imperative";

import { DatasetReader } from "../../api/DatasetReader";
import { OpenAIClient } from "../../api/OpenAIClient";

export default class LintHandler implements ICommandHandler {
  public async process(params: IHandlerParameters): Promise<void> {
    try {
      // Check for mock mode flag
      if (params.arguments.mock === true) {
        DatasetReader.enableMockMode();
      }
      
      // -------------------------------------------------
      // 1️⃣  Build / prompt for a z/OSMF session
      // -------------------------------------------------
      const sessCfg: ISession = await ConnectionPropsForSessCfg.addPropsOrPrompt<ISession>(
        {}, // start empty, add profile + CLI overrides, prompt if needed
        params.arguments,
        { doPrompting: true, parms: params }
      );
      const session = new Session(sessCfg);

      // -------------------------------------------------
      // 2️⃣  Retrieve the COBOL member
      // -------------------------------------------------
      const dsName = params.arguments.dataset as string;
      params.response.console.log(`Retrieving ${dsName} from z/OSMF …`);
      const cobolSource = await DatasetReader.getContent(session, dsName);

      // -------------------------------------------------
      // 3️⃣  Send code to ChatGPT for linting
      // -------------------------------------------------
      params.response.console.log(
        "Sending source to ChatGPT for linting (please wait) …"
      );
      const lintResult = await OpenAIClient.lintCobol(cobolSource);

      // -------------------------------------------------
      // 4️⃣  Output the results
      // -------------------------------------------------
      params.response.console.log("\n=== Lint Results ===");
      params.response.console.log(lintResult || "<No feedback returned>");
    } catch (err: any) {
      const msg =
        err?.message ??
        (typeof err === "string" ? err : JSON.stringify(err, null, 2));
      params.response.console.error(`\n⚠️  Linting failed: ${msg}\n`);
    }
  }
}