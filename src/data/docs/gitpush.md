# GitPush [gitpush-1]

A simple tool for git to automate some of the commonly used tasks.

# About

Whenever working in a git repository in terminal or shell, you can use
this command with desired options and it will do all your tasks
automatically.

This tool is mainly intended for Linux terminals, but it also works on
WSL for Windows (Ubuntu, Debian, Kali, or any other WSL distribution).
It can be used on any operating system that has **bash** available.

Installation and setup instructions are provided below.

# Help

If you use:

``` bash
gitpush -h
# or
gitpush --help
```

You will get a help page similar to the following:

![](https://i.imgur.com/UtIG21n.png)

# Supported Platforms

-   Any Unix / Linux distribution
-   macOS
-   Windows (via WSL)
-   Android (via Termux)

# System Requirements

-   A shell with **bash**
-   git

# Installation

## Android (Termux)

1.  Install Termux from the Play Store:
    <https://play.google.com/store/apps/details?id=com.termux>

2.  Update Termux:

    ``` bash
    pkg update
    ```

3.  Check if git is installed:

    -   Use:

        ``` bash
        git --version
        ```

    -   If not installed:

        ``` bash
        pkg install git
        ```

4.  Clone the repository:

    ``` bash
    git clone https://github.com/CISSSCO/GitPush.git
    ```

5.  Install GitPush:

    ``` bash
    ./install.sh
    ```

6.  Verify installation:

    ``` bash
    gitpush -h
    ```

## Unix / Linux / macOS

Steps are mostly similar to Android.

1.  Open Terminal or shell

2.  Check if git is installed:

    ``` bash
    git --version
    ```

3.  Clone and install:

    ``` bash
    git clone https://github.com/CISSSCO/GitPush.git
    cd GitPush
    sudo cp gitpush /usr/bin/gitpush
    ```

    For macOS, if the above does not work:

    ``` bash
    sudo cp gitpush /bin/gitpush
    # or ./install.sh
    ```

4.  Verify installation:

    ``` bash
    gitpush -h
    ```

## Windows

1.  Search for **Turn Windows features on or off**

2.  Enable **Windows Subsystem for Linux** and restart

3.  Open **cmd** or **PowerShell**

4.  Install WSL:

    ``` bash
    wsl --install
    ```

    You can also install Ubuntu or another Linux distribution from the
    Microsoft Store:
    <https://www.microsoft.com/store/productId/9N6SVWS3RX71>

5.  If you don’t want to use WSL, download git from:
    <https://git-scm.com/downloads>

6.  Open Ubuntu / another WSL distro, or run:

    ``` bash
    wsl
    ```

    Alternatively, open **Git Bash**

7.  Follow Linux steps from this point onward

8.  Check git installation:

    ``` bash
    git --version
    ```

9.  Clone and install:

    ``` bash
    git clone https://github.com/CISSSCO/GitPush.git
    cd GitPush
    #sudo cp gitpush /usr/bin/gitpush
    ./install.sh
    ```

    For Git Bash (run as Administrator):

    ``` bash
    cp -f gitpush /usr/bin/
    ```

10. Enjoy!

# How to Use

A brief documentation explaining how to use this tool is available.

Open the documentation file: [DOCUMENTATION](./DOC.org)

# Support the Project

If you are using this project and find it helpful, or if you want to
encourage further development, you can support it by:

-   Starring the repository
-   Sharing the project
-   Giving proper credit in your README when using GitPush and linking
    back to it

Thanks!

# License and Copyright

© 2021 **Cisco Ramon** Licensed under the MIT License [MIT
License](./LICENSE)
