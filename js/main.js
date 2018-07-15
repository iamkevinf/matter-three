var Engine=Matter.Engine,
    Render=Matter.Render,
    World=Matter.World,
    Bodies=Matter.Bodies,
    Body=Matter.Body

var downif=false;

function init() {
    var engine=Engine.create(),
        world=engine.world,
        render=Render.create({
            engine:engine,
            element:document.body,
            options:{
                width:window.innerWidth,
                height:window.innerHeight,
                wireframes:false
            }
        });

    Engine.run(engine);
    Render.run(render);

    var boxA=Bodies.rectangle(300,300,500,100),
        boxB=Bodies.rectangle(300,300,100,500);
    var ground=Bodies.rectangle(window.innerWidth/2,window.innerHeight-100,window.innerWidth,100,{isStatic:true});
    var cup=Body.create({
        parts:[boxA,boxB]
    });


    World.add(world,[cup,ground]);
    
}

//touchstart类似mousedown
var onTouchStart = function(e){
    //事件的touches属性是一个数组，其中一个元素代表同一时刻的一个触控点，从而可以通过touches获取多点触控的每个触控点
    //由于我们只有一点触控，所以直接指向[0]
    var touch = e.touches[0];

    //获取当前触控点的坐标，等同于MouseEvent事件的clientX/clientY
    var x = touch.clientX;
    var y = touch.clientY;
    mouseDown(x, y);
};
var onMouseDown = function(e){
    var x = e.clientX;
    var y = e.clientY;
    mouseDown(x,y);
};

function mouseDown(x, y){
    downif=true;
}

//touchmove类似mousemove
var onTouchMove = function(e){
    //可为touchstart、touchmove事件加上preventDefault从而阻止触摸时浏览器的缩放、滚动条滚动等
    e.preventDefault();
    var touch = e.touches[0];
    var x = touch.clientX;
    var y = touch.clientY;
    mouseMove(x,y);
};
var onMouseMove = function(e){
    //可为touchstart、touchmove事件加上preventDefault从而阻止触摸时浏览器的缩放、滚动条滚动等
    e.preventDefault();
    var x = e.clientX;
    var y = e.clientY;
    mouseMove(x,y);
};

function mouseMove(x,y){
    if(downif){
        console.log("!!!!!!!!!!!!!!!!!!!!!", x, y);
    }
}

//touchend类似mouseup
var onTouchUp = function(e){
    var touch = e.touches[0];
    var x = touch.clientX;
    var y = touch.clientY;
    mouseUp(x,y);
};
var onMouseUp = function(e){
    var x = e.clientX;
    var y = e.clientY;
    mouseUp(x,y);
};
function mouseUp(x,y){
    downif=false;
}

window.addEventListener('load', init);