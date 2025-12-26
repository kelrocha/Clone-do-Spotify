const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const likeButton = document.getElementById('like');
const currentProgress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');
/*const savedPlaylist = JSON.parse(localStorage.getItem('playlist'))  Est linha foi
acrescentada (veio do Copilot) para recuperar o array convertido para String
pelo JSON*/



const asYouWere = {
    songName : 'As You Were',
    artist : 'TrackTribe',
    file: 'as_you_were',
    liked: false
};
const boomBapFlick = {
    songName : 'Boom Bap Flick',
    artist : 'Quincas Moreira',
    file: 'boom_bap_flick',
    liked: false
};
const cantHide = {
    songName : 'Can\'t Hide',
    artist : 'Otis Mcdonald',
    file: 'cant_hide',
    liked: false
};

/*VARIÁVEIS AUXILIARES*/

let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ??
[asYouWere,
 boomBapFlick,
 cantHide
];
let sortedPlaylist = [...originalPlaylist]; /* os tres pontos antes da variável
playlist, significa espalhar (spread) que a avariavel sortedPlayList irá abrir o array o ariginal para o embaralhamento
porem manterá oa array original funcionando normalmente*/
let index = 0;



function playSong(){
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    isPlaying = true;
}
function pauseSong(){
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    song.pause();
    isPlaying = false;
}

function playPauseDecider(){
    if(isPlaying === true){
        pauseSong();
    }
    else{
        playSong();
    }

}

function likeButtonRender() {
    if (sortedPlaylist[index].liked === false) {
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active');
    }
     else {
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.classList.remove('button-active');

        }
    }



function initializeSong(){
    cover.src = `images/${sortedPlaylist[index].file}.webp`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

function previousSong(){
    if(index === 0){
        index = sortedPlaylist.length -1;
    }
    else {
        index -=1;
    }
    initializeSong();
    playSong();
}
function nextSong(){
    if(index === sortedPlaylist.length -1){
        index = 0;
    }
    else {
        index +=1;
    }
    initializeSong();
    playSong();
}
function updateProgress(){
    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty('--progress',`${barWidth}%`); /*`${barWidth}%` essa expressão
    permite transformar o numero resultado da operação acima em percentual*/
    songTime.innerText = toHHMMSS(song.currentTime);
}  
function jumpTo(event){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX; /* siginifica qanto de X o cursor avaçou*/
    const jumpToTime = (clickPosition/width)*song.duration; /* a parte entre parentesis é o percentual
    da musica que já correu dividido pelo ponto onde foi clicado multiplicado
    pelça duração da música*/
    song.currentTime = jumpToTime;
   /* alert(song.currentTime); esta função é usada para dar um alerta pelo navegador
   nesse caso aqui quando clica na barra de progresso 
   mostra o tempo tocado da musica*/
}

/*FUNÇÃO QUE EMBARALHA O ARRAY*/
function shuffleArray(preShuffleArray){
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0){
      let randomIndex = Math.floor(Math.random()* size); /*Math.floor elimina os numeros após a
       virgula*/
       let aux = preShuffleArray[currentIndex]; /*gerou uma copia do elemento antigo e
       salvou em uma variável auxiliar*/
       preShuffleArray[currentIndex] = preShuffleArray[randomIndex]; /* preShuffle Array nesta função
       pega o elemento que foi salvo na variavel auxiliar e coloca no lugar do elemento
       que saiu e assim sucessivamente*/
       preShuffleArray[randomIndex] = aux;
       currentIndex -= 1; /* eesta função vai decremenando o valor do elemento
       no array*/

    }

}

/*ESTA FUNÇÃO É QUE EMBARALHA O ARRAY*/
function shuffleButtonClicked(){
    if(isShuffled === false){
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    }
    else{
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove('button-active');
    }
}

function repeatButtonClicked() {
    if(repeatOn === false){
        repeatOn = true;
        repeatButton.classList.add('button-active');
    }
    else {
        repeatOn = false;
        repeatButton.classList.remove('button-active');

    }

}

function nextOrRepeat() {
    if (repeatOn === false){
        nextSong();
    }
    else {
        playSong();
    }
}

function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60)
    let hoursStr = hours.toString().padStart(2, '0');
    let minStr = min.toString().padStart(2, '0');
    let secsStr = secs.toString().padStart(2, '0');

    return `${hoursStr}:${minStr}:${secsStr}`;
}
   

function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonClicked() {
    if(sortedPlaylist[index].liked === false){
        sortedPlaylist[index].liked = true;
    } else {
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
    
        
    

    /* essa seção do código foi incluido apartir do Copilot por que o console não funciona
    likeButtonRender();
    console.log('Salvando playlist no LocalStorage...');
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist)); /* tentando salvar diretamente um array 
    de objetos JavaScript, e o navegador não consegue armazenar 
    isso como está (veio da video aula), 
    localStorage.getItem('playlist')*/
}

/*Essa função foi copiada do Copilot para ver os dados no local storae
function likeButtonClicked() {
    if (sortedPlaylist[index].liked === false) {
        sortedPlaylist[index].liked = true;
    } else {
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();

    // Salvar no localStorage como JSON
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}*/




/*Função para alterar a cor só do botão de like para vermelho. Obs. não
consta na video-aula*/
function likeButtonRender() {
    if (sortedPlaylist[index].liked === false) {
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('like-active'); // usa a classe vermelha
    } else {
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.classList.remove('like-active'); // remove a classe vermelha
    }
}



initializeSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);
