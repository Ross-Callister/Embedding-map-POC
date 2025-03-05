type Message = {
  role: string;
  content: { text: string }[];
};

type Request = {
  messages: Message[];
  inferenceConfig: {
    // all Optional, Invoke parameter names used in this example
    maxTokens?: number; // greater than 0, equal or less than 5k (default: dynamic*)
    temperature?: number; // greater then 0 and less than 1.0 (default: 0.7)
    topP?: number; // greater than 0, equal or less than 1.0 (default: 0.9)
    topK?: number; // 0 or greater (default: 50)
    stopSequences?: string[];
  };
};

export class NovaHelper {
  messages: Message[] = [];

  addSystemMessage(text: string) {
    this.messages.push({
      role: "user",
      content: [{ text }],
    });
  }

  addUserMessage(text: string) {
    this.messages.push({
      role: "user",
      content: [{ text }],
    });
  }

  addAssistantMessage(text: string) {
    this.messages.push({
      role: "assistant",
      content: [{ text }],
    });
  }

  getRequestBody(): Request {
    return {
      messages: this.messages,
      inferenceConfig: {
        maxTokens: 2048,
        temperature: 0.7,
        topP: 0.9,
        topK: 50,
      },
    };
  }
}
