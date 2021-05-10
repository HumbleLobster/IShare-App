import Search from './modules/search'
import Toggle from './modules/toggle-view-profile'

if(document.querySelector(".header-search-icon")){
    new Search();
}

new Toggle();