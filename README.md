# Voxer

Welcome to Voxer, a unique social experiment where the community holds the power. Engage in discussions, share your views, and use your votes to directly moderate content, steering the platform away from centralized control. Join Voxer and shape the conversation in a truly democratic space.

**Visit Production Domain @ https://www.voxerforums.com for a demo**

## Run

Clone this repository

```
cd voxer
npm install
npm run dev
```

To run locally, set up the values in the example.env, otherwise visit the production domain above for easy viewing.

For easy testing, modify the cooldown NODE_ENV === 'development' values in the config.ts to your preference.

## Features

- **Early Version of Community-Driven Moderation Now Available!**: Users now have the power to moderate content through community votes, ensuring that the community's standards are upheld without centralized control.
- **Engaging Discussions**: Start conversations, participate in debates, and connect with others who share your interests in a dynamic and interactive environment.
- **Rich User Profiles**: Create and customize your profile to express your identity in the Voxer community.

## License

This project is released under the Custom Restricted Use License. This license allows cloning and running the software locally for demonstration purposes but restricts deployment and significant modification. For more details, see the [LICENSE](/LICENSE.txt) file in this repository.


## Snapshots

### Your Own Home Page

![Home](/public/readme-assets/home.png?raw=true "Personalization coming soon!")

### Post Creation

![Post Creation](/public/readme-assets/postfunctionality.png?raw=true "Create and share your thoughts")

Create posts easily and share your thoughts with the community. Whether it's text, images, or videos, sharing content is seamless.

### Nested Comment Creation

![Comment Creation](/public/readme-assets/nestedcomments.png?raw=true "Engage with the community")

Dive into discussions by commenting on posts. Your voice contributes to shaping the narrative and influencing what content is most visible.

### User Authentication

![User Authentication](/public/readme-assets/googleauth.png?raw=true "Secure and straightforward login")

Join Voxer with a straightforward and secure authentication process. Get started in minutes and begin your journey in this democratic space.

### Post Cooldowns

![Post Cooldowns](/public/readme-assets/postcooldown.png?raw=true "Jussst enough spamming")

If we're going to be a community moderated platform, we will need to fine tune the rate at which users can post over time such that content can effectively be protected or voxxed.

### Vote Cooldowns

![User Authentication](/public/readme-assets/votecooldown.png?raw=true "Jussst enough spamming")

The same goes for votes, we don't want too much spam.

### User profiles and Multiuser Support

![Followers and Follows](/public/readme-assets/userprofiles.png?raw=true "Connect with others")

Follow other users to keep up with their posts and comments. Build your network and cultivate a following of your own.

### Edit Profile

![Edit Profile](/public/readme-assets/editprofile.png?raw=true "Your space to express")

Customize your user profile to reflect your personality. Your profile is your space to express who you are and what you stand for.

### Search Functionality

![Search](/public/readme-assets/searchfunctionality.png?raw=true "Find friend or foe")

Voxer's vision is to disallow blocking. If you wan't to Vox someone out, you will be able to find them. Watch your back!

### Full Site Light Mode Support

![Light Mode](/public/readme-assets/fullsitelightmode.png?raw=true "It's your preference")

For the ones who go outside.

### Carousel Post Functionality

![Expand a post](/public/readme-assets/carouselposts.png?raw=true "See whats up")

Scroll and explore the content your fellow Voxers publish.

### Vote History

![Keep track](/public/readme-assets/votehistory.png?raw=true "Vox a foe, protect a friend")

### Early post and comment moderation

![Post Moderation](/public/readme-assets/postmoderation.png?raw=true "You choose what posts you see")

![Comment Moderation](/public/readme-assets/commentmoderation.png "You choose what comments you see")

Since Voxer is community moderated, users are given cooldowns for voting and posting. If a post reaches a certain ratio of downvotes to upvotes, their post is banished (Voxxed). Your recently voted Voxes is where you'll head if there's someone you want to banish or protect.