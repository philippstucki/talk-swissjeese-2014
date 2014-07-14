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
    numpixels=90,
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
    mm=M.min,
    mM=M.max,
    msq=M.sqrt,
    ma=M.abs,
    hue=1,
    light=100,
    theta=0,
    o={}
    ;

o.x=o.y=o.z=60;


if (DEBUG) {
    st = new Date().getTime();
    fps=0;
}

function pp(x, y, v) {
    c.fillStyle = 'hsla('+[hue,v*80+'%',v*light+'%',1];
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
    return mM(0,msq(p.x*p.x+p.y*p.y+p.z*p.z)-r);
}

function DE_box(p, r) {
    p = {
        x:mM(ma(p.x)-r,0),
        y:mM(ma(p.y)-r,0),
        z:mM(ma(p.z)-r,0)
    };
    return msq(p.x*p.x+p.y*p.y+p.z*p.z);
}

function DE_displaced_sphere(p, r) {
    var d1,d2;
    d1 = DE_sphere(p, r);
    d2 = ms(1.5*p.x)*ms(1.5*p.y);
    return d1+d2;
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
    var f=1,imax=20;
    var x,y,d,b,distance,dd,p,i,walk=1/20;

    o.z+=beatsync<16?walk:0;
    o.x+=beatsync<16?0:walk;
    theta+=PI/60;

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
                if (ROTATE) {
                    p=translate(p,-o.x,-o.y,-o.z);
                    p=rotate_Z(p,theta);
                    p=rotate_Y(p,theta/3);
                    p=translate(p,o.x,o.y,o.z);
                }

                //dd = DE_box(mod_xz(p,1), 0.2);

                dd = DE_sphere(mod_xz(p,1), 0.2);
                //dd = DE_sphere(p,1);
                distance+=dd;
                if (dd < 5e-4) break;
            }
            b=(1-i/imax);

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

