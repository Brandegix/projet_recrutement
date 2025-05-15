import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils"

//  Mock API and WebSocket functions (replace with your actual API calls and WebSocket setup)
const mockFetchMessages = async (candidateId) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock message data (replace with actual data from your backend)
    const mockMessages = [
        {
            id: '1',
            senderId: 'recruiter1',
            senderName: 'Acme Corp Recruiter',
            recipientId: candidateId,
            content: 'Thank you for your application. We would like to schedule an interview.',
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
            isRead: false,
        },
        {
            id: '2',
            senderId: 'recruiter2',
            senderName: 'Stark Industries HR',
            recipientId: candidateId,
            content: 'Your application is under review.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            isRead: true,
        },
        {
            id: '3',
            senderId: 'recruiter1',
            senderName: 'Acme Corp Recruiter',
            recipientId: candidateId,
            content: 'Please confirm your availability for next week.',
            timestamp: new Date().toISOString(),
            isRead: false
        }
    ];
    return mockMessages;
};

const mockWebSocket = {
    onMessage: (callback) => {
        // Simulate receiving a message (replace with actual WebSocket event listener)
        setTimeout(() => {
            const simulatedMessage = {
                id: '4',
                senderId: 'recruiter3',
                senderName: 'FutureTech Hiring Manager',
                recipientId: 'candidate123', //  Replace with actual candidate ID
                content: 'We have a new opportunity that matches your profile!',
                timestamp: new Date().toISOString(),
                isRead: false,
            };
            callback(simulatedMessage);
        }, 2000); // Simulate message after 2 seconds
    },
    close: () => { }
};

const CandidateMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState({ id: 'candidate123', name: 'John Doe' }); // Replace with actual user data
    const ws = mockWebSocket; // Replace with your actual WebSocket instance

    // Fetch messages for the current candidate
    const fetchMessages = useCallback(async (candidateId) => {
        setLoading(true);
        try {
            const fetchedMessages = await mockFetchMessages(candidateId);
            setMessages(fetchedMessages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            // Handle error (e.g., show error message to user)
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages(currentUser.id);

        // Simulate WebSocket connection (replace with your actual WebSocket setup)
        const handleNewMessage = (newMessage) => {
            // Check if the message is for the current user
            if (newMessage.recipientId === currentUser.id) {
                setMessages(prevMessages => [newMessage, ...prevMessages]);
            }
        };

        ws.onMessage(handleNewMessage);

        return () => {
            ws.close(); // Clean up WebSocket connection
        };
    }, [currentUser.id, fetchMessages]);

    const markAsRead = (messageId) => {
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.id === messageId ? { ...msg, isRead: true } : msg
            )
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
                <MessageCircle className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">My Messages</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <p>No messages to display.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className={cn(
                                    "p-4 rounded-lg border",
                                    message.isRead
                                        ? "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700"
                                        : "bg-white dark:bg-gray-700 border-blue-100 dark:border-blue-900 shadow-sm"
                                )}
                                onClick={() => !message.isRead && markAsRead(message.id)}
                            >
                                <div className="flex items-start gap-4">
                                    <Avatar>
                                        <AvatarImage src={`https://randomuser.me/api/portraits/men/${parseInt(message.senderId.slice(-1), 10)}.jpg`} alt={message.senderName} />
                                        <AvatarFallback>{message.senderName.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{message.senderName}</h3>
                                            <time
                                                dateTime={message.timestamp}
                                                className="text-xs text-gray-500 dark:text-gray-400"
                                            >
                                                {new Date(message.timestamp).toLocaleString()}
                                            </time>
                                        </div>
                                        <p className={cn(
                                            "text-sm",
                                            message.isRead ? "text-gray-600 dark:text-gray-300" : "text-gray-900 dark:text-white font-medium"
                                        )}>
                                            {message.content}
                                        </p>
                                    </div>
                                </div>
                                {!message.isRead && (
                                    <div className="mt-2 flex justify-end">
                                        <Badge variant="secondary" className="bg-blue-500 text-white">New</Badge>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default CandidateMessages;
