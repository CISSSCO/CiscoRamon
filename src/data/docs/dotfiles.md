# Dotfiles 

This repository contains my personal dotfiles and configuration files.
It exists so I can version, maintain, and quickly reproduce my working
environment across machines.

Everything here reflects how **I** work day-to-day: shells, editor,
window manager, and desktop setup.

# Structure

High-level layout of the repository:

| Path        | Description                 |
|-------------|-----------------------------|
| bash/       | Bash configuration          |
| bspwm/      | BSPWM window manager        |
| emacs/doom/ | Doom Emacs configuration    |
| picom/      | Picom compositor            |
| polybar/    | Polybar setup               |
| rice/r1/    | Desktop ricing / theming    |
| rofi/       | Rofi launcher configuration |
| sxhkd/      | Hotkey bindings             |
| vim/        | Vim configuration           |
| zsh/        | Zsh configuration           |
| .xinitrc    | X session startup           |

# Philosophy

-   Explicit, minimal, and reproducible
-   Modular configs instead of monolithic files
-   Version control over ad-hoc tweaks
-   No secrets or machine-specific state committed

# Setup

Clone the repository:

``` bash
git clone https://github.com/CISSSCO/dotfiles.git ~/.dotfiles
```

Symlink what I need on a given machine (example):

``` bash
ln -sf ~/.dotfiles/zsh/.zshrc ~/.zshrc
ln -sf ~/.dotfiles/.xinitrc ~/.xinitrc
```

I intentionally do not use an all-in-one installer. I link only what I
actually want on that system.

# Editing & Updating

I edit configs directly inside this repo, test locally, then commit.

``` bash
git status
git commit -am "update polybar layout"
git push
```

# Notes

-   Some configs may assume Arch Linux or similar setups.
-   Fonts, themes, and system packages are **not** managed here.
-   Local overrides (machine-specific tweaks) stay untracked.

This repo is primarily for my own use, but structured cleanly enough to
reuse or adapt elsewhere.
