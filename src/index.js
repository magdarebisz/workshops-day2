/* eslint-disable no-plusplus */

const audio = document.querySelector('.audio');
const playBtn = document.querySelector('.controls__play');
const pauseBtn = document.querySelector('.controls__pause');
const prevBtn = document.querySelector('.controls__backward');
const nextBtn = document.querySelector('.controls__forward');
const timeInfo = document.querySelector('.audio-info__time');
const titleInfo = document.querySelector('.audio-info__title');
const authorInfo = document.querySelector('.audio-info__author');
const progressValue = document.querySelector('.progress__value');
const body = document.querySelector('body');

const RADIUS = 198;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const songsFolder = 'src/assets/audio';
const imagesFolder = 'src/assets/images';

const songs = [];
const backgrounds = [];
let currentSongIndex;

const assignPath = ({ path }) => {
  audio.src = path;
};

const setUpNewIndex = (index) => {
  currentSongIndex = index;
};

const play = () => {
  audio.play();
};

const pause = () => {
  audio.pause();
};

const loadFirstSong = () => {
  if (!audio.querySelector('source[src$=mp3]')) {
    setUpNewIndex(0);
    assignPath(songs[currentSongIndex]);
    play();
  }
};

const showPauseBtn = () => {
  pauseBtn.style.opacity = 1;
  playBtn.style.opacity = 0;
};

const showPlayBtn = () => {
  playBtn.style.opacity = 1;
  pauseBtn.style.opacity = 0;
};

const playAudio = () => {
  if (audio.paused) {
    play();
    showPauseBtn();
  } else {
    pause();
    showPlayBtn();
  }
};

const updateBackground = () => {
  body.style.background = `url(${backgrounds[currentSongIndex]}) no-repeat center center fixed`;
  body.style.backgroundSize = 'cover';
};

const updateTitleAndAuthor = () => {
  const { title, author } = songs[currentSongIndex];
  titleInfo.innerHTML = title;
  authorInfo.innerHTML = author;
};

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

const autoPlayNextSong = () => {
  assignPath(songs[++currentSongIndex]);
  play();
  if (currentSongIndex === songs.length - 1) {
    setUpNewIndex(0);
  }
  updateTitleAndAuthor();
  updateBackground();
};

const getMetaSong = (path) => {
  const extractedInfo = path.replace(/.mp3|http:\/\/localhost:8080\/src\/assets\/audio\//gi, '');
  const index = extractedInfo.indexOf('-');
  const result = {
    author: extractedInfo.substring(0, index),
    title: extractedInfo.substring(index + 1),
  };
  return result;
};

const showTime = () => {
  const { duration, currentTime } = audio;
  timeInfo.innerHTML = duration ? `-${parseInt(duration - currentTime, 10)} sec` : '\u00A0';
};

const progress = (value) => {
  const progressOffset = value / 100;
  const dashoffset = CIRCUMFERENCE * (1 - progressOffset);
  progressValue.style.strokeDashoffset = dashoffset;
};

const updateProgress = () => {
  const progressPercentage = (audio.currentTime / audio.duration) * 100;
  progress(progressPercentage);
};

progressValue.style.strokeDasharray = CIRCUMFERENCE;

const extractLinks = (data) => {
  const el = document.createElement('html');
  el.innerHTML = data;
  const links = [...el.querySelectorAll('#files a')];
  el.remove();
  return links;
};

playBtn.addEventListener('click', playAudio);
pauseBtn.addEventListener('click', playAudio);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', showTime);
audio.addEventListener('ended', autoPlayNextSong);
audio.addEventListener('timeupdate', updateProgress);

fetch(songsFolder, {
  method: 'get',
}).then(response => response.text())
  .then((text) => {
    const links = extractLinks(text);
    links.forEach((link) => {
      if (link.href.indexOf('mp3') > -1) {
        const metaSong = getMetaSong(link.href);
        const path = link.href;
        const result = { path, ...metaSong };
        songs.push(result);
      }
    });
    loadFirstSong();
    updateTitleAndAuthor();
    showTime();
  }).catch(error => console.error('error', error)); // eslint-disable-line no-console

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
