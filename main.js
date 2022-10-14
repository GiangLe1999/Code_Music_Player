const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $(".playlist");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const PLAYER_STORAGE_KEY = "App_Storage";
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Kiss The Rain",
      singer: "Yiruma",
      path: "./assets/musics/song1.mp3",
      image: "./assets/img/img1.jpg",
    },
    {
      name: "River Flow In You",
      singer: "Yiruma",
      path: "./assets/musics/song2.mp3",
      image: "./assets/img/img2.jpg",
    },
    {
      name: "Wait There",
      singer: "Yiruma",
      path: "./assets/musics/song3.mp3",
      image: "./assets/img/img3.png",
    },
    {
      name: "May Be",
      singer: "Yiruma",
      path: "./assets/musics/song4.mp3",
      image: "./assets/img/img4.webp",
    },
    {
      name: "Tears On Love",
      singer: "Yiruma",
      path: "./assets/musics/song5.mp3",
      image: "./assets/img/img5.jpg",
    },
    {
      name: "When The Love Falls",
      singer: "Yiruma",
      path: "./assets/musics/song6.mp3",
      image: "./assets/img/img6.jpg",
    },
    {
      name: "As You Wish",
      singer: "Yiruma",
      path: "./assets/musics/song7.mp3",
      image: "./assets/img/img7.jpg",
    },
    {
      name: "Destiny Of Love",
      singer: "Yiruma",
      path: "./assets/musics/song8.mp3",
      image: "./assets/img/img8.jpg",
    },
  ],
  defineProperties() {
    Object.defineProperty(this, "currentSong", {
      get() {
        return this.songs[this.currentIndex];
      },
    });
  },
  loadCurrentSong() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
  },
  handleEvents() {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 30000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
      }
    };
    progress.onchange = function (e) {
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;
    };
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollActiveSongIntoView();
    };
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollActiveSongIntoView();
    };
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
    playlist.onclick = function (e) {
      const nodeSong = e.target.closest(".song:not(.active)");
      if (nodeSong || e.target.closest(".option")) {
        if (nodeSong) {
          _this.currentIndex = Number(nodeSong.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  nextSong() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong() {
    let newIndex = Math.floor(Math.random() * this.songs.length);
    if (newIndex === this.currentIndex) {
      newIndex = Math.floor(Math.random() * this.songs.length);
    }
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  scrollActiveSongIntoView() {
    const activeSong = $(".song.active");
    if (this.currentIndex < 3) {
      activeSong.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      activeSong.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  },
  setConfig(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  loadConfig() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  render() {
    const htmls = this.songs
      .map((song, index) => {
        return `<div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index = "${index}">
      <div class="thumb" style="background-image: url('${song.image}')">
      </div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>`;
      })
      .join("");
    playlist.innerHTML = htmls;
  },
  start() {
    this.loadConfig();
    this.render();
    this.handleEvents();
    this.defineProperties();
    this.loadCurrentSong();
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};
app.start();
