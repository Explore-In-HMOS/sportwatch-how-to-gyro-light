import sensor from '@system.sensor';

export default {
    data: {
        brightness: 255,
        angle: 0,
        bgColor: 'rgb(255, 255, 255)',
        neutralY: 0
    },

    onInit() {
        const that = this;

        setTimeout(() => {
            sensor.subscribeAccelerometer({
                interval: 'ui',
                success: (data) => {
                    if (that.neutralY === 0) {
                        that.neutralY = data.y;
                    }

                    const relativeY = data.y - that.neutralY;
                    that.angle = Math.round(relativeY * 50);

                    const clampedAngle = Math.max(-45, Math.min(45, that.angle));
                    that.brightness = Math.round(((clampedAngle + 45) / 90) * 255);

                    const val = that.brightness;
                    that.bgColor = `rgb(${val}, ${val}, ${val})`;
                },
                fail: (data, code) => {
                    console.error('Sensor error: ' + code);
                }
            });
        }, 300);
    },

    calibrate() {
        this.neutralY = 0;
        this.brightness = 255;
        this.angle = 0;
        this.bgColor = 'rgb(255, 255, 255)';
    },

    onDestroy() {
        sensor.unsubscribeAccelerometer();
    }
}