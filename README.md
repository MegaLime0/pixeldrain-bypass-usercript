# Pixeldrain Download Limit Bypass

> [!Warning]
> Get the better version from the official bypass website. I hope it was useful while it lasted.
> Huge thanks to everyone who added improvements and gave feedback - it was a pleasure.

### Install
You can install the extension using this [link](https://github.com/MegaLime0/pixeldrain-bypass-usercript/raw/refs/heads/main/bypass_script.user.js)

### Usage
After enabling this script, two extra buttons will appear on the Pixeldrain download site, in the left side menu.
The first button "Download Bypass" will start downloading the file using the bypass link.
The second button "Show Bypass Links" creates a small popup window that contains the bypassed links of every file in the current Pixeldrain library.
This only useful when you want to use the bypass links in an external download manager, otherwise the first button will start downloading all files automatically.

### Note
The "Show Bypass Links" button is kinda buggy for now, especially when using it in a pixeldrain folder.
It works best when you aren't viewing a specific file in the folder. If you are, click this button and refresh the page 
![Image showing button](https://i.imgur.com/RoEzoh1.png)

Also, a user reported that certain vpn providers might block access to the bypass website making it impossible for the usercript to work.
I would advise against disabling the vpn, but just know that this is a possible cause for the usercript to fail.

### TODO
- ~~Fix show bypass links on single files~~
- Store all the links on page load
- Add event listeners to gallery files so that when clicked they add the bypass buttons to the changed website structure. same needs to be done when the gallery button (top left) is clicked
- Show file names next to url's in popup box
- Update the main page for the userscript

### Credits
Written by [MegaLime0](https://github.com/MegaLime0), [honey](https://github.com/hhoneeyy) and [Nurarihyon](https://greasyfork.org/en/users/723993-nurarihyonmaou)

Possible thanks to [Bypass site](https://pixeldrain-bypass.cybar.xyz/) by GameDrive
