# MYVIMRC

I use Vim for my daily work as a code editor as well as a text editor.
It is a very good software, it already has a lot of functionality that
everyone trying to get through extensions in code editor like VSCode,
Atom, Sublime-Text,etc. enabled by default. You can also use it on any
other OS that is available today.

Setting up Vim on Windows is little bit tricky but it works sometimes
when you have your home/environment variable setup correctly, otherwise
you need to do that manually.

This configuaration is mainly for linux user, or mac as well. I am using
it on linux and it works just fine for me. There are also a lot you can
do with Vim but I am happy with these config.

# INSTALLATIONS

## Creating main files

After installing the vim, first we need to create a configuration file
of vim (.vimrc) in our home folder

### Windows

    ::goto C:\Users\username\
    cd C:\Users\username\

    ::create a file name _vimrc
    vim _vimrc

Paste all the settings in the IMPORT section, save and exit using
\`:wq\`

### Unix/Linux

``` bash
cd ~
vim .vimrc
#Paste all the settings in the IMPORT section, save and exit using `:wq`
```

After all this we need to install vim-plug

## Preparing for vim-plug

First create an installation folder

``` bash
cd ~
mkdir .vim
cd .vim
mkdir undodir   #optional required for undodir settings
```

## Installing Vim-Plug

### Windows

Run this script in powershell this will install vim-plug

``` powershell
iwr -useb https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim |`
    ni $HOME/vimfiles/autoload/plug.vim -Force
```

### Unix/Linux

Run this script in your terminal

``` bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

For more detailed installation please visit the [vim-plug
repository](https://github.com/junegunn/vim-plug)

## Installing Plugins

Now we are ready to install plugins. First import all the plugins in our
vimrc files

``` vimscript
"After importing the plugins
"We need to save and source the file
:source %   "This will compile the file

"Reopen it and in command mode write
:PlugInstall
```

Now the listed plugins will be installed

## Extras

Now you can import other setting and keybindings if you want. You can
also set your own keybindings. For more help type: :help \<topic\> in
your vim command mode, this will open the doc inside vim

# IMPORTS

These are basically the setting that comes with vim.

The basic functionality of any command is also indicated there in the
form of comment in the source code.

    syntax on                       "Enables syntax highlighting
    filetype on
    filetype indent on
    filetype plugin on

    set encoding=UTF-8
    set backspace=indent,eol,start  "Fixing backspace to delete previous word or letters
    set backspace=2
    set tabstop=4 softtabstop=4     "Insert 3 spaces for a tab
    set shiftwidth=4                "Changes the number of spaces chanracters inserted for indentation
    set smarttab                    "Makes tabbing smarter, it realize you have 2 vs 4
    set expandtab                   "Converts tabs to spaces
    set smartindent                 "Enables smart indent
    set cmdheight=2                 "More space for displaying messages
    set nu                          "Enables numberline
    set relativenumber              "Enables relative number line
    set nowrap                      "Desable the wrapping of long line test it will be now on single line
    set smartcase                   "Only applies to search patterns that you type
    set mouse=a                     "Enables the mounse
    set splitbelow                  "Split horizontal window to below
    set splitright                  "Split the vertical window to the right
    set t_Co=256                    "Support 256 colors
    set autoindent                  "Good auto indent
    set noswapfile                  "Desable the creation of swap file for every file opened in vim
    set nobackup                    "Desable the creation of backup file in vim
    set undodir=$HOME\.vim\undodir      "Save our undo action to a particular directory
    set undofile                    "Creates a undo file
    set incsearch                   "Enables increamental search

    highlight ColorColumn ctermbg=0 guibg=lightgrey

# PLUGINS

I am using Vim-plug as my plugin manager in vim. Below are the list of
some of the plugins that I personally use. These all are really a
life-saver to me.

    call plug#begin('$HOME\vimfiles\autoload\')     "Start of vim-plug plugin listing
    "Plug 'morhetz/gruvbox'
    "rainbow brackets for vim
    Plug 'frazrepo/vim-rainbow'
    Plug 'junegunn/goyo.vim'
    "Plugin for colorschemes
    Plug 'flazz/vim-colorschemes'
    "winteractive window manager
    Plug 'romgrk/winteract.vim'
    "ex window
    Plug 'anotherproksy/ez-window'
    Plug 'felixhummel/setcolors.vim'
    Plug 'vim-scripts/Conque-Shell'
    Plug 'gko/vim-coloresque'
    "this plugin enable fullscreen by pressing ctrl + enter
    Plug 'lambdalisue/vim-fullscreen'
    Plug 'preservim/nerdtree'
    Plug 'mhinz/vim-startify'
    Plug 'leafgarland/typescript-vim'
    Plug 'vim-utils/vim-man'
    Plug 'kien/ctrlp.vim'
    Plug 'mbbill/undotree'
    "Plug 'junegunn/fzf.vim'
    Plug 'jiangmiao/auto-pairs'
    "devicons
    "Plug 'ryanoasis/vim-devicons'

    call plug#end()                 "End of vim-plug plugin listing

# THEME

Using background color as dark, and color scheme is set to gruvbox. I
imported gruvbox in the plugin section.

## Colorscheme

    colorscheme gruvbox             "Setting colorscheme to gruvbox
    set background=dark             "Set background to dark

## Font

Setting default font and font-size

    set guifont=Source\ Code\ Pro:h14

# KEYBINDINGS

Listed below these are some of my fav keybindings that I use. My leader
key is set to Space which is lot easier for me.

    let mapleader = " "             "Leader key set to <space> bar
    nnoremap <leader>h :wincmd h<CR>
    nnoremap <leader>j :wincmd j<CR>
    nnoremap <leader>k :wincmd k<CR>
    nnoremap <leader>l :wincmd l<CR>
    nnoremap <leader>u :UndotreeShow<CR>
    nnoremap <leader>pv :wincmd v<bar> :Ex <bar> :vertical resize 30<CR>
    nnoremap <Leader>ps :Rg<SPACE>
    nnoremap <silent> <Leader>+ :vertical resize +5<CR>
    nnoremap <silent> <Leader>- :vertical resize -5<CR>

    "Use alt + jklh key to resize window

    "nnoremap <M-j>  :resize -2<CR>
    "nnoremap <M-k>  :resize +2<CR>
    "nnoremap <M-h>  :vertical resize -2<CR>
    "nnoremap <M-l>  :vertical resize +2<CR>

    "Changing jk or kj to work or remap to work as escape key
    inoremap jk <Esc>
    inoremap kj <Esc>

    "Easy caps c stands for CTRL
    inoremap <c-u> <Esc>viwUi
    inoremap <c-u> viwU<Esc>

# PERSONAL PREFERENCES

Here are some of my personal preferences related to \`UI\`, sound etc.

## To desable errorbell

    set noerrorbells visualbell t_vb=
    if has('autocmd')
      autocmd GUIEnter * set visualbell t_vb=
    endif

## Last edit position

    autocmd BufReadPost *
         \ if line("'\"") > 0 && line("'\"") <= line("$") |
         \   exe "normal! g`\"" |
         \ endif

## Hide GUI

This will hide the UI component in Gvim (Graphical Vim).

    "set guioptions-=m  "menu bar
    "set guioptions-=T  "toolbar
    "set guioptions-=r  "scrollbar

## Function to enable the GUI

This function will enable the bar by pressing \<F11\>

    function! ToggleGUICruft()
      if &guioptions=='i'
        exec('set guioptions=imTrL')
      else
        exec('set guioptions=i')
      endif
    endfunction

    "Setting sortcut to <F11>
    map <F11> <Esc>:call ToggleGUICruft()<cr>

    " by default, hide gui menus
    set guioptions=i

## Fixing Ctrl+Backspace

Map Ctrl-Backspace to delete the previous word in insert mode.

    imap <C-BS> <C-W>
    noremap! <C-BS> <C-w>
    noremap! <C-h> <C-w>
    inoremap <C-w> <C-\><C-o>dB
    inoremap <C-BS> <C-\><C-o>db

## Favorite

    nnoremap <leader>w :w<CR>
    nnoremap <leader>q :q!<CR>
    nnoremap <leader>x :x<CR>

    " shortcut to switch between buffer
    map J :bn<CR>
    map K :bp<CR>

    "Changing jk or kj to work or remap to work as escape key
    inoremap jk <Esc>
    inoremap kj <Esc>

# MISCELLANEOUS

These are also some of the important settings to be imported into the
vimrc.

    let g:netrw_browse_split=2
    let g:netrw_banner = 0
    let g:netrw_winsize = 25

    let g:ctrlp_use_caching = 0

    "Set width of goyo
    "autocmd BufRead.BufNewFile /tmp/neomutt* let g:goyo_width=80
    "autocmd BufRead.BufNewFile /tmp/neomutt* :Goyo

    "using tab to navigate around the end to start of a code block
    map <TAB> %

    "Goyo
    nnoremap <leader>f :Goyo<CR>
