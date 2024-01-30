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

        setInterval(() => { this.runState() }, 40)
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
        if (this.buffer.length >= this.buffer.limitation){
            print("Буфер очереди состояний переполнен. Величина очереди:", this.buffer.length)
            return false
        }
        const object = Object.assign({},this.state[name])
        object.cb = cb
        this.buffer.push(object)

        object.spriteNumberNow = null       //какой спрайт в данный момент виден (от 0 до (число спрайтов -1))
    }

    removeAction(obj){
        const index = this.buffer.indexOf(obj)
        if(index === -1){
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

// setTimeout(() => {
    
// }, 1000)

document.addEventListener("click", () => Bug.addAction("blink", (action) => Bug.removeAction(action)))