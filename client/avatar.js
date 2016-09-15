const HZ = 5;

module.exports = class Avatar {
  constructor () {
    this.el = document.createElement('a-entity');

    if (false) {
      this.addHead();
      this.addHands();
    }
  }

  start () {
    this.createAvatars();
    this.avatars.appendChild(this.el);

    this.observe();

    this.interval = setInterval(() => {
      this.tick();
    }, 1000 / HZ);
  }

  createAvatars () {
    this.avatars = document.createElement('a-entity');
    this.avatars.id = 'avatars';
    this.sceneEl.appendChild(this.avatars);
  }

  get sceneEl () {
    return document.querySelector('a-scene');
  }

  get camera () {
    return this.sceneEl.camera;
  }

  observe () {
    // observeAndDispatch(this.el, (message) => {
    //   // console.log(message);
    //   send('avatar', message);
    // });
  }

  addHead () {
    this.head = document.createElement('a-cube');
    this.head.setAttribute('color', '#f0a');
    // this.head.setAttribute('src', 'vive-headset.obj');
    this.el.appendChild(this.head);
  }

  tick () {
    // this.head.setAttribute('position', this.camera.parent.position);
    // this.head.setAttribute('rotation', this.camera.parent.rotation);
  }
}
