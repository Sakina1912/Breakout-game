const rulesBtn = document.getElementById('btn-rule')
const closeBtn = document.getElementById('btn-close')
const rules = document.getElementById('rules')
const showScore = document.getElementById('showScore')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const brickRow = 9
const brickColumn = 5
let score = 0
let bricks =[]

//brick properties
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible:true
}


for(let i=0;i<brickRow;i++){
    bricks[i] = []
    for(let j=0;j<brickColumn;j++){
        x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX
        y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY
        bricks[i][j] = {x,y,...brickInfo}
    }
}

// console.log(bricks)

//ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4,
    visible: true
}

//paddle properties
const paddle = {
    x:canvas.width/2-40,
    y:canvas.height-20,
    w:80,
    h:10,
    speed: 8,
    dx: 0,
    visible : true
}

//drawing paddle
function drawPaddle(){
    ctx.beginPath()
    ctx.rect(paddle.x,paddle.y,paddle.w,paddle.h)
    ctx.fillStyle =  paddle.visible ? '#E05C31' : 'transparent'
    ctx.fill()
    ctx.closePath()
}

//drawing ball
function drawBall(){
    ctx.beginPath()
    ctx.arc(ball.x,ball.y,ball.size,0,Math.PI*2)
    ctx.fillStyle = '#E05C31'
    ctx.fill()
    ctx.closePath()
}

//drawing score
function drawScore(){
    ctx.font = '20px Arial'
    ctx.fillText(`Score: ${score}`,canvas.width - 100, 30)
}

//drawing bricks
function drwaBrick(){
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath()
            ctx.rect(brick.x,brick.y,brick.w,brick.h)
            ctx.fillStyle = brick.visible ? '#E05C31' : 'transparent'
            ctx.fill()
            ctx.closePath()
        })
    })
}

//Moving paddle
function movePaddle(){
    paddle.x += paddle.dx

    //right wall collision
    if(paddle.x + paddle.w > canvas.width){
        paddle.x = canvas.width - paddle.w
    }
    //left wall collision
    if(paddle.x < 0){
        paddle.x=0
    }
}

function moveBall(){
    ball.x += ball.dx
    ball.y += ball.dy

    //wall collision (right/left)
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
        ball.dx *= -1
    }

    //wall collision (top/end)
    if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0){
        ball.dy *= -1
    }

    //paddle collision
    if(ball.x - ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w && ball.y + ball.size > paddle.y){
        ball.dy = -ball.speed
    }

    //breaking the brick
    bricks.forEach(column => {
        column.forEach(brick => {
            if(brick.visible){
                if(ball.x - ball.size > brick.x &&
                    ball.x + ball.size < brick.x + brick.w &&
                    ball.y - ball.size > brick.y &&
                    ball.y + ball.size < brick.y + brick.w){
                        ball.dy *= -1
                        brick.visible = false
                        increaseScore()
                        
                    }
            }
        })
    })
    // missing the ball then game reset
    // if(ball.y + ball.size > canvas.height){
    //     showAllBrick()
    //     score = 0
    // }
    gameOver()
}

//increase score

function increaseScore(){
    score++
    localStorage.setItem('score',`${score}`)
    // let getScore = localStorage.getItem('score')
}

function gameOver(){
    if(score === brickRow * brickColumn ||  ball.y + ball.size > canvas.height){
        ball.visible = false
        paddle.visible = false 
        unshowAllBricks()

        setTimeout(()=> {
            let getScore = localStorage.getItem('score')
            showScore.style.display ='block'
            showScore.innerHTML=`<h2>Congratulations! <br>your Score is '${getScore}'</h2>`
            console.log(getScore)
        },100)

        setTimeout(function (){
            showScore.style.display = 'none'
            showAllBrick()
            score=0
            paddle.x = canvas.width/2 - 40
            paddle.y = canvas.height - 20
            ball.x = canvas.width/2
            ball.y = canvas.height/2
            ball.visible = true
            paddle.visible = true
        },5000)
    }

}

function unshowAllBricks(){
    bricks.forEach(column => {
        column.forEach(brick => {
            brick.visible = false
        })
    })
}
//showing all the bricks
function showAllBrick(){
    bricks.forEach(column => {
        column.forEach(brick => {
            brick.visible = true
        })
    })
}

//drawing everything
function drawEverything(){
    //clearing the canvas
    ctx.clearRect(0,0,canvas.width,canvas.height)

    drawBall()
    drawPaddle()
    drawScore()
    drwaBrick()
}

//updating the canvas
function update(){
    movePaddle()
    moveBall()

    drawEverything()
    
    //animating the canvas
    requestAnimationFrame(update)
}

update()



function keyDown(e){
    if(e.key === 'Right' || e.key === 'ArrowRight'){
        paddle.dx = paddle.speed
    }else if(e.key === 'Left' || e.key === 'ArrowLeft'){
        paddle.dx = -paddle.speed
    }
}

function keyUp(e){
    if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft'){
        paddle.dx = 0
    }
}

//key eventlistener
document.addEventListener('keydown',keyDown)
document.addEventListener('keyup',keyUp)

//button eventlistener
rulesBtn.addEventListener('click', ()=>rules.classList.add('show'))
closeBtn.addEventListener('click', ()=>rules.classList.remove('show'))