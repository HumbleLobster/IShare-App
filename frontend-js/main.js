import Search from './modules/search'
import Toggle from './modules/toggle-view-profile'
import Chat from './modules/chat'

if(document.querySelector(".header-search-icon")){
    new Search();
}

if(document.querySelector(".Post") || document.querySelector(".Followers") || document.querySelector(".Following"))
{
    new Toggle();
}

new Chat();