# Yougle - frontend

The modern era provides a variety of messaging services, and almost everyone uses more than one. You may use Slack for work, Discord for gaming, and basic text messages for communicating with your friends. With all these services, it is easy to forget when and with what app you sent a message, and while they all individually provide functionality to search for messages, no app exists that can search them all. 

Yougle aims to solve this problem by conveniently searching for message content across all the messaging apps you use, so when you can’t find that important Slack message from your boss or that goofy text message from your friend, Yougle is the solution for you.

## Prerequisites

To enable the Slack OAuth integration, Yougle must be accessible via HTTPS on [yougle.local.gd](https://yougle.local.gd).

To do this, install [mkcert](https://github.com/FiloSottile/mkcert), run `mkcert -install`, then run `mkcert yougle.local.gd` inside the Yougle folder.
This should create `yougle.local.gd.pem` and `yougle.local.gd-key.pem`, which will be used when running the frontend.

## Running

Before running the frontend, you must also run the [backend](https://github.com/ehendrich05111/yougle_api). Clone the repo, install packages using `npm i`, and run using `npm run dev`.

Finally, you can run the frontend by first installing packages using `npm i` then running `npm run dev`. You should be redirected to [yougle.local.gd](https://yougle.local.gd).
