import { ICommandDefinition } from "@zowe/imperative";

const QuicklintDefinition: ICommandDefinition = {
  name: "lint",
  summary: "Lint a COBOL member with ChatGPT",
  description:
    "Download a COBOL program from z/OSMF and display AI lint results.",
  type: "command",
  handler: __dirname + "/Quicklint.handler",

  positionals: [
    {
      name: "dataset",
      description: "HLQ.PDS(MEMBER) to lint",
      type: "string",
      required: true
    }
  ],
  
  options: [
    {
      name: "host",
      description: "The z/OSMF server host name",
      type: "string",
      required: false
    },
    {
      name: "port",
      description: "The z/OSMF server port",
      type: "number",
      required: false
    },
    {
      name: "ru",
      aliases: ["reject-unauthorized"],
      description: "Reject self-signed certificates",
      type: "boolean",
      required: false,
      defaultValue: true
    },
    {
      name: "user",
      description: "The z/OSMF server username",
      type: "string",
      required: false
    },
    {
      name: "password",
      description: "The z/OSMF server password",
      type: "string",
      required: false
    },
    {
      name: "mock",
      description: "Use mock COBOL data for testing",
      type: "boolean",
      required: false,
      defaultValue: false
    },
    {
      name: "api-key",
      description: "OpenAI API key (alternatively, set OPENAI_API_KEY environment variable)",
      type: "string",
      required: false
    }
  ],

  profile: { optional: ["zosmf"] }
};

export = QuicklintDefinition;