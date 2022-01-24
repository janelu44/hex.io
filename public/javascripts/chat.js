let chatBox = document.querySelector('div.chat');
let chatInput = document.querySelector('div.chat > input');

let messageBubble = document.querySelector('div.message-bubble');
let messageContent = document.querySelector('p.message-text');
messageContent.innerHTML = '';
let messageInterval = undefined;


let chatDisplay = false;

document.addEventListener('keypress', function(e) {
    if(e.code === 'Enter') {
        if(chatDisplay) {
            if(messageInterval != undefined) {
                clearInterval(messageInterval);
            }
            chatBox.classList.remove('shown');
            let message = chatInput.value.replace(/\s+/g,' ').trim();
            if(message != '') {
                messageContent.innerHTML = message;
                messageBubble.classList.add('display');
                messageInterval = setInterval(() => {
                    messageBubble.classList.remove('display');
                }, 3000);
            }
            chatInput.value = '';

        } else {
            chatBox.classList.add('shown');
            chatInput.focus();
        }
        chatDisplay = !chatDisplay;
    }
});