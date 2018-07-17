
var Engine=Matter.Engine,
    Render=Matter.Render,
    World=Matter.World,
    Bodies=Matter.Bodies,
    Body=Matter.Body

var engine,world,render;

var downif=false;

var camera, scene, renderer;
var cameraOrtho, sceneOrtho;

var spriteTL, spriteTR, spriteBL, spriteBR, spriteC;
var line;

var mapC;

var group;

function screen2three(x,y){
    var pos = new THREE.Vector2();
    pos.x = x - window.innerWidth * 0.5;
    pos.y = window.innerHeight * 0.5 - y;
    return pos;
}
function three2screen(x,y){
    var pos = new THREE.Vector2();
    pos.x = x + window.innerWidth * 0.5;
    pos.y = window.innerHeight * 0.5 - y;
    return pos;
}

function setupInput(){
    var self = this;
    document.addEventListener('mousedown',function(e){
        self.onMouseDown(e)
    },false)
    document.addEventListener('mousemove',function(e){
        self.onMouseMove(e)
    },false)
    document.addEventListener('mouseup',function(e){
        self.onMouseUp(e)
    },false)

    document.addEventListener("touchstart",function(e){
        self.onTouchBegin(e);
    },false)

    document.addEventListener("touchmove",function(e){
        e.preventDefault();
        self.onTouchMove(e);
    },false)

    document.addEventListener("touchup",function(e){
        self.onTouchEnd(e);
    },false)
}

function initCamera(){
    var width = window.innerWidth;
    var height = window.innerHeight;

    camera = new THREE.PerspectiveCamera( 60, width / height, 1, 2100 );
    camera.position.z = 1500;

    cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10 );
    cameraOrtho.position.z = 10;
}

function initScene(){
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 1500, 2100 );

    sceneOrtho = new THREE.Scene();
}

var threeGround;
var threeGroupArr=[];
var matterGroupArr=[];

function initObject(){
    var width = window.innerWidth;
    var height = window.innerHeight;

    var pos_three = new THREE.Vector2(0, -height*0.5+10);
    var pos_matter = three2screen(pos_three.x, pos_three.y);

    var geometryGround = new THREE.CubeGeometry(width, 10, 1);
    var materialGround = new THREE.MeshBasicMaterial({
            color : 0xb8b8b8
        })

    threeGround = new THREE.Mesh(geometryGround, materialGround);
    threeGround.position.set(pos_three.x, pos_three.y, 1);
    sceneOrtho.add(threeGround);

    var matterGround=Bodies.rectangle(pos_matter.x, pos_matter.y,width,10,{isStatic:true});
    World.add(world, [matterGround]);

    updateHUD();
}

function initRenderer(){
    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false; // To allow render overlay on top of sprited sphere

    document.body.appendChild( renderer.domElement );
}

function initPhysics(){
    engine=Engine.create(),
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
}

function init() {
    setupInput();
    
    initPhysics();

    initCamera();
    initScene();
    initObject();
    initRenderer();

    //
    window.addEventListener( 'resize', onWindowResize, false );
    animate();
}

function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    cameraOrtho.left = - width / 2;
    cameraOrtho.right = width / 2;
    cameraOrtho.top = height / 2;
    cameraOrtho.bottom = - height / 2;
    cameraOrtho.updateProjectionMatrix();

    updateHUD();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function updateHUD() {
    var width = window.innerWidth / 2;
    var height = window.innerHeight / 2;

    threeGround.position.set(0, -height+100, 1);
    
    for(var j = 0; j < threeGroupArr.length; j++){
        var threeGroup = threeGroupArr[j];
        var matterGroup = matterGroupArr[j];
        if(threeGroup && matterGroup){
            for(var i = 0; i < threeGroup.children.length; i++){
                var l = threeGroup.children[i];
                var m = matterGroup.parts[i+1];
                if(l && m){
                    var pos = screen2three(m.position.x, m.position.y);
                    l.position.set(pos.x, pos.y, 1);
                }
            }
        }
    }
}

function animate() {
    requestAnimationFrame( animate );
    threeRender();
}

function threeRender() {

    for(var j = 0; j < threeGroupArr.length; j++){
        var threeGroup = threeGroupArr[j];
        var matterGroup = matterGroupArr[j];
        if(threeGroup && matterGroup){
            for(var i = 0; i < threeGroup.children.length; i++){
                var l = threeGroup.children[i];
                var m = matterGroup.parts[i+1];
                if(l && m){
                    var pos = screen2three(m.position.x, m.position.y);
                    l.position.set(pos.x, pos.y, 1);
                }
            }
        }
    }

    renderer.clear();
    renderer.render( scene, camera );
    renderer.clearDepth();
    renderer.render( sceneOrtho, cameraOrtho );
}

var onTouchBegin = function(e){
    var touch = e.touches[0];

    var x = touch.clientX;
    var y = touch.clientY;
    mouseDown(x, y);
};
var onMouseDown = function(e){
    var x = e.clientX;
    var y = e.clientY;
    mouseDown(x,y);
};

var onTouchMove = function(e){
    e.preventDefault();
    var touch = e.touches[0];
    var x = touch.clientX;
    var y = touch.clientY;
    mouseMove(x,y);
};
var onMouseMove = function(e){
    e.preventDefault();
    var x = e.clientX;
    var y = e.clientY;
    mouseMove(x,y);
};

var onTouchEnd = function(e){
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

var pointsList=[];
var threeGroup = null;
var last_x,last_y;
function mouseDown(x, y){
    downif=true;
    pointsList=[];
    last_x = lasy_y = null;
    threeGroup = new THREE.Group();
    sceneOrtho.add(threeGroup);
    threeGroupArr.push(threeGroup);
}

function mouseMove(x,y){
    if(downif){
        var screen_pos = screen2three(x, y);
        var screen_x = screen_pos.x;
        var screen_y = screen_pos.y;
        if(last_x && last_y){
            var geometry = new THREE.Geometry();
            var materialLine = new THREE.LineBasicMaterial({ color:0xff0000 });
            var p1 = new THREE.Vector3(last_x, last_y, 1);
            var p2 = new THREE.Vector3(screen_x, screen_y, 1);
            geometry.vertices.push(p1);
            geometry.vertices.push(p2);
            var l = new THREE.Line(geometry, materialLine, THREE.LineSegments );
            threeGroup.add(l);
            pointsList.push([p1, p2]);
        }
        
        last_x = screen_x;
        last_y = screen_y;
    }
}

function mouseUp(x,y){
    downif=false;
    
    if(pointsList.length > 0){
        var arr=[];
        for(var i = 0; i < pointsList.length; ++i){
            var p1 = pointsList[i][0];
            var p2 = pointsList[i][1];
            p1 = three2screen(p1.x, p1.y);
            p2 = three2screen(p2.x, p2.y);
            
            var len = p2.distanceTo(p1);
            var mx = (p1.x + p2.x) * 0.5;
            var my = (p1.y + p2.y) * 0.5;
            var matterObj=Bodies.rectangle(mx, my, len, 10);
            var angle = Math.asin((p2.y - p1.y)/len);
            Body.rotate(matterObj, angle);
            matterObj.position.x = window.innerWidth * 0.5;
            matterObj.position.y = window.innerHeight* 0.5;
            arr.push(matterObj);
        }
        var shape=Body.create({
            parts:arr
        });
        matterGroupArr.push(shape);
        World.add(world,[shape]);
    }
}