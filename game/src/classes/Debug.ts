import GUI from 'lil-gui';

class Debug {
  public gui: GUI;
  public state: {
    actors: boolean;
    helpers: boolean;
  };

  constructor(canvas: HTMLCanvasElement) {
    this.gui = new GUI();
    this.state = {
      actors: false,
      helpers: false,
    };

    this.gui.add(this.state, 'actors').name('Debug Actors');
    this.gui.add(this.state, 'helpers').name('Debug Helpers');

    this.gui.domElement.addEventListener('pointerdown', () => {
      setTimeout(() => canvas.focus(), 0);
    });

    this.hide();
  }

  public show(): void {
    this.gui.domElement.style.display = 'block';
  }

  public hide(): void {
    this.gui.domElement.style.display = 'none';
  }
}

let debug: Debug;

export function initializeDebug(canvas: HTMLCanvasElement): Debug {
  if (!debug) {
    debug = new Debug(canvas);
  }
  return debug;
}

export { debug };
