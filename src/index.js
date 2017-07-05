const audio = document.querySelector('.audio');
const playBtn = document.querySelector('.play');
const pauseBtn = document.querySelector('.pause');
const prevBtn = document.querySelector('.backward');
const nextBtn = document.querySelector('.forward');
const time = document.querySelector('.time');
const title = document.querySelector('.title');
const author = document.querySelector('.author');
const progressValue = document.querySelector('.progress__value');
const body = document.querySelector('body');
const container = document.querySelector('.progressbar');

const RADIUS = 198;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const songsFolder = 'src/assets/audio';
const imagesFolder = 'src/assets/images';

const songs = [];
const backgrounds = [];
let currentSongIndex;

// sprawdz ułożenie przycisków sterowania
// css alfabetycznie
// funkcje js kontekstowo
// sprawdzić css - poprawność
// sformatuj kod, eslint ?

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
}

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
  if (audio.paused){
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

const prevSong = () => {
  setUpNewIndex(--currentSongIndex);
  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }
  assignPath(songs[currentSongIndex]);
  play();
  upateTitleAndAuthor();
  updateBackground();
};

const nextSong = () => {
  setUpNewIndex(++currentSongIndex);
  if (currentSongIndex === songs.length) {
    currentSongIndex = 0;
  }
  assignPath(songs[currentSongIndex])
  play();
  updateBackground();
  upateTitleAndAuthor()
};

const autoPlayNextSong = () => {
  assignPath(songs[++currentSongIndex])
  play();
  if (currentSongIndex === songs.length - 1) {
    setUpNewIndex(0);
  }
  upateTitleAndAuthor();
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
  time.innerHTML = duration ? `-${parseInt(audio.duration - audio.currentTime)} sec` : '\u00A0';
};

const updateProgress = () => {
  const progressPercentage = (audio.currentTime / audio.duration) * 100;
  progress(progressPercentage);
}

const progress = (value) => {
  const progress = value / 100;
  const dashoffset = CIRCUMFERENCE * (1 - progress);
  progressValue.style.strokeDashoffset = dashoffset;
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


// powyzej tego jest ok

const upateTitleAndAuthor = () => {
  const meta = songs[currentSongIndex];
  // czemu tutaj nie działa destrukturyzacja const {title, author} = metaSongs[currentSongIndex];
  title.innerHTML = meta.title;
  author.innerHTML = meta.author;
};

// poniżej ajax zapytania o nazwy images/songs

fetch(songsFolder, {
  method: 'get',
}).then((response) => {
  return response.text();
}).then((text) => {
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
  upateTitleAndAuthor();
  showTime();
}).catch((error) => {
  ('error');
});

fetch(imagesFolder, {
  method: 'get',
}).then((response) => {
  return response.text();
}).then((text) => {
  const links = extractLinks(text);
  links.forEach((link) => {
    if (link.href.indexOf('jpg') > -1) {
      backgrounds.push(link.href.substring(link.href.indexOf('/src')));
    }
  });
}).catch((error) => {
  ('error');
});
