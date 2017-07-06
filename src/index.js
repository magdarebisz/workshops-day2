/* eslint-disable no-plusplus */

// 1
const audio = document.querySelector('.audio');
// 4
const playBtn = document.querySelector('.controls__play');
// 5
const pauseBtn = document.querySelector('.controls__pause');
// 33
const prevBtn = document.querySelector('.controls__backward');
// 34
const nextBtn = document.querySelector('.controls__forward');
// 14
const timeInfo = document.querySelector('.audio-info__time');
// 29 *
const titleInfo = document.querySelector('.audio-info__title');
// 29 **
const authorInfo = document.querySelector('.audio-info__author');
// 17
const progressValue = document.querySelector('.progress__value');
// 39
const body = document.querySelector('body');

// 15
const RADIUS = 198;
// 16
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// 21
const songsFolder = 'src/assets/audio';
// 31
const imagesFolder = 'src/assets/images';
// 24
const songs = [];
// 32
const backgrounds = [];
// 26
let currentSongIndex;
// 28
const assignPath = ({ path }) => {
  audio.src = path;
};
// 27
const setUpNewIndex = (index) => {
  currentSongIndex = index;
};
// 2
const play = () => {
  audio.play();
};
// 3
const pause = () => {
  audio.pause();
};
// 25
const loadFirstSong = () => {
  if (!audio.querySelector('source[src$=mp3]')) {
    setUpNewIndex(0);
    assignPath(songs[currentSongIndex]);
    play();
  }
};
// 9
const showPauseBtn = () => {
  pauseBtn.style.opacity = 1;
  playBtn.style.opacity = 0;
};
// 10
const showPlayBtn = () => {
  playBtn.style.opacity = 1;
  pauseBtn.style.opacity = 0;
};
// 8
const playAudio = () => {
  if (audio.paused) {
    play();
    showPauseBtn();
  } else {
    pause();
    showPlayBtn();
  }
};
// 38
const updateBackground = () => {
  body.style.background = `url(${backgrounds[currentSongIndex]}) no-repeat center center fixed`;
  body.style.backgroundSize = 'cover';
};
// 29
const updateTitleAndAuthor = () => {
  const { title, author } = songs[currentSongIndex];
  titleInfo.innerHTML = title;
  authorInfo.innerHTML = author;
};
// 40
const prevSong = () => {
  setUpNewIndex(--currentSongIndex);
  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }
  assignPath(songs[currentSongIndex]);
  play();
  updateTitleAndAuthor();
  updateBackground();
};
// 37
const nextSong = () => {
  setUpNewIndex(++currentSongIndex);
  if (currentSongIndex === songs.length) {
    currentSongIndex = 0;
  }
  assignPath(songs[currentSongIndex]);
  play();
  updateBackground();
  updateTitleAndAuthor();
};
// 42
const autoPlayNextSong = () => {
  assignPath(songs[++currentSongIndex]);
  play();
  if (currentSongIndex === songs.length - 1) {
    setUpNewIndex(0);
  }
  updateTitleAndAuthor();
  updateBackground();
};
// 23
const getMetaSong = (path) => {
  const extractedInfo = path.replace(/.mp3|http:\/\/localhost:8080\/src\/assets\/audio\//gi, '');
  const index = extractedInfo.indexOf('-');
  const result = {
    author: extractedInfo.substring(0, index),
    title: extractedInfo.substring(index + 1),
  };
  return result;
};
// 13
const showTime = () => {
  // const { duration, currentTime } = audio;
  if (audio.duration) {
    timeInfo.innerHTML = parseInt(audio.duration - audio.currentTime, 10) + 'sec';
  } else {
    timeInfo.innerHTML = '\u00A0';
  }
  // timeInfo.innerHTML = duration ? `-${parseInt(duration - currentTime, 10)} sec` : '\u00A0';
};
// 14
const progress = (value) => {
  const progressOffset = value / 100;
  const dashoffset = CIRCUMFERENCE * (1 - progressOffset);
  progressValue.style.strokeDashoffset = dashoffset;
};
// 18
const updateProgress = () => {
  const progressPercentage = (audio.currentTime / audio.duration) * 100;
  progress(progressPercentage);
};
// 19
progressValue.style.strokeDasharray = CIRCUMFERENCE;
// 22
const extractLinks = (data) => {
  const el = document.createElement('html');
  el.innerHTML = data;
  const links = [...el.querySelectorAll('#files a')];
  el.remove();
  return links;
};
// 12
const timeUpdateHandler = () => {
  showTime();
  updateProgress();
};
// 6
playBtn.addEventListener('click', playAudio);
// 7
pauseBtn.addEventListener('click', playAudio);
// 35
prevBtn.addEventListener('click', prevSong);
// 36
nextBtn.addEventListener('click', nextSong);
// 11
audio.addEventListener('timeupdate', timeUpdateHandler);
// 41
audio.addEventListener('ended', autoPlayNextSong);
// 20
fetch(songsFolder, {
  method: 'get',
}).then(response => response.text())
  .then((text) => {
    const links = extractLinks(text);
    links.forEach((link) => {
      if (link.href.indexOf('mp3') > -1) {
        const metaSong = getMetaSong(link.href);
        const path = link.href;
        const result = Object.assign({}, path, metaSong);
        // const result = { path, ...metaSong };
        songs.push(result);
      }
    });
    loadFirstSong();
    updateTitleAndAuthor();
    showTime();
  }).catch(error => console.error('error', error)); // eslint-disable-line no-console
// 30
fetch(imagesFolder, {
  method: 'get',
}).then(response => response.text())
  .then((text) => {
    const links = extractLinks(text);
    links.forEach((link) => {
      if (link.href.indexOf('jpg') > -1) {
        backgrounds.push(link.href.substring(link.href.indexOf('/src')));
      }
    });
  }).catch(error => console.error('error', error)); // eslint-disable-line no-console
