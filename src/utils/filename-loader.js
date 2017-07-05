import $ from 'jquery';

const songs = [];
const backgrounds = [];

const songsFolder = 'src/assets/audio';

$.ajax({
  url: songsFolder,
  success(data) {
    const links = [...$(data).find('#files a')];
    links.forEach((link) => {
      if (link.href.indexOf('mp3') > -1) {
        songs.push(link.href)
      }
      console.log(songs);
    });
    return songs;
  },
});

const imagesFolder = 'src/assets/images';

$.ajax({
  url: imagesFolder,
  success(data) {
    const links = [...$(data).find('#files a')];
    links.forEach((link) => {
      if (link.href.indexOf('jpg') > -1) {
        backgrounds.push(link.href)
      }
      console.log(backgrounds);
    });
    return backgrounds;
  },
});
