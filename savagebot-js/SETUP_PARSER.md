# Parser Setup Guide

This guide explains how to generate the ANTLR4 parser for the R2 dice rolling grammar.

## Prerequisites

1. **Install ANTLR4 tool** (one-time setup):

### Option 1: Using npm (recommended)
```bash
npm install -g antlr4
```

### Option 2: Using Java (if npm doesn't work)
```bash
# Download ANTLR4 JAR
cd /usr/local/lib
sudo curl -O https://www.antlr.org/download/antlr-4.13.1-complete.jar

# Create alias (add to ~/.bashrc or ~/.zshrc)
alias antlr4='java -jar /usr/local/lib/antlr-4.13.1-complete.jar'
```

## Generate Parser

Once ANTLR4 is installed, generate the JavaScript parser:

```bash
# From the savagebot-js directory
npm run generate-parser
```

This will create the parser files in the `./parser` directory:
- `R2Lexer.js` - Tokenizer
- `R2Parser.js` - Parser
- `R2Visitor.js` - Visitor base class
- `R2Listener.js` - Listener base class

## Verify Installation

Check that the parser files were generated:

```bash
ls -la parser/
```

You should see the generated JavaScript files.

## Usage

The generated parser is used in `r2Evaluator.js` to parse and evaluate dice rolling expressions.

## Troubleshooting

**Error: antlr4 command not found**
- Make sure you installed ANTLR4 globally
- Try using the Java-based approach instead

**Error: Cannot find module 'antlr4'**
- Run `npm install` to install the antlr4 runtime dependency

**Parser generation fails**
- Ensure R2.g4 file exists in the project root
- Check ANTLR4 version compatibility (we use 4.13.1)
