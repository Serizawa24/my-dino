import { setupGround, updateGround ,} from './ground.js';
import { setupDino, updateDino ,getDinoRect,setupDinoLose} from './dino.js';
import { setupCactus, updateCactus ,getCactusRects} from './cactus.js';
(()=>{

    const worldElem = document.querySelector('[data-world]');
    const scoreElem = document.querySelector('[data-score]');
    const timeElem = document.querySelector('[data-timer]');
    const startScreenElem = document.querySelector('[data-start-screen]');

    const dieSound = document.querySelector('.die');
    const pointSound = document.querySelector('.point');


    const WORLD_WIDTH = 100;
    const WORLD_HEIGHT = 30;
    const SPEED_SCALE_INCREASE = 0.00001;

    setPixelToWorldScale()
    window.addEventListener('resize', setPixelToWorldScale);
    document.addEventListener('keydown', handleStart, {once:true} )

    let lastTime;
    let speedScale;
    let score=0;
    let timeStamp = 0;

    function update(time){
        if(lastTime== null){
            lastTime = time;
            window.requestAnimationFrame(update);
            return 
        }
        const delta = time - lastTime;
        
        updateGround(delta,speedScale);
        updateSpeedScale(delta)
        updateScore(delta)
        updateDino(delta, speedScale)
        updateCactus(delta, speedScale)
        if(checkLose()) return handleLose()


        updateTimer()
        
        lastTime = time;


        window.requestAnimationFrame(update)
    }

    function checkLose(){
        const dinoRect = getDinoRect();
        return getCactusRects().some(rect => isCollision(rect,dinoRect))
    }

    

    function isCollision(rect1,rect2){
        return  rect1.left +20 < rect2.right &&
                rect1.top +20 < rect2.bottom &&
                rect1.right > rect2.left +20 &&
                rect1.bottom > rect2.top +20;

    }

    function updateSpeedScale(delta){
        
        speedScale < 1.7 ? speedScale += delta * SPEED_SCALE_INCREASE : speedScale = 1.7
        
    }

    function updateScore(delta){
        score += delta * 0.01;
        scoreElem.textContent = Math.floor(score)
        
        if(Math.floor(score)%100 === 0 && score > 90) pointSound.play();
    }

    function updateTimer(){
       setInterval(function(){
        timeStamp++
        timeElem.textContent = speedScale.toFixed(2)
       },1000)
    }

    function handleStart(){
        console.log('start');
        lastTime = null;
        speedScale = 1;
        score = 0;
        timeStamp = 0;
        setupGround()
        setupDino();
        setupCactus()
        startScreenElem.classList.add('hide')
        window.requestAnimationFrame(update);

    }

    function handleLose(){
        setupDinoLose();
        setTimeout(()=> {
            document.addEventListener('keydown', handleStart,{once:true})
            startScreenElem.classList.remove('hide')
        },100)
        dieSound.play();
    }

    function setPixelToWorldScale() {
        let worldToPixelScale;
        if (window.innerWidth/window.innerHeight < WORLD_WIDTH/WORLD_HEIGHT) {
            worldToPixelScale = window.innerWidth/WORLD_WIDTH;
        } else {
            worldToPixelScale = window.innerHeight/WORLD_HEIGHT
        }
        worldElem.style.width = `${worldToPixelScale*WORLD_WIDTH}px`;
        worldElem.style.height = `${worldToPixelScale*WORLD_HEIGHT}px`;


    }

    
    return console.log('Running')
})()