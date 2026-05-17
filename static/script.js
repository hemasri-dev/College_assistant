document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chat-form");
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const themeToggleBtn = document.getElementById("theme-toggle");

    // Theme logic
    const toggleTheme = () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        themeToggleBtn.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    };

    // Set initial theme based on system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeToggleBtn.addEventListener("click", toggleTheme);

    // Format current time
    const getCurrentTime = () => {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    };

    // Scroll to bottom
    const scrollToBottom = () => {
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    // Append message to chat
    const appendMessage = (message, sender) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", `${sender}-message`);
        
        messageDiv.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-time">${getCurrentTime()}</div>
        `;
        
        // Insert before typing indicator if it exists
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            chatBox.insertBefore(messageDiv, typingIndicator);
        } else {
            chatBox.appendChild(messageDiv);
        }
        scrollToBottom();
    };

    // Show/hide typing indicator
    const showTypingIndicator = () => {
        const typingDiv = document.createElement("div");
        typingDiv.id = "typing-indicator";
        typingDiv.classList.add("typing-indicator");
        typingDiv.innerHTML = `<span></span><span></span><span></span>`;
        typingDiv.style.display = "block";
        chatBox.appendChild(typingDiv);
        scrollToBottom();
    };

    const removeTypingIndicator = () => {
        const typingDiv = document.getElementById("typing-indicator");
        if (typingDiv) {
            typingDiv.remove();
        }
    };

    // Form submission logic
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to UI
        appendMessage(message, "user");
        userInput.value = "";
        
        // Show typing indicator
        showTypingIndicator();

        try {
            // Simulate slight network delay for better UX (500ms)
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            
            removeTypingIndicator();
            appendMessage(data.response, "bot");

        } catch (error) {
            console.error("Error communicating with server:", error);
            removeTypingIndicator();
            appendMessage("Sorry, I'm having trouble connecting right now. Please try again later.", "bot");
        }
    });
});
