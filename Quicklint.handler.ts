// src/cli/quicklint/Quicklint.handler.ts
import {
    ICommandHandler,
    IHandlerParameters,
    ISession,
    Session,
    ConnectionPropsForSessCfg
  } from "@zowe/imperative";
  
  import { DatasetReader } from "../../api/DatasetReader";
  import { OpenAIClient } from "../../api/OpenAIClient";
  
  export default class QuicklintHandler implements ICommandHandler {
    public async process(params: IHandlerParameters): Promise<void> {
      try {
        // Set API key if provided as command-line parameter
        if (params.arguments["api-key"]) {
          OpenAIClient.setApiKey(params.arguments["api-key"] as string);
        }
        
        // Check for mock mode flag
        if (params.arguments.mock === true) {
          DatasetReader.enableMockMode();
        }
  
        /* 1️⃣  Build / prompt for a z/OSMF session configuration */
        const sessCfg: ISession =
          await ConnectionPropsForSessCfg.addPropsOrPrompt<ISession>(
            {},
            params.arguments,
            { doPrompting: true, parms: params }
          );
  
        /* trust the self-signed certificate on Marist */
        sessCfg.rejectUnauthorized = false;
  
        const session = new Session(sessCfg);
  
        /* 2️⃣  Retrieve the COBOL member */
        const dsn = params.arguments.dataset as string;
        params.response.console.log(`Retrieving ${dsn} …`);
        const cobolSource = await DatasetReader.getContent(session, dsn);
  
        /* 3️⃣  Lint via ChatGPT */
        params.response.console.log("Sending to ChatGPT …");
        const lint = await OpenAIClient.lintCobol(cobolSource);
  
        /* 4️⃣  Show result to the user */
        params.response.console.log("\n=== Lint Result ===");
        params.response.console.log(lint);
      } catch (err: any) {
        params.response.console.error("⚠️  Quicklint failed");
        
        if (err instanceof Error) {
          params.response.console.error(`Error message: ${err.message}`);
          
          // Add a hint about API key if that seems to be the issue
          if (err.message.includes("API key") || err.message.includes("Authentication")) {
            params.response.console.error("\nHint: Try providing your API key directly with --api-key option");
            params.response.console.error("Example: zowe zcrafter-quicklint lint 'KC03AE8.COBOL.SOURCE(HELLOCOB)' --mock --api-key your-api-key");
          }
        } else {
          params.response.console.error(
            typeof err === "string" ? err : JSON.stringify(err, null, 2)
          );
        }
      }
    }
  }