print = console.log

class Cat {
    /**
     * 
     * @param {array} object {name:name {root:rootDom, url:[urlStart, urlEnd], number:number}}
     */
    constructor(objects) {
        this.state = {}
        for (let obj of objects) {
            this.state[obj.name] = obj
            this.__createState(this.state[obj.name])
        }

        this.buffer = []
        this.buffer.limitation = 5
        this.buffer.currentState

        this.acctive = false
        this.time = 40
        setInterval(() => { if (this.acctive === true) this.runState() }, this.time)
    }
    __run(number) {
        if (typeof number === "number" && number > 0) {
            const counter = (cb) => {
                let num = number
                let time = this.time
                tick(cb)

                function tick(cb) {
                    if (num <= 0) return
                    num--
                    // print(num)
                    setTimeout(() => {
                        cb()
                        tick(cb)
                    }, time)
                }
            }
            print(this)
            counter(() => this.runState())

            return
        }
        this.acctive = true
    }
    __pause() {
        this.acctive = false
    }
    __isActive() {
        return this.acctive
    }

    __createState(obj) {
        obj.root.insertAdjacentHTML("afterbegin", `<div class="${obj.name}"></div>`)

        const wrapper = obj.root.querySelector(`.${obj.name}`)

        let imgsHTML = ""
        for (let i = 0; i < obj.number; i++) {
            imgsHTML += `<img src="${obj.url[0] + i.toString().padStart(2, '0') + obj.url[1]}" alt="" hidden>`
        }
        wrapper.innerHTML = imgsHTML

        obj.wrapper = wrapper
        obj.imgs = wrapper.querySelectorAll("img")

    }

    addAction(name, cb) {
        if (this.buffer.length >= this.buffer.limitation) {
            print("Буфер очереди состояний переполнен. Величина очереди:", this.buffer.length)
            return false
        }
        const object = Object.assign({}, this.state[name])
        object.cb = cb
        this.buffer.push(object)

        object.spriteNumberNow = null       //какой спрайт в данный момент виден (от 0 до (число спрайтов -1))
    }

    removeAction(obj) {
        const index = this.buffer.indexOf(obj)
        if (index === -1) {
            print("обьект не найден")
            return false
        }
        this.buffer.splice(index, 1)
        return true
    }

    runState() {
        if (this.buffer.length === 0) return

        if (!this.buffer.currentState) {
            this.buffer.currentState = this.buffer[this.buffer.length - 1]
        }

        let obj = this.buffer.currentState


        if (obj.spriteNumberNow >= obj.number - 1) {
            if (obj) obj.cb(obj)

            if (obj !== this.buffer[this.buffer.length - 1]) {
                obj.imgs[obj.spriteNumberNow].hidden = true
                obj.spriteNumberNow = null

                obj = this.buffer.currentState = this.buffer[this.buffer.length - 1]
                this.runState()
                return
            }

            obj.imgs[obj.spriteNumberNow].hidden = true
            obj.spriteNumberNow = null
            this.runState()
            return
        }
        if (obj.spriteNumberNow === null) {
            obj.spriteNumberNow = 0
            obj.imgs[0].hidden = false
            return
        }
        if (obj.spriteNumberNow <= obj.number - 1) {
            obj.spriteNumberNow = obj.spriteNumberNow + 1
            obj.imgs[obj.spriteNumberNow - 1].hidden = true
            obj.imgs[obj.spriteNumberNow].hidden = false
            return
        }

        print(obj.spriteNumberNow)
    }
}

const Bug = new Cat([
    { name: "base", root: images, url: ["./img//basic/f_", ".png"], number: 20 },
    { name: "blink", root: images, url: ["./img/blink/hh_", ".png"], number: 20 }
])

Bug.addAction("base", () => print("Туц туц"))
// Bug.__run(1)

// document.addEventListener("click", () => {
Bug.__run()

document.addEventListener("click", () => {
    Bug.addAction("blink", (action) => Bug.removeAction(action))
})
// }, { once: true })

function soundStarted() {
    document.body.insertAdjacentHTML("beforeend", `<audio id="bg_sound" src="./sound/track_1.mp3"></audio>`)

    const bgcPlayer = document.getElementById('bg_sound');
    bgcPlayer.volume = 0.15;
    bgcPlayer.muted = true;
    bgcPlayer.muted = false;
    bgcPlayer.play()
    bgcPlayer.loop = true;
}


setTimeout(() => {
    modal_window.classList.remove("hidden")
}, 12000)

modal_window.addEventListener("click", event => {
    const target = event.target
    if (target.closest(".button.no")) {
        print("no")
        modal_window.remove()
        return
    }
    if (target.closest(".button.yes")) {
        soundStarted()
        modal_window.remove()
        return
    }
})