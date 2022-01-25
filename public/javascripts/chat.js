function init_chat() {
    let chatBox = document.querySelector('div.chat');
    let chatInput = document.querySelector('div.chat > input');

    let messageBubble = document.querySelector('div.' + window.gameData.playerType + '.half div.message-bubble');
    let messageContent = document.querySelector('div.' + window.gameData.playerType + '.half p.message-text');

    messageContent.innerHTML = '';
    let chatDisplay = false;

    document.addEventListener('keypress', function(e) {
        if(e.code === 'Enter') {
            if(chatDisplay) {
                chatBox.classList.remove('shown');
                let message = chatInput.value.replace(/\s+/g,' ').trim();
                if(message != '') {
                    displayMessage(message, messageBubble, messageContent);
                }
                chatInput.value = '';
                chatInput.blur();

            } else {
                chatBox.classList.add('shown');
                chatInput.focus();
            }
            chatDisplay = !chatDisplay;
        }
    });

    document.addEventListener('keyup', function(e) {
        if(e.key === 'Escape') {
            chatBox.classList.remove('shown');
            chatInput.value = '';
            chatInput.blur();
            chatDisplay = false;
        }
    });
}

let messageInterval = undefined;
function displayMessage(message, bubble, content) {
    if(messageInterval != undefined) {
        clearInterval(messageInterval);
    }
    content.innerHTML = message;
    bubble.classList.add('display');
    messageInterval = setInterval(() => {
        bubble.classList.remove('display');
    }, 3000);

}