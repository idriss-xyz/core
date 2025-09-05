# LLM.md
This file provides guidance to LLMs when working with code in this repository.

## Development Guidelines

### Component Development
- Use minimal, self-contained components with clear props
- Default export components
- Always satisfy react/no-unescaped-entities: escape special chars in JSX, use &apos; or alternatives

### Additional Development Notes
- **State Management**: React Query for server state, React Context for client state
- **Web3**: Use viem for onchain interactions
- **Comments**: Never add code comments unless otherwise stated by the user
- **Shell commands**: Never propose to run shell commands unless the user specifically asks for it
- **Optional suggestions**: Never add empty fluff, or otpional suggestions in the code. Only work on what the user asks for