import gsap from 'gsap';
import { Container, Filter, Sprite } from 'pixi.js';

const JUMP_HEIGHT = 3;
const JUMP_DURATION = 0.1;

const plant = new Container();

const fragmentShader = `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;

    uniform float force;    
    uniform float shrink;    
    
    void main(){
        float center = 0.4;
        float y = vTextureCoord.y;
        float dx = vTextureCoord.x - center;
        float dy = force * dx * dx + shrink * (1.0 - y);

        float _shrink = 0.01 * force;


        vec2 uv = vec2( vTextureCoord.x, vTextureCoord.y - dy );
        
        gl_FragColor = texture2D(uSampler, uv);
    }

`;

const uniforms = {
	force: 0,
	shrink: 0,
};

const filter = new Filter(null, fragmentShader, uniforms);

export function generatePlant(textureLeafs, texturesPot) {
	plant.addChild(new Sprite(texturesPot));
	const leafs = new Sprite(textureLeafs);

	leafs.filters = [filter];

	plant.addChild(leafs);
	return plant;
}

export function jumpPlant() {
	const tl = gsap.timeline();

	movePot(tl);
	moveLeafs(tl);
}

function movePot(tl) {
	const y = plant.y;

	tl.to(plant, {
		y: y - JUMP_HEIGHT,
		duration: JUMP_DURATION,
	});

	tl.to(plant, {
		y: y,
		duration: JUMP_DURATION,
	});
}

function moveLeafs(tl) {
	tl.to(uniforms, {
		force: 0.15,
		shrink: 0.02,
		duration: JUMP_DURATION,
	});

	tl.to(uniforms, {
		force: 0,
		shrink: 0,
		duration: 10 * JUMP_DURATION,
		ease: 'elastic.out(1, 0.3)',
	});
}
