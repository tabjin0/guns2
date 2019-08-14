/************************************ Sprite的方法 *************************************/

/**
 * Sprite表示canvas中的元素
 */
class Sprite {

    constructor(props) {

        // 每一个sprite都有一个唯一的id
        this.id = Date.now() + Math.floor(Math.random() * 10);

        this.text = props.text;
        this.colorMap = props.colorMap;
        this.fontSize = props.fontSize;
        this.font = props.font;

        this.pos = props.pos;// 在canvas中的位置
        this.size = props.size;// sprite的当前大小
        this.baseSize = props.size;// sprite的初始化大小
        this.minSize = props.minSize;// sprite缩放时允许的最小size
        this.maxSize = props.maxSize;// sprite缩放时允许的最大size

        // 中心点坐标
        this.center = [props.pos[0] + props.size[0] / 2, props.pos[1] + props.size[1] / 2];// 元素中间
        this.delIcon = {};// 删除标志
        this.scaleIcon = {};// 尺寸标志
        this.rotateIcon = {};// 旋转标志

        // 四个顶点的坐标,顺序为：左上，右上，左下，右下
        this.coordinate = this.setCoordinate(this.pos, this.size);// 位置、大小调节

        this.rotateAngle = 0; // 一共旋转的角度
        this.rotateAngleDir = 0; // 每次旋转角度差值

        this.scalePercent = 1; // 一共缩放的比例
        this.parent = this;
        this.show_level = props.show_level;

        this.init();
    }

    /**
     * initDelIcon()
     * initScaleIcon()
     * initRotateIcon()
     * 设置四个顶点的初始化坐标
     * @param pos 位置
     * @param size 大小
     * @returns {[*,*,*,*]}
     */
    setCoordinate(pos, size) {
        return [
            [pos[0], pos[1]],
            [pos[0] + size[0], pos[1]],
            [pos[0], pos[1] + size[1]],
            [pos[0] + size[0], pos[1] + size[1]]
        ];
    }

    setIconCoordinate(point) {
        return [
            [point[0] - ICON_HEIGHT / 2, point[1] - ICON_HEIGHT / 2],
            [point[0] + ICON_HEIGHT / 2, point[1] - ICON_HEIGHT / 2],
            [point[0] - ICON_HEIGHT / 2, point[1] + ICON_HEIGHT / 2],
            [point[0] + ICON_HEIGHT / 2, point[1] + ICON_HEIGHT / 2]
        ];
    }

    /**
     * 根据旋转角度更新sprite的所有部分的顶点坐标
     */
    updateCoordinateByRotate() {
        const angle = this.rotateAngleDir;
        this.updateItemCoordinateByRotate(this, this.center, angle);
        this.updateItemCoordinateByRotate(this.delIcon, this.center, angle);
        this.updateItemCoordinateByRotate(this.scaleIcon, this.center, angle);
        this.updateItemCoordinateByRotate(this.rotateIcon, this.center, angle);
        this.rotateAngleDir = 0;
    }

    /**
     * 根据缩放比例更新顶点坐标
     */
    updateItemCoordinateByScale(sprite, center, scale) {
        const [centerX, centerY] = center;
        const coordinateVector = sprite.coordinate.map(point => {
            return [point[0] - centerX, point[1] - centerY];
        });
        const newCoordinateVector = coordinateVector.map(vector => {
            const [x, y] = vector;
            const newX = x * scale;
            const newY = y * scale;
            return [newX, newY];
        });
        sprite.coordinate = newCoordinateVector.map(vector => {
            return [vector[0] + centerX, vector[1] + centerY];
        });
    }

    /**
     * 根据按钮icon的顶点坐标获取icon中心点坐标
     */
    getIconCenter(iconCoordinate) {
        const point1 = iconCoordinate[0];
        const point4 = iconCoordinate[3];
        const x = (point1[0] + point4[0]) / 2;
        const y = (point1[1] + point4[1]) / 2;
        return [x, y];
    }

    /**
     * 根据按钮icon的中心点坐标获取icon的顶点坐标
     */
    getIconCoordinateByIconCenter(center) {
        const [x, y] = center;
        return [
            [x - ICON_HEIGHT / 2, y - ICON_HEIGHT / 2],// 左上角
            [x + ICON_HEIGHT / 2, y - ICON_HEIGHT / 2],// 右上角
            [x - ICON_HEIGHT / 2, y + ICON_HEIGHT / 2],// 左下角
            [x + ICON_HEIGHT / 2, y + ICON_HEIGHT / 2]// 右下角
        ];
    }

    /**
     * 根据缩放比更新顶点坐标，根据大小改变
     */
    updateCoordinateByScale() {
        const scale = this.size[0] / this.baseSize[0];

        // 左上角旋转按钮
        const [rotateCenterX, rotateCenterY] = this.getIconCenter(this.rotateIcon.coordinate);
        const rotateVector = [rotateCenterX - this.center[0], rotateCenterY - this.center[1]];
        const rotateVectorNew = [rotateVector[0] * scale, rotateVector[1] * scale];
        const rotateIconCenter = [rotateVectorNew[0] + this.center[0], rotateVectorNew[1] + this.center[1]];
        this.rotateIcon.coordinate = this.getIconCoordinateByIconCenter(rotateIconCenter);


        // 右上角缩放按钮
        const [scaleCenterX, scaleCenterY] = this.getIconCenter(this.scaleIcon.coordinate);
        const scaleVector = [scaleCenterX - this.center[0], scaleCenterY - this.center[1]];
        const scaleVectorNew = [scaleVector[0] * scale, scaleVector[1] * scale];
        const scaleIconCenter = [scaleVectorNew[0] + this.center[0], scaleVectorNew[1] + this.center[1]];
        this.scaleIcon.coordinate = this.getIconCoordinateByIconCenter(scaleIconCenter);


        // 左下角删除按钮
        const [delCenterX, delCenterY] = this.getIconCenter(this.delIcon.coordinate);
        const delVector = [delCenterX - this.center[0], delCenterY - this.center[1]];
        const delVectorNew = [delVector[0] * scale, delVector[1] * scale];
        const delIconCenter = [delVectorNew[0] + this.center[0], delVectorNew[1] + this.center[1]];
        this.delIcon.coordinate = this.getIconCoordinateByIconCenter(delIconCenter);

        this.updateItemCoordinateByScale(this, this.center, scale);

        this.baseSize = this.size.slice(0);


    }

    /**
     * 根据旋转角度更新顶点坐标
     */
    updateItemCoordinateByRotate(target, center, angle) {
        const [centerX, centerY] = center;
        const coordinateVector = target.coordinate.map(point => {
            return [point[0] - centerX, point[1] - centerY];
        });
        const newCoordinateVector = coordinateVector.map(vector => {
            const [x, y] = vector;
            // x2 = x1 * cos - y1 * sin;
            // y2 = x1 * sin + y1 * cos;
            const newX = x * Math.cos(angle) - y * Math.sin(angle);
            const newY = x * Math.sin(angle) + y * Math.cos(angle);
            return [newX, newY];
        });
        target.coordinate = newCoordinateVector.map(vector => {
            return [vector[0] + centerX, vector[1] + centerY];
        });
    }

    // 绘制该ctx
    draw(ctx) {
        const sprite = this;// 获取到当前sprite

        ctx.save();
        const [x, y] = sprite.pos;
        const [width, height] = sprite.size;
        ctx.beginPath();// beginPath() 方法开始一条路径，或重置当前的路径。

        if (this.rotateAngle !== 0) {
            const centerX = x + width / 2;
            const centerY = y + height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(this.rotateAngle);
            ctx.translate(-centerX, -centerY);
        }

        ctx.font = "normal " + sprite.fontSize + "px Arial";
        ctx.lineWidth = "1";
        // 颜色
        console.log(sprite.colorMap);
        var inputColorId = "inputColor-" + sprite.id;
        var inputColor = document.getElementById(inputColorId);
        // var colorSelect = document.getElementById("colorSelect").value;
        // console.log(colorSelect);
        // console.log(inputColor);
        if(inputColor == null) {
            return true;
        }
        inputColor.setAttribute('value', sprite.colorMap.get(sprite.id));
        console.log(inputColor.value);
        ctx.fillStyle = "#" + inputColor.value;
        // ctx.fillStyle = "black";
        ctx.textBaseline = "middle";
        var textSpanId = "spanTextAdd-" + sprite.id;
        var textSpan = document.getElementById(textSpanId);
        if (textSpan == null) {
            return true;
        }
        ctx.fillText(textSpan.innerText.split("\"").join(""), x, y + width / 4);
        ctx.restore();
        this.drawIcon(ctx, sprite.delIcon);// 绘制删除Icon
        this.drawIcon(ctx, sprite.rotateIcon);// 绘制旋转Icon
        this.drawIcon(ctx, sprite.scaleIcon);// 绘制尺寸Icon

    }

    /**
     * 画出该sprite对应的按钮icon
     * @param ctx
     * @param icon
     */
    drawIcon(ctx, icon) {
        ctx.beginPath();
        ctx.save();
        const [x, y] = icon.pos;
        const [width, height] = icon.size;

        if (this.rotateAngle !== 0) {
            const [spriteX, spriteY] = this.pos;
            const [spriteW, spriteH] = this.size;
            const centerX = spriteX + spriteW / 2;
            const centerY = spriteY + spriteH / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(this.rotateAngle);
            ctx.translate(-centerX, -centerY);
        }

        if (icon.self) {
            ctx.drawImage(icon.self, x, y, width, height);
        } else {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = icon.url;
            img.onload = function () {
                icon.self = img;
                ctx.drawImage(img, x, y, width, height);
            }
        }
        ctx.restore();
    }

    /**
     * 对sprite进行初始化
     */
    init() {
        this.initDelIcon();// 初始化删除按钮，左下角
        this.initRotateIcon();// 初始化旋转按钮，左上角
        this.initScaleIcon();// 初始化缩放按钮，右上角
    }

    /**
     * init()
     * 初始化删除按钮，左下角
     */
    initDelIcon() {
        const [width, height] = this.size;
        const [x, y] = this.pos;
        this.delIcon = {
            ...this.delIcon,
            pos: [x - BOX_PADDING - ICON_HEIGHT * 0.5, y + height + BOX_PADDING - ICON_HEIGHT * 0.5],
            size: [ICON_HEIGHT, ICON_HEIGHT],
            url: DEL_ICON,
            parent: this
        };
        this.delIcon.coordinate = this.setCoordinate(this.delIcon.pos, this.delIcon.size);// 设置四个顶点的初始化坐标
    }

    /**
     * init()
     * 初始化缩放按钮，右上角
     */
    initScaleIcon() {
        const [width, height] = this.size;
        const [x, y] = this.pos;// 初始化的时候随机获取
        this.scaleIcon = {
            ...this.scaleIcon,
            pos: [x + width + BOX_PADDING - ICON_HEIGHT * 0.5, y - BOX_PADDING - ICON_HEIGHT * 0.5],
            size: [ICON_HEIGHT, ICON_HEIGHT],
            url: SCALE_ICON,
            parent: this
        };

        this.scaleIcon.coordinate = this.setCoordinate(this.scaleIcon.pos, this.scaleIcon.size);// 设置四个顶点的初始化坐标
    }

    /**
     * init()
     * 初始化旋转按钮，左上角
     */
    initRotateIcon() {
        const [width, height] = this.size;
        const [x, y] = this.pos;
        this.rotateIcon = {
            ...this.rotateIcon,
            pos: [x - BOX_PADDING - ICON_HEIGHT * 0.5, y - BOX_PADDING - ICON_HEIGHT * 0.5],
            size: [ICON_HEIGHT, ICON_HEIGHT],
            url: ROTATE_ICON,
            parent: this
        };
        this.rotateIcon.coordinate = this.setCoordinate(this.rotateIcon.pos, this.rotateIcon.size);
    }

    /**
     * 重置icon的位置与大小
     */
    resetIconPos() {
        const [width, height] = this.size;
        const [x, y] = this.pos;
        this.rotateIcon = {
            ...this.rotateIcon,
            pos: [x - BOX_PADDING - ICON_HEIGHT * 0.5, y - BOX_PADDING - ICON_HEIGHT * 0.5],
            size: [ICON_HEIGHT, ICON_HEIGHT]
        };
        this.scaleIcon = {
            ...this.scaleIcon,
            pos: [x + width + BOX_PADDING - ICON_HEIGHT * 0.5, y - BOX_PADDING - ICON_HEIGHT * 0.5],
            size: [ICON_HEIGHT, ICON_HEIGHT]
        };
        this.delIcon = {
            ...this.delIcon,
            pos: [x - BOX_PADDING - ICON_HEIGHT * 0.5, y + height + BOX_PADDING - ICON_HEIGHT * 0.5],
            size: [ICON_HEIGHT, ICON_HEIGHT]
        };
    }

    /**
     * 根据移动的距离重置sprite所有部分的位置
     * @param dirX
     * @param dirY
     */
    resetPos(dirX, dirY) {
        const [oX, oY] = this.pos;
        this.pos = [oX + dirX, oY + dirY];
        this.center = [this.center[0] + dirX, this.center[1] + dirY];

        // 更新四个顶点的坐标
        this.coordinate = this.coordinate.map(point => {
            return [point[0] + dirX, point[1] + dirY];
        });

        if (this.delIcon) {
            const [x, y] = this.delIcon.pos;
            this.delIcon.pos = [x + dirX, y + dirY];
            this.delIcon.coordinate = this.delIcon.coordinate.map(point => {
                return [point[0] + dirX, point[1] + dirY];
            });
        }
        if (this.scaleIcon) {
            const [x, y] = this.scaleIcon.pos;
            this.scaleIcon.pos = [x + dirX, y + dirY];
            this.scaleIcon.coordinate = this.scaleIcon.coordinate.map(point => {
                return [point[0] + dirX, point[1] + dirY];
            });
        }
        if (this.rotateIcon) {
            const [x, y] = this.rotateIcon.pos;
            this.rotateIcon.pos = [x + dirX, y + dirY];
            this.rotateIcon.coordinate = this.rotateIcon.coordinate.map(point => {
                return [point[0] + dirX, point[1] + dirY];
            });
        }
    }

    /**
     * 根据触摸点移动的距离计算缩放比，并重置sprite的尺寸
     * @param dir
     */
    resetSize(dir) {
        // 获取当前sprite相关数据
        const sprite = this;// 获取当前sprite
        const [oWidth, oHeight] = sprite.size;// 当前sprite尺寸
        this.scalePercent = (oWidth + dir) / oWidth; // 使用x轴的长度来确定缩放的比例
        const [minWidth, minHeight] = sprite.minSize;// 最小尺寸
        const [maxWidth, maxHeight] = sprite.maxSize;// 最大尺寸
        const [centerX, centerY] = sprite.center;// 中心位置

        //
        let width = oWidth * this.scalePercent;// 宽度新尺寸
        let height = oHeight * this.scalePercent;// 高度新尺寸
        // 新尺寸控制
        width < minWidth && (width = minWidth);
        height < minHeight && (height = minHeight);
        width > maxWidth && (width = maxWidth);
        height > maxHeight && (height = maxHeight);

        const x = centerX - width / 2;
        const y = centerY - height / 2;
        sprite.pos = [x, y];
        sprite.size = [width, height];
        // 字体大小
        let fontSize = sprite.fontSize;
        sprite.fontSize = fontSize * this.scalePercent;
        sprite.resetIconPos();
    }

    /**
     * 设置sprite的旋转角度
     * @param angleDir
     */
    setRotateAngle(angleDir) {
        this.rotateAngle += angleDir;
        this.rotateAngleDir += angleDir;
    }

}