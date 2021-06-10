const rulesBtn = document.getElementById('btn-rule')
const closeBtn = document.getElementById('btn-close')
const rules = document.getElementById('rules')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const brickRow = 9
const brickColumn = 5
let score = 0
let bricks =[]


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

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
}

const paddle = {
    x:canvas.width/2-40,
    y:canvas.height-20,
    w:80,
    h:10,
    speed: 8,
    dx: 0,
    visible : true
}

function drawPaddle(){
    ctx.beginPath()
    ctx.rect(paddle.x,paddle.y,paddle.w,paddle.h)
    ctx.fillStyle =  paddle.visible ? '#E05C31' : 'transparent'
    ctx.fill()
    ctx.closePath()
}

function drawBall(){
    ctx.beginPath()
    ctx.arc(ball.x,ball.y,ball.size,0,Math.PI*2)
    ctx.fillStyle = '#E05C31'
    ctx.fill()
    ctx.closePath()
}

function drawScore(){
    ctx.font = '20px Arial'
    ctx.fillText(`Score: ${score}`,canvas.width - 100, 30)
}

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

function movePaddle(){
    paddle.x += paddle.dx

    if(paddle.x + paddle.w > canvas.width){
        paddle.x = canvas.width - paddle.w
    }

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

    if(ball.y + ball.size > canvas.height){
        showAllBrick()
        score = 0
    }
}

function increaseScore(){
    score++
    
    if(score % (brickRow * brickColumn) === 0){
        ball.visible = false
        paddle.visible = false 

        setTimeout(function (){
            showAllBrick()
            score=0
            paddle.x = canvas.width/2 - 40
            paddle.y = canvas.height - 20
            ball.x = canvas.width/2
            ball.y = canvas.height/2
            ball.visible = true
            paddle.visible = true
            console.log('hi')
        },500)
    }
}

function showAllBrick(){
    bricks.forEach(column => {
        column.forEach(brick => {
            brick.visible = true
        })
    })
}

function drawEverything(){
    ctx.clearRect(0,0,canvas.width,canvas.height)

    drawBall()
    drawPaddle()
    drawScore()
    drwaBrick()
}

function update(){
    movePaddle()
    moveBall()

    drawEverything()

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

document.addEventListener('keydown',keyDown)
document.addEventListener('keyup',keyUp)


rulesBtn.addEventListener('click', ()=>rules.classList.add('show'))

closeBtn.addEventListener('click', ()=>rules.classList.remove('show'))