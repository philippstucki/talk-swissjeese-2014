// make jslint stop after the first error so we can do all sort of nasty tricks
/*jslint passfail: true*/

/** @define {boolean} */
var DEBUG = true;
/** @define {boolean} */
var SOUND = false;
/** @define {boolean} */
var ROTATE = true;

// declare global vars to enable shortening by google closure compiler
var
    numpixels=100,
    w=a.width,
    h=a.height,
    pixelSizeX = w/numpixels|0,
    pixelSizeY = h/numpixels|0,
    vw=numpixels,
    vh=numpixels,
    M=Math,
    PI = M.PI,
    TPI = 2*PI,
    fps,
    t=0,
    beat=0,
    beatsync=0,
    theta=0,
    st,
    run=1,
    mr=M.random,
    ms=M.sin,
    mc=M.cos,
    mp=M.pow,
    me=M.exp,
    mM=M.max,
    msq=M.sqrt,
    ma=M.abs,
    hue=1,
    light=80,
    theta=0,
    o={}
    ;

o = {
    x: 10,
    y: 9,
    z:3
};

if (DEBUG) {
    st = new Date().getTime();
    fps=0;
}

function pp(x, y, v) {
    c.fillStyle = 'hsla('+[hue,v*100+'%',v*light+'%',1];
    c.fillRect(x*pixelSizeX, y*pixelSizeY, pixelSizeX, pixelSizeY);
}

function mod_xz(v, m) {
    return {
        x: v.x%m-m/2,
        y: v.y%m-m/2,
        z: v.z%m-m/2
    };
}

function DE_sphere(p, r) {
    return msq(p.x*p.x+p.y*p.y+p.z*p.z)-r;
}

function DE_box(p, r) {
    p = rotate_Z(p, 1.9+t/20);
    p = rotate_Y(p, 1.0+t/15);
    p = rotate_X(p, 0.9);
    p = {
        x:mM(ma(p.x)-r,0),
        y:mM(ma(p.y)-r,0),
        z:mM(ma(p.z)-r,0)
    };
    return msq(p.x*p.x+p.y*p.y+p.z*p.z);
}

function rotate_X(p, t) {
    return {
        x: p.x,
        y: p.y*mc(t)-p.z*ms(t),
        z: p.y*ms(t)+p.z*mc(t)
    };
}

function rotate_Y(p, t) {
    return {
        x: p.x*mc(t)-p.z*ms(t),
        y: p.y,
        z: p.x*ms(t)+p.z*mc(t)
    };
}

function rotate_Z(p, t) {
    return {
        x: p.x*mc(t)-p.y*ms(t),
        y: p.x*ms(t)+p.y*mc(t),
        z: p.z
    };
}

function translate(p, x, y, z) {
    return {
        x: p.x+x,
        y: p.y+y,
        z: p.z+z
    };
}

var render = function() {
    var f=1,imax=30;
    var x,y,d,b,distance,dd,p,i;

    y=vh;while(y--) {
        x=vw;while(x--) {
            d={x:x/vw-0.5,y:y/vh-0.5};

            distance = 0;
            for (i=0; i<imax; i++) {
                p = {
                    x:o.x+distance*d.x,
                    y:o.y+distance*d.y,
                    z:o.z+distance
                };
                dd = DE_box(mod_xz(p,5), 0.8);
                distance+=dd;
                if (dd < 5e-4) break;
            }
            b=(0.9-i/imax);

            pp(x,vh-y,b);
        }
    }
}

// add event listener to bind fun2tion keys
if (DEBUG) {
    onkeydown=function(e) {
        run = e.keyCode==32 ? run*-1 : run*1;
        SOUND && (e.keyCode==32 && a_jsnode.disconnect());
    };
}

function loop() {
    t++;
    requestAnimationFrame(loop);

    if (DEBUG) {
        if (run==1) {
            render();
        }
    } else {
        render();
    }
};
loop();

