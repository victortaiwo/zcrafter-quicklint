# ZCrafter QuickLint

A Zowe CLI plugin that uses OpenAI's ChatGPT to lint and analyze COBOL code directly from z/OS datasets.

## Overview

ZCrafter QuickLint is a Zowe CLI plugin that helps mainframe developers improve their COBOL code by leveraging AI assistance. The plugin connects to z/OS via z/OSMF, retrieves COBOL source code from datasets, and sends it to OpenAI's ChatGPT for analysis and linting.

## Features

- Retrieve COBOL code from mainframe datasets using z/OSMF
- Send code to OpenAI's ChatGPT for analysis
- Get AI-powered feedback on code quality and best practices
- Support for mock data during testing

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or later
- [Zowe CLI](https://docs.zowe.org/stable/user-guide/cli-installcli.html) v5 or later
- An OpenAI API key
- Access to z/OSMF on your z/OS system

## Installation

### Install from NPM (when published)

```bash
zowe plugins install zcrafter-quicklint
```

### Install from Source

1. Clone the repository
```bash
git clone https://github.com/yourusername/zcrafter-quicklint.git
cd zcrafter-quicklint
```

2. Install dependencies and build the plugin
```bash
npm install
npm run build
```

3. Install the plugin to Zowe CLI
```bash
zowe plugins install .
```

4. Verify the installation
```bash
zowe zcrafter-quicklint --help
```

## Configuration

### OpenAI API Key

You need to provide your OpenAI API key in one of two ways:

1. As an environment variable:
```bash
export OPENAI_API_KEY=your-api-key-here
```

2. Using the `--api-key` option when running commands:
```bash
zowe zcrafter-quicklint lint "DATASET.NAME(MEMBER)" --api-key your-api-key-here
```

### z/OSMF Connection

If you have a Zowe z/OSMF profile set up, the plugin will use it automatically. Otherwise, you can specify connection details with command options:

```bash
zowe zcrafter-quicklint lint "DATASET.NAME(MEMBER)" --host mainframe.host.com --port 443 --user YOURID --password YOURPASS
```

## Usage Examples

### Lint a COBOL program

```bash
zowe zcrafter-quicklint lint "USERID.COBOL.SOURCE(PROGRAM1)"
```

### Use mock data for testing (no z/OSMF connection needed)

```bash
zowe zcrafter-quicklint lint "USERID.COBOL.SOURCE(PROGRAM1)" --mock
```

### With specific connection details

```bash
zowe zcrafter-quicklint lint "USERID.COBOL.SOURCE(PROGRAM1)" --host mainframe.example.com --port 10443 --user mainuser --password mainpass --ru false
```

## Command Reference

### lint

Analyze a COBOL source member using ChatGPT.

```
zowe zcrafter-quicklint lint <dataset>

POSITIONAL ARGUMENTS
  dataset  HLQ.PDS(MEMBER) to lint

OPTIONS
  --host             The z/OSMF server host name
  --port             The z/OSMF server port
  --ru, --reject-unauthorized  Reject self-signed certificates (default: true)
  --user             The z/OSMF server username
  --password         The z/OSMF server password
  --mock             Use mock COBOL data for testing (default: false)
  --api-key          OpenAI API key (alternatively, set OPENAI_API_KEY environment variable)
```

## Troubleshooting

1. If you encounter OpenAI API authentication errors, check that your API key is valid and correctly provided.

2. For z/OSMF connection issues, verify your connection parameters and credentials.

3. Use the `--mock` flag to test the functionality without requiring a z/OSMF connection.

4. Make sure your z/OSMF installation is correctly configured and accessible.

## License

This project is licensed under Apache License 2.0 and Eclipse Public License v2.0 (dual license).

## Contributing

Contributions are welcome! Please follow the standard Zowe CLI plugin contribution guidelines.

## Acknowledgments

- Built on the [Zowe CLI](https://github.com/zowe/zowe-cli) framework
- Uses OpenAI's ChatGPT for COBOL code analysis
