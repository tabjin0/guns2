/************************************ Stage的方法 *************************************/

/**
 * Stage表示整个canvas区域
 */
class Stage {

    constructor(props) {
        this.bgCanvas = props.bgCanvas;
        this.bgCtx = this.bgCanvas.getContext('2d');
        this.canvas = props.canvas;
        this.ctx = this.canvas.getContext('2d');

        this.backgroundImg = props.backgroundImg;

        // 用一个数组来保存canvas中的元素。每一个元素都是一个Sprite类的实例。
        this.spriteList = [];

        // 获取canvas在视窗中的位置，以便计算用户touch时，相对与canvas内部的坐标。
        const pos = this.canvas.getBoundingClientRect();
        this.canvasOffsetLeft = pos.left;
        this.canvasOffsetTop = pos.top;

        this.dragSpriteTarget = null;// 拖拽的对象
        this.scaleSpriteTarget = null;// 缩放的对象
        this.rotateSpriteTarget = null;// 旋转的对象

        this.dragStartX = undefined;
        this.dragStartY = undefined;
        this.scaleStartX = undefined;
        this.scaleStartY = undefined;
        this.rotateStartX = undefined;
        this.rotateStartY = undefined;

        this.initEvent();

    }

    /**
     * stage添加sprite，
     * spriteList先入spriteList，再通过drawSprite()加入canvas
     */
    append(sprite) {
        this.spriteList.push(sprite);
        console.log("添加至列表");
        console.log("打印spriteList列表");
        console.log(this.spriteList);// Array[]  0: Object { id: 1562120734373, text: "niubi", color: undefined, … }
        // console.log(this.spriteList[0]);
        this.drawSprite();
    }

    /**
     * Stage
     * 监听事件
     * 用户开始触摸(touchstart)时，获取用户的触摸对象，是Sprite的本体？删除按钮？缩放按钮？旋转按钮？并且根据各种情况，对变化参数进行初始化。
     * 用户移动手指(touchmove)时，根据手指的坐标，更新stage中的所有元素的位置、大小，记录变化参数。修改对应sprite的属性值。同时对canvas进行重绘。
     * 用户一旦停止触摸(touchend)时，根据变化参数，更新sprite的坐标，同时对变化参数进行重置。
     * 在touchmove的过程中，并不需要更新sprite的坐标，只需要记录变化的参数即可。在touchend过程中，再进行坐标的更新。坐标的唯一用处，就是判断用户点击时，落点是否在指定区域内。
     */
    // initEvent() {
    //     this.canvas.addEventListener('touchstart', e => {
    //         this.handleTouchStart(e);// 触摸开始
    //     });
    //     this.canvas.addEventListener('touchend', () => {
    //         this.handleTouchEnd();// 触摸结束
    //     });
    //     this.canvas.addEventListener('touchmove', e => {
    //         this.handleTouchMove(e);// 触摸中
    //         e.preventDefault();
    //     }, { passive: false });
    // }
    initEvent() {
        // var backgroundImg = new Image();
        // backgroundImg.src = "C:\\Users\\tabjin\\Desktop\\微信图片_20180903230729.jpg";
        // backgroundImg.onload = function() {
        //     this.ctx.drawImage(backgroundImg, 0, 0);
        // }

        this.canvas.addEventListener('mousedown', e => {
            this.handleTouchStart(e);// 触摸开始
        });
        this.canvas.addEventListener('mouseup', () => {
            this.handleTouchEnd();// 触摸结束
        });
        this.canvas.addEventListener('mousemove', e => {
            this.handleTouchMove(e);// 触摸中
            e.preventDefault();
        }, { passive: false });
    }



    /**
     * initEvent()
     * 处理touchstart
     */
    handleTouchStart(e) {
        const touchEvent = this.normalizeTouchEvent(e);// 返回点击坐标

        if (!touchEvent) {
            return;
        }
        let target = null

        // 触摸在sprite上，可以拖动
        if (target = this.getTouchSpriteTarget(touchEvent)) {// 返回当前touch的sprite
            this.initDragEvent(target, touchEvent);// 初始化sprite的拖拽事件
            return;
        }

        // 缩放
        if (target = this.getTouchTargetOfSprite(touchEvent, 'scaleIcon')) {// 判断是否touch在了sprite中的某一部分上，返回这个sprite
            this.initScaleEvent(target, touchEvent);// 初始化sprite的缩放事件
            return;
        }

        // 旋转
        if (target = this.getTouchTargetOfSprite(touchEvent, 'rotateIcon')) {// 判断是否touch在了sprite中的某一部分上，返回这个sprite
            this.initRotateEvent(target, touchEvent);// 初始化sprite的角度事件
            return;
        }

        // 删除
        if (target = this.getTouchTargetOfSprite(touchEvent, 'delIcon')) {// 判断是否touch在了sprite中的某一部分上，返回这个sprite
            this.remove(target);// 从canvas场景中删除
            return;
        }

    }

    /**
     * initEvent()
     * 处理touchmove
     */
    handleTouchMove(e) {

        const touchEvent = this.normalizeTouchEvent(e);// 返回点击坐标
        if (!touchEvent) {
            return;
        }
        const { touchX, touchY } = touchEvent;

        // 拖拽
        if (this.dragSpriteTarget) {
            this.reCalSpritePos(this.dragSpriteTarget, touchX, touchY);// 通过触摸的坐标重新计算sprite的坐标
            this.drawSprite();
            return;
        }

        // 缩放
        if (this.scaleSpriteTarget) {
            this.reCalSpriteSize(this.scaleSpriteTarget, touchX, touchY);// 通过触摸的【横】坐标重新计算sprite的大小
            this.drawSprite();
            return;
        }

        // 旋转
        if (this.rotateSpriteTarget) {
            this.reCalSpriteRotate(this.rotateSpriteTarget, touchX, touchY);// 重新计算sprite的角度
            this.drawSprite();
            return;
        }

    }

    /**
     * initEvent()
     * 处理touchend
     */
    handleTouchEnd() {
        if(this.rotateSpriteTarget) {
            this.rotateSpriteTarget.updateCoordinateByRotate();// 旋转的对象  根据旋转角度更新sprite的所有部分的顶点坐标
        }
        if(this.scaleSpriteTarget) {
            this.scaleSpriteTarget.updateCoordinateByScale();// 缩放的对象 根据缩放比更新顶点坐标，根据大小改变
        }
        this.scaleSpriteTarget = null;// 置空缩放的对象
        this.dragSpriteTarget = null;// 置空拖拽的对象
        this.rotateSpriteTarget = null;// 置空旋转的对象
    }

    /**
     * handleTouchStart(e)
     * 初始化sprite的拖拽事件
     */
    initDragEvent(sprite, { touchX, touchY }) {
        this.dragSpriteTarget = sprite;
        this.dragStartX = touchX;
        this.dragStartY = touchY;
    }

    /**
     * handleTouchStart(e)
     * 初始化sprite的缩放事件
     */
    initScaleEvent(sprite, { touchX, touchY }) {
        this.scaleSpriteTarget = sprite;
        this.scaleStartX = touchX;
        this.scaleStartY = touchY;
    }

    /**
     * handleTouchStart(e)
     * 初始化sprite的缩放事件
     */
    initRotateEvent(sprite, { touchX, touchY }) {
        this.rotateSpriteTarget = sprite;
        this.rotateStartX = touchX;
        this.rotateStartY = touchY;
    }

    /**
     * handleTouchMove(e)
     * 通过触摸的坐标重新计算sprite的坐标
     */
    reCalSpritePos(sprite, touchX, touchY) {
        const [oX, oY] = sprite.pos;
        const dirX = touchX - this.dragStartX;
        const dirY = touchY - this.dragStartY;
        sprite.resetPos(dirX, dirY);
        this.dragStartX = touchX;
        this.dragStartY = touchY;
    }

    /**
     * handleTouchMove(e)
     * 通过触摸的【横】坐标重新计算sprite的大小
     */
    reCalSpriteSize(sprite, touchX, touchY) {
        console.log("reCalSpriteSize");
        // console.log(sprite);
        // 使用X轴方向作为缩放比例的判断标准
        const [centerX, centerY] = sprite.center;// 获得当前sprite的中心坐标
        const startVector = [this.scaleStartX - centerX, this.scaleStartY - centerY];
        const endVector = [touchX - centerX, touchY - centerY];
        const dirVector = [touchX - this.scaleStartX, touchY - this.scaleStartY];
        const startVectorLength = Math.sqrt(Math.pow(startVector[0], 2) + Math.pow(startVector[1],2));
        const endVectorLength = Math.sqrt(Math.pow(endVector[0], 2) + Math.pow(endVector[1],2));
        const dirX = Math.abs(dirVector[0]);
        const dirY = Math.abs(dirVector[1]);
        let dir = dirX > dirY ? dirX : dirY;
        if(endVectorLength < startVectorLength) {
            dir = -dir;
        }
        sprite.resetSize(dir);
        this.scaleStartX = touchX;
        this.scaleStartY = touchY;
    }

    /**
     * handleTouchMove(e)
     * 重新计算sprite的角度
     */
    reCalSpriteRotate(sprite, touchX, touchY) {
        const [centerX, centerY] = sprite.center;
        const x1 = this.rotateStartX - centerX;
        const y1 = this.rotateStartY - centerY;
        const x2 = touchX - centerX;
        const y2 = touchY - centerY;

        // 因为sin函数
        const numerator =  x1 * y2 - y1 * x2;
        const denominator = Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2)) * Math.sqrt(Math.pow(x2, 2) + Math.pow(
                    y2, 2));
        const sin = numerator / denominator;
        const angleDir = Math.asin(sin);

        sprite.setRotateAngle(angleDir);
        this.rotateStartX = touchX;
        this.rotateStartY = touchY;
    }

    /**
     * handleTouchStart(e)
     * 返回当前touch的sprite
     */
    getTouchSpriteTarget({ touchX, touchY }) {
        return this.spriteList.reduce((sum, sprite) => { // 这里一直循环到最后，保证每一次移动的都是最后插入的sprite
            if (this.checkIfTouchIn({ touchX, touchY }, sprite)) {
                sum = sprite;
            }
            return sum;
        }, null);
    }

    /**
     * handleTouchStart(e)
     * 判断是否touch在了sprite中的某一部分上，返回这个sprite
     */
    getTouchTargetOfSprite({ touchX, touchY }, part) {
        // console.log("part");
        // console.log(part);
        return this.spriteList.reduce((sum, sprite) => {
            // 判断是否在在某个sprite中移动。当前默认所有的sprite都是长方形的。
            if (this.checkIfTouchIn({ touchX, touchY }, sprite[part])) {
                sum = sprite;
                // console.log("sprite[part]");
                // console.log(sprite[part]);
            }
            return sum;
        }, null);
    }

    /**
     * handleTouchStart(e)
     * handleTouchMove(e)
     * 返回点击坐标
     */
    normalizeTouchEvent(e) {
        // const touches = [].slice.call(e.touches);
        // console.log("777777777777777");
        // // console.log(touches);
        // console.log(e);
        // if (touches.length > 1) { // 多点触摸，不做处理
        //     return;
        // }
        // const target = touches[0];
        const touchX = e.pageX - this.canvasOffsetLeft;
        const touchY = e.pageY - this.canvasOffsetTop;
        return {
            touchX,
            touchY
        }
    }

    /**
     * getTouchSpriteTarget({ touchX, touchY })
     * getTouchTargetOfSprite({ touchX, touchY }, part)
     * 判断是否在在某个sprite中移动。当前默认所有的sprite都是长方形的。
     */
    checkIfTouchIn({ touchX, touchY }, sprite) {
        if (!sprite) {
            return false;
        }
        const [[x1, y1], [x2, y2], [x3, y3], [x4, y4]] = sprite.coordinate;
        const v1 = [x1 - touchX, y1 - touchY];
        const v2 = [x2 - touchX, y2 - touchY];
        const v3 = [x3 - touchX, y3 - touchY];
        const v4 = [x4 - touchX, y4 - touchY];
        if(
            (v1[0] * v2[1] - v2[0] * v1[1]) > 0
            && (v2[0] * v4[1] -  v4[0] * v2[1]) > 0
            && (v4[0] * v3[1] - v3[0] * v4[1]) > 0
            && (v3[0] * v1[1] -  v1[0] * v3[1]) > 0
        ){
            return true;
        }
        return false;

    }

    /**
     * handleTouchStart(e)
     * 从canvas场景中删除
     */
    remove(sprite) {
        console.log("sprite id");
        console.log(sprite.id);// 点击的sprite id
        console.log("删除的sprite的id  start");
        this.spriteList = this.spriteList.filter(item => {
            console.log(item.id);
            return item.id !== sprite.id;
        });
        console.log("删除的sprite的id  end");

        console.log("剩下的sprite的id start");
        this.spriteList.forEach(item => {
            console.log(item.id);
        });
        console.log("剩下的sprite的id end");
        this.drawSprite();// 重绘sprite
    }

    /**
     * append(sprite)
     * handleTouchMove(e)
     * remove(sprite)
     * 多次重绘，添加至canvas
     */
    drawSprite() {
        this.clearStage();// 先清除
        this.bgCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
        this.bgCtx.drawImage(this.backgroundImg, 0, 0, this.bgCanvas.width, this.bgCanvas.height);
        this.spriteList.forEach(item => {
            item.draw(this.ctx);
        });
        this.bgCtx.drawImage(this.canvas, 0, 0);// 离屏canvas
    }

    /**
     * drawSprite()
     * 清除再重绘
     */
    clearStage() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}