/*
 * Live Chat Widget - Telegram Bot Integration
 * Heather Free Version Theme
 */

(function() {
    'use strict';

    var chatToggle = document.getElementById('live-chat-toggle');
    var chatWidget = document.getElementById('live-chat-widget');
    var chatClose = document.getElementById('live-chat-close');
    var chatInput = document.getElementById('live-chat-input');
    var chatMessages = document.getElementById('live-chat-messages');

    var BOT_TOKEN = '7561789917:AAFo1MemMZ-rcDV026TWA4c1QEik_iTS3MA';
    var CHAT_ID = '1392464241'; // Your Telegram chat ID

    var lastUpdateId = 0;
    var chatHistory = JSON.parse(localStorage.getItem('telegram_chat_history') || '[]');

    if (chatToggle && chatWidget) {
        // Toggle chat widget
        chatToggle.addEventListener('click', function() {
            if (chatWidget.style.display === 'flex') {
                chatWidget.style.display = 'none';
                chatToggle.classList.remove('active');
            } else {
                chatWidget.style.display = 'flex';
                chatToggle.classList.add('active');
                // Focus on input when opened
                if (chatInput) chatInput.focus();
                // Start polling for new messages when chat is opened
                startPolling();
            }
        });

        // Close chat widget
        if (chatClose) {
            chatClose.addEventListener('click', function() {
                chatWidget.style.display = 'none';
                chatToggle.classList.remove('active');
                stopPolling();
            });
        }

        // Handle chat input - Send to Telegram Bot
        if (chatInput) {
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && this.value.trim() !== '') {
                    var userMessage = this.value.trim();
                    this.value = '';

                    // Add user message to chat
                    addMessage(userMessage, 'user-message');

                    // Send message to Telegram bot
                    sendToTelegram(userMessage);
                }
            });
        }

        // Function to send message to Telegram bot
        function sendToTelegram(message) {
            var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';
            var data = {
                chat_id: CHAT_ID,
                text: 'New message from website:\n\n' + message,
                parse_mode: 'HTML'
            };

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (!data.ok) {
                    console.error('Telegram API Error:', data);
                    addMessage('Failed to send message. Please try again.', 'bot-message error');
                }
            })
            .catch(error => {
                console.error('Error sending message to Telegram:', error);
                addMessage('Failed to send message. Please check your connection.', 'bot-message error');
            });
        }

        // Function to poll for new messages from Telegram
        var pollingInterval;
        function startPolling() {
            if (pollingInterval) return; // Already polling

            pollingInterval = setInterval(function() {
                checkForNewMessages();
            }, 5000); // Check every 5 seconds
        }

        function stopPolling() {
            if (pollingInterval) {
                clearInterval(pollingInterval);
                pollingInterval = null;
            }
        }

        function checkForNewMessages() {
            var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/getUpdates';
            if (lastUpdateId > 0) {
                url += '?offset=' + (lastUpdateId + 1);
            }

            fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.ok && data.result && data.result.length > 0) {
                    data.result.forEach(function(update) {
                        console.log('Received update:', update); // Debug log

                        // Check if this is a message from the admin (not from bot)
                        if (update.message &&
                            update.message.from &&
                            update.message.from.is_bot !== true &&
                            update.message.text &&
                            !isMessageAlreadyDisplayed(update.update_id)) {

                            // This is a new message from the admin
                            var adminMessage = update.message.text;
                            console.log('Adding admin message:', adminMessage); // Debug log
                            addMessage(adminMessage, 'admin-message');

                            // Mark as displayed
                            markMessageAsDisplayed(update.update_id);
                        }

                        if (update.update_id > lastUpdateId) {
                            lastUpdateId = update.update_id;
                        }
                    });
                } else {
                    console.log('No new updates or error:', data); // Debug log
                }
            })
            .catch(error => {
                console.error('Error checking for new messages:', error);
            });
        }

        function isMessageAlreadyDisplayed(updateId) {
            var displayedMessages = JSON.parse(localStorage.getItem('displayed_messages') || '[]');
            return displayedMessages.includes(updateId);
        }

        function markMessageAsDisplayed(updateId) {
            var displayedMessages = JSON.parse(localStorage.getItem('displayed_messages') || '[]');
            displayedMessages.push(updateId);
            localStorage.setItem('displayed_messages', JSON.stringify(displayedMessages));
        }

        // Function to add messages to chat
        function addMessage(text, className) {
            if (chatMessages) {
                var messageDiv = document.createElement('div');
                messageDiv.className = 'message ' + className;
                messageDiv.innerHTML = '<p>' + text + '</p>';

                // Add timestamp
                var timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                messageDiv.innerHTML += '<span class="message-time">' + timestamp + '</span>';

                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Save to chat history
                saveMessageToHistory(text, className, timestamp);
            }
        }

        // Function to save message to history
        function saveMessageToHistory(text, className, timestamp) {
            chatHistory.push({
                text: text,
                className: className,
                timestamp: timestamp
            });

            // Keep only last 50 messages
            if (chatHistory.length > 50) {
                chatHistory = chatHistory.slice(-50);
            }

            localStorage.setItem('telegram_chat_history', JSON.stringify(chatHistory));
        }

        // Function to load chat history
        function loadChatHistory() {
            chatHistory.forEach(function(msg) {
                if (chatMessages) {
                    var messageDiv = document.createElement('div');
                    messageDiv.className = 'message ' + msg.className;
                    messageDiv.innerHTML = '<p>' + msg.text + '</p><span class="message-time">' + msg.timestamp + '</span>';
                    chatMessages.appendChild(messageDiv);
                }
            });

            if (chatMessages && chatHistory.length > 0) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }

        // Load chat history on page load
        loadChatHistory();
    }
})();