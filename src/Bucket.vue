<template>
    <g class="bucket" :transform="`translate(0 ${y})`">
        <rect
            :x="0"
            :y="-borderRadius"
            :width="bucketWidth"
            :height="height + 2 * borderRadius"
            :fill="color"
            :rx="borderRadius"
            :ry="borderRadius" />
        <g :transform="`translate(${bucketWidth / 2} ${height / 2})`">
            <text alignment-baseline="baseline" text-anchor="middle" :x="0"
                  :y="-6" :stroke="color" :style="{textShadow: `0 0 4px ${color}`}">
                {{ title }}
            </text>
            <text class="value"
                  alignment-baseline="hanging"
                  text-anchor="middle"
                  :stroke="color"
                  :style="{textShadow: `0 0 4px ${color}`}"
                  :x="0"
                  :y="0">
                {{ value }}
            </text>
        </g>
        <g v-if="dropHeight > 0" class="drop" opacity="0.8"
           :transform="`translate(${bucketWidth} ${height-dropHeight})`">
            <path :d="`M 0 0 A ${dropWidth} ${dropWidth} 0 0 1 ${dropWidth} ${dropWidth} L 0 ${dropWidth}`" fill="#ff5630"/>
            <rect
                :x="0"
                :y="dropWidth"
                :width="dropWidth"
                :height="dropHeight"
                fill="url(#gradient-drop)"
                :rx="borderRadius"
                :ry="borderRadius" />
            <text :x="dropWidth - Math.sqrt(dropWidth) + 5" :y="dropWidth/2">
                {{ dropPercent }}%
            </text>
        </g>
    </g>
</template>

<script>
    export default {
        name: 'Bucket',
        props: {
            bucket: {
                type: Object,
                required: true
            },
            borderRadius: {
                type: Number,
                default: 0
            },
            bucketWidth: {
                type: Number,
                required: true
            },
            x: {
                type: Number,
                required: true
            },
            y: {
                type: Number,
                required: true
            },
            yScale: {
                type: Number,
                required: true
            },
            stepScale: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                inputSlots: [],
                outputSlots: []
            };
        },
        computed: {
            id() {
                return this.bucket.id;
            },
            color() {
                return this.bucket.color;
            },
            title() {
                return this.bucket.title;
            },
            value() {
                return this.bucket.value || this.bucket.entities.length;
            },
            height() {
                const value = this.bucket.value || (this.bucket.entities && this.bucket.entities.length);
                const height = value * this.yScale * this.stepScale;
                return Math.max(height, 3);
            },
            dropValue() {
                return (this.bucket.drop && this.bucket.drop.length) || 0;
            },
            dropPercent() {
                return Math.round(this.dropValue / this.value * 100);
            },
            dropHeight() {
                return this.dropValue > 0 ? this.dropValue * this.yScale * this.stepScale : 0;
            },
            dropWidth() {
                return 5 + Math.min(40, this.dropHeight);
            }
        },
        watch: {
            height: {
                handler(value) {
                    this.$emit('height-change', value);
                },
                immediate: true
            }
        },
        updated() {
            this.recalculateSlots();
        },
        methods: {
            recalculateSlots() {
                // if (this.id === 'bucketL') console.log('recalc');
                // this.inputSlots.sort((a, b) => a.weight - b.weight);
                for (let i = 0; i < this.inputSlots.length; i += 1) {
                    const { y, height } = this.inputSlots[i - 1] ? this.inputSlots[i - 1] : { y: this.y, height: 0 };
                    // if (this.id === 'bucketL') console.log(this.inputSlots[i]);
                    this.inputSlots[i].x = this.x;
                    this.inputSlots[i].y = y + height;
                    this.inputSlots[i].height = Math.max(this.inputSlots[i].value * this.yScale * this.stepScale, 3);
                }
                // this.outputSlots.sort((a, b) => a.weight - b.weight);
                for (let i = 0; i < this.outputSlots.length; i += 1) {
                    const { y, height } = this.outputSlots[i - 1] ? this.outputSlots[i - 1] : { y: this.y, height: 0 };
                    this.outputSlots[i].x = this.x + this.bucketWidth;
                    this.outputSlots[i].y = y + height;
                    this.outputSlots[i].height = Math.max(this.outputSlots[i].value * this.yScale * this.stepScale, 3);
                }
            },
            acquireInputSlot(value, weight) {
                // console.log('acquire input', this.id);
                const slot = {
                    value,
                    weight,
                    x: this.x,
                    y: 0,
                    bucketValue: this.value,
                    height: value * this.yScale * this.stepScale,
                    color: this.color,
                    free: () => this.freeInputSlot(slot)
                };
                this.inputSlots.push(slot);
                this.recalculateSlots();
                return this.inputSlots[this.inputSlots.length - 1];
            },
            acquireOutputSlot(value, weight) {
                // console.log('acquire output', this.id);
                const slot = {
                    value,
                    weight,
                    bucketValue: this.value,
                    x: this.x + this.bucketWidth,
                    y: 0,
                    height: value * this.yScale * this.stepScale,
                    color: this.color,
                    free: () => this.freeOutputSlot(slot)
                };
                this.outputSlots.push(slot);
                this.recalculateSlots();
                return this.outputSlots[this.outputSlots.length - 1];
            },
            freeInputSlot(slot) {
                const index = this.inputSlots.findIndex(s => s === slot);
                this.inputSlots.splice(index, 1);
                // this.recalculateSlots();
            },
            freeOutputSlot(slot) {
                const index = this.outputSlots.findIndex(s => s === slot);
                this.outputSlots.splice(index, 1);
                // this.recalculateSlots();
            }
        }
    };
</script>

<style scoped>
    .bucket text {
        fill: white;
        stroke-linecap: butt;
        stroke-linejoin: miter;
        stroke-width: 2px;
        paint-order: stroke;
    }

    .bucket text.value {
        font-size: 1.5em;
    }

    .drop text {
        font-size: 0.8em;
        fill: #ff5630;
    }
</style>
