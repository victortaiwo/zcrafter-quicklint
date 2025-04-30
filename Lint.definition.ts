import { ICommandDefinition } from "@zowe/imperative";

// This needs to be a proper command definition with ALL required properties
const LintDefinition: ICommandDefinition = {
  name: "lint",
  aliases: ["l"],
  summary: "Lint COBOL code using AI",
  description: "Analyze COBOL source code from a mainframe dataset member using ChatGPT AI",
  type: "command",
  handler: __dirname + "/Lint.handler",
  positionals: [
    {
      name: "dataset",
      description: "The dataset (and member) to lint",
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
    }
  ],
  profile: {
    optional: ["zosmf"]
  },
  examples: [
    {
      description: "Lint a COBOL source member",
      options: "KC03AE8.COBOL.SOURCE(HELLOCOB)"
    },
    {
      description: "Lint a COBOL source member with specific connection details",
      options: "KC03AE8.COBOL.SOURCE(HELLOCOB) --host zos.example.com --port 10443 --ru false --user myuser --password mypass"
    },
    {
      description: "Use mock COBOL data for testing",
      options: "KC03AE8.COBOL.SOURCE(HELLOCOB) --mock"
    }
  ]
};

// Important: Use CommonJS export syntax
module.exports = LintDefinition;