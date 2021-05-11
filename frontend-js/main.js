import Search from './modules/search'
import Toggle from './modules/toggle-view-profile'
import Chat from './modules/chat'
import Validate from './modules/form-validation';

if(document.querySelector(".header-search-icon")){
    new Search();
}

if(document.querySelector(".Post") || document.querySelector(".Followers") || document.querySelector(".Following"))
{
    new Toggle();
}
if(document.querySelector(".header-chat-icon"))
{
    new Chat();
}

if(document.querySelector("#registration-form"))
{
    new Validate();
}
