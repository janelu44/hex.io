// ask user for a nickname
window.nickname = prompt('Enter nickname: ', 'player');
// capitalize first letter
window.nickname = window.nickname.charAt(0).toUpperCase() + window.nickname.slice(1);
