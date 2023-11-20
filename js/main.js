gsap.registerPlugin(ScrollTrigger);

function MusicButton(btn) {
  this.button = typeof btn === "object" ? btn : document.querySelector(btn);
  this.buttons = null;
  this.song = null;
  this.songs = document.querySelectorAll("audio[data-audio-section]");
  this.sections = document.querySelectorAll("section[data-audio-section]");
  this.sound = null;

  this.visualizer = null; // Remove visualizer for Webflow
}

MusicButton.prototype.toggleSound = function() {
  this.setSound("off");

  this.button.addEventListener("click", function() {
    if(!this.song) this.song = this.songs[0];

    if(this.getSound() === "off") {
      this.setSound("on");
      this.playSong(this.song);
    } else {
      this.setSound("off");
      this.pauseSong(this.song);
    }

  }.bind(this));
}

MusicButton.prototype.setSound = function(sound) {
  this.sound = sound;
  
  if(this.buttons) this.buttons.forEach(btn => btn.setAttribute("data-sv-sound", sound))
  else this.button.setAttribute("data-sv-sound", sound);
}

MusicButton.prototype.getSound = function() {
  return this.button.getAttribute("data-sv-sound");
}

MusicButton.prototype.playSong = function(song) {
  song.play();
  gsap.to(song, { volume: 1, duration: 0.5 });
}

MusicButton.prototype.pauseSong = function(song) {
  gsap.to(song, { volume: 0, duration: 0.5, onComplete: () => song.pause() });
}

MusicButton.prototype.toggleSecionSongs = function() {
  this.sections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      // markers: true,
      onEnter: () => {
        this.song = [...this.songs].filter( song => song.dataset.audioSection === section.dataset.audioSection)[0];
        if(this.getSound() === "off") return;

        this.playSong(this.song);
      },
      onLeave: () => {
        this.song = [...this.songs].filter( song => song.dataset.audioSection === section.dataset.audioSection)[0];
        if(this.getSound() === "off") return;
        if(section.dataset.audioSection === section.nextElementSibling.dataset.audioSection) return;
        
        this.pauseSong(this.song);
        
      },
      onLeaveBack: () => {        
        this.song = [...this.songs].filter( song => song.dataset.audioSection === section.dataset.audioSection)[0];
        if(this.getSound() === "off") return;
        if(section.dataset.audioSection === section.previousElementSibling.dataset.audioSection) return;
        
        this.pauseSong(this.song);
      },
      onEnterBack: () => {        
        this.song = [...this.songs].filter( song => song.dataset.audioSection === section.dataset.audioSection)[0];
        if(this.getSound() === "off") return;
        if(section.dataset.audioSection === section.nextElementSibling.dataset.audioSection) return;
        this.playSong(this.song);
      }
    });
  });
}

MusicButton.prototype.init = function() {
  if(!this.button) return console.error("Attach Button!");

  this.toggleSound();
  this.toggleSecionSongs();
}

// 1. Create a button
// 2. Attach button attribute to new MusicButton(ATTR HERE) -> Example: ["data-music-button"];
// 3. Create container with audios
// 4. Add on audio tags data-audio-section="name here"
// 4. Add on section tags data-audio-section="name here" (The name must be the same as one entered in the audio tag)
// 5. GSAP Dependable
const musicButtons = document.querySelectorAll("[data-music-button]");
musicButtons.forEach(el => {
  const btn = new MusicButton(el);
  btn.init();

  // If we have more than one button add all of them in order to synch them on click
  if(musicButtons.length > 1) btn.buttons = musicButtons;
});





showSmallMusicButton();

function showSmallMusicButton() {
  gsap.fromTo("[data-music-button].sm",{autoAlpha: 0},{
    autoAlpha: 1,
    scrollTrigger: {
      trigger: ".hero [data-music-button]",
      // markers: true,
      start: "top top",
      end: "bottom top",
      scrub: 0.8
    }
  })

}



// Visualizer
// function Visualizer(song) {
//   window.AudioContext = window.AudioContext || window.webkitAudioContext;

//   this.song = song;
//   this.ctxAudio = new window.AudioContext();
//   this.analyser = this.ctxAudio.createAnalyser();
//   this.src = this.ctxAudio.createMediaElementSource(this.song);

//   this.src.connect(this.analyser);
//   this.src.connect(this.ctxAudio.destination);

//   this.analyser.fftSize = 32;
//   this.bufferLength = this.analyser.frequencyBinCount;
//   this.data = new Uint8Array(this.bufferLength);
//   this.bars = [];
//   this.containers = document.querySelectorAll(".visualizer");
// }

// Visualizer.prototype.createBars = function() {
//   for (let i = 0; i < this.data.length; i++) {
//     const bar = document.createElement("div");
//     bar.classList.add("bar");
//     this.bars.push(bar);
//   }
// }

// Visualizer.prototype.addBars = function() {
//   if(!this.bars.length) return;


//   this.containers.forEach(container => {
//     console.log(container);
//     this.bars.forEach(bar => container.appendChild(bar));
//   });
// }

// Visualizer.prototype.removeBars = function() {
//   this.containers.forEach(container => container.innerHTML = "");
// }

// Visualizer.prototype.animate = function() {
//   gsap.ticker.add(function() {
//     this.analyser.getByteFrequencyData(this.data);

//     for (let i = 0; i < this.bufferLength; i++) {
//       let data = this.data[i];
//       // console.log(data);
//       // item = item > 150 ? item / 1.5 : item * 1.5;
//       // elements[i].style.transform = `rotateZ(${i * (360 / bufferLength)}deg) translate(-50%, ${clamp(item, 100, 150)}px)`;
//     }

//   }.bind(this));
// }

// Visualizer.prototype.init = function () {
//   this.createBars();
//   this.addBars();
//   // this.animate();
// }
