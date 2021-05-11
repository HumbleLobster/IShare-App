export default class Chat {
    
    constructor(){
        this.socket = io();
        this.id;
        this.chatIcon = document.querySelector(".header-chat-icon");
        this.resultArea;
        this.closeChatIcon = document.querySelector(".chat-title-bar-close");
        this.chatmodel = document.querySelector(".chat-wrapper");
        this.chatForm = document.querySelector(".chat-form");
        this.chatField = document.querySelector(".chat-field");
        this.event();
        this.chat();
    }


    chat(){
        this.socket.on('chat message', function(data) {
            this.resultArea = document.querySelector(".chat-log");
            console.log(data);
            if(!(this.id == data.id)){
                this.resultArea.innerHTML+= `
                <div class="chat-other">
                <a href="#"><img class="avatar-tiny" src="${data.user.avatar}"></a>
                <div class="chat-message"><div class="chat-message-inner">
                <a href="/profile/${data.user.username}"><strong>${data.user.username}:</strong></a>
                ${data.message}
                </div></div></div>`
            } else {
                this.resultArea.innerHTML+=`
                <div class="chat-self">
                    <div class="chat-message">
                    <div class="chat-message-inner">
                        ${data.message}
                    </div>
                    </div>
                    <img class="chat-avatar avatar-tiny" src="${data.user.avatar}">
                </div>`
            }

            this.resultArea.scrollTo(0, this.resultArea.scrollHeight);
          });
    }

    event(){
        this.chatIcon.addEventListener("click" , ()=>{
            this.chatField.focus();
            this.showChatModel();
            this.chatFormUtility();
        });

        this.closeChatIcon.addEventListener("click" , ()=>{
            this.closeChatModel();
        })
    }

    showChatModel(){
        this.chatmodel.classList.add("chat--visible");
    }

    closeChatModel(){
        this.chatmodel.classList.remove("chat--visible");
    }

    chatFormUtility(){
        this.chatForm.addEventListener("submit" , (e)=>{
            e.preventDefault();
            if(this.chatField.value){
                this.id = this.socket.id;
                this.socket.emit('chat message', this.chatField.value);
                this.chatField.value = '';
            }
        })
    }

}