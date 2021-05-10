export default class Toggle{
    constructor(){
        this.postsNavBar = document.querySelector(".Posts");
        this.followersNavBar = document.querySelector(".Followers");
        this.followingNavBar = document.querySelector(".Following");

        this.followers = document.querySelector(".followers-nav-bar");
        this.following = document.querySelector(".following-nav-bar");
        this.posts = document.querySelector(".posts-nav-bar");

        this.show(this.posts);
        this.postsNavBar.classList.add("active");

        this.event();
    }
    event(){
        this.followersNavBar.addEventListener("click" ,(e)=>{
            this.show(this.followers);
            this.followersNavBar.classList.add("active");
        });

        this.followingNavBar.addEventListener("click" ,(e)=>{
           this.show(this.following);
           this.followingNavBar.classList.add("active");
        });

        this.postsNavBar.addEventListener("click" ,(e)=>{
            this.show(this.posts);
            this.postsNavBar.classList.add("active");
        });
        
    }

    show(element){
        this.followers.style.display = "none";
        this.followersNavBar.classList.remove("active");
        this.following.style.display = "none";
        this.followingNavBar.classList.remove("active");
        this.posts.style.display = "none";
        this.postsNavBar.classList.remove("active");
        element.style.display = "block";
    }

   
}