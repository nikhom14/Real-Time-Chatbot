const chatWindow = document.getElementById('chatWindow');
const messageInput = document.getElementById('messageInput');

function addMessage(content, isUser = false, timestamp = null) {
    const welcomeMsg = chatWindow.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const labelDiv = document.createElement('div');
    labelDiv.className = 'above-label';
    labelDiv.textContent = isUser ? 'You:' : 'Bot:';
    contentDiv.appendChild(labelDiv);

    const textSpan = document.createElement('span');
    textSpan.className = 'message-text';
    textSpan.textContent = content;
    contentDiv.appendChild(textSpan);

    if (timestamp && !isUser) {
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = timestamp;
        contentDiv.appendChild(timeDiv);
    }

    messageDiv.appendChild(contentDiv);
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessageToServer(message) {
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return {
            response: "I'm sorry, I'm having trouble connecting right now. Please try again.",
            time: new Date().toLocaleTimeString()
        };
    }
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    messageInput.value = '';

    const data = await sendMessageToServer(message);
    addMessage(data.response, false, data.time);
}

async function sendQuickMessage(message) {
    addMessage(message, true);

    const data = await sendMessageToServer(message);
    addMessage(data.response, false, data.time);
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

window.addEventListener('load', () => {
    messageInput.focus();
});
