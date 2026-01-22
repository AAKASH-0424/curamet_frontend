// Utility functions for chat persistence

/**
 * Save chat messages to localStorage
 * @param {string} userId - User identifier
 * @param {string} chatId - Chat session identifier
 * @param {Array} messages - Array of message objects
 * @param {Object} sessionData - Session data including followups and decision rules
 */
export const saveChatToStorage = (userId, chatId, messages, sessionData) => {
  try {
    const chatData = {
      userId,
      chatId,
      messages,
      sessionData,
      timestamp: Date.now()
    };
    localStorage.setItem(`chat_${userId}_${chatId}`, JSON.stringify(chatData));
  } catch (error) {
    console.error('Failed to save chat to storage:', error);
  }
};

/**
 * Load chat messages from localStorage
 * @param {string} userId - User identifier
 * @param {string} chatId - Chat session identifier
 * @returns {Object|null} Chat data or null if not found
 */
export const loadChatFromStorage = (userId, chatId) => {
  try {
    const stored = localStorage.getItem(`chat_${userId}_${chatId}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load chat from storage:', error);
    return null;
  }
};

/**
 * Clear chat from localStorage
 * @param {string} userId - User identifier
 * @param {string} chatId - Chat session identifier
 */
export const clearChatFromStorage = (userId, chatId) => {
  try {
    localStorage.removeItem(`chat_${userId}_${chatId}`);
  } catch (error) {
    console.error('Failed to clear chat from storage:', error);
  }
};

/**
 * Clear all chats for a user from localStorage
 * @param {string} userId - User identifier
 */
export const clearAllUserChats = (userId) => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`chat_${userId}_`)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear user chats from storage:', error);
  }
};

/**
 * Get all chat sessions for a user
 * @param {string} userId - User identifier
 * @returns {Array} Array of chat session metadata
 */
export const getUserChatSessions = (userId) => {
  try {
    const sessions = [];
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`chat_${userId}_`)) {
        const chatData = JSON.parse(localStorage.getItem(key));
        sessions.push({
          chatId: chatData.chatId,
          timestamp: chatData.timestamp,
          messageCount: chatData.messages ? chatData.messages.length : 0
        });
      }
    });
    return sessions.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to get user chat sessions:', error);
    return [];
  }
};