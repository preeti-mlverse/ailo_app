import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NovaMascot } from '../NovaMascot';
import { aiAPI } from '../../utils/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  context?: string;
}

export const NovaChatbot: React.FC<Props> = ({ visible, onClose, context }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Nova, your learning assistant. Ask me anything about your lessons!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, visible]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await aiAPI.chat(userMessage.text, context);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response || "I'm having trouble understanding. Can you rephrase?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again!",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <NovaMascot animation="happy" size={40} />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Nova</Text>
              <Text style={styles.headerSubtitle}>AI Learning Assistant</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.isUser ? styles.userMessage : styles.aiMessage,
              ]}
            >
              {!message.isUser && (
                <View style={styles.aiAvatar}>
                  <NovaMascot animation="idle" size={24} />
                </View>
              )}
              <View
                style={[
                  styles.messageContent,
                  message.isUser ? styles.userMessageContent : styles.aiMessageContent,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.isUser ? styles.userMessageText : styles.aiMessageText,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
            </View>
          ))}
          {loading && (
            <View style={[styles.messageBubble, styles.aiMessage]}>
              <View style={styles.aiAvatar}>
                <NovaMascot animation="think" size={24} />
              </View>
              <View style={[styles.messageContent, styles.aiMessageContent]}>
                <Text style={styles.typingText}>Nova is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask Nova anything..."
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || loading}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? '#1E1E2E' : '#666'}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#2D2D3D',
    borderBottomWidth: 1,
    borderBottomColor: '#3D3D4D',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#A0A0B0',
  },
  closeButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    marginRight: 8,
    marginTop: 4,
  },
  messageContent: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  userMessageContent: {
    backgroundColor: '#FFD700',
  },
  aiMessageContent: {
    backgroundColor: '#2D2D3D',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#1E1E2E',
  },
  aiMessageText: {
    color: '#FFFFFF',
  },
  typingText: {
    fontSize: 14,
    color: '#A0A0B0',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#2D2D3D',
    borderTopWidth: 1,
    borderTopColor: '#3D3D4D',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#3D3D4D',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#3D3D4D',
  },
});
