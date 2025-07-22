# Qlik Chat Simulation Extension

A Qlik Sense extension that simulates a chat conversation interface, displaying messages in chat bubbles with different styles for sent and received messages.

## Features

- Displays messages in chat bubbles
- Different styling for sent ("Você") and received messages
- Basic Markdown support (bold, lists, links)
- Automatic sorting by timestamp
- Responsive design with scrollable container

## Installation

1. Download the extension files
2. Upload to your Qlik Cloud tenant via the Dev Hub
3. Add the extension to your app

## Usage

Your data should have at least 2 columns:
1. Sender (use "Você" for sent messages)
2. Message content (supports basic Markdown)

The extension will automatically:
- Sort messages by timestamp
- Format messages with Markdown
- Apply appropriate styling

## Code Example

```javascript
// Sample load script for test data
Messages:
Load 
  'User1' as Sender,
  'Hello! How are you?' as Message,
  '2023-01-01T10:00:00' as Timestamp
AutoGenerate 1;

// Add more messages as needed
```

## License

[MIT](LICENSE)
