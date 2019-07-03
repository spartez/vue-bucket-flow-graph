<template>
    <g>
        <g class="flow" opacity="0.5">
            <path v-if="hasSameScales"
                  :stroke="`url('#gradient-${id}')`"
                  :stroke-width="inputHeight"
                  fill="none"
                  :d="path" />
            <path v-else
                  :fill="`url('#gradient-${id}')`"
                  :d="path" />
            <rect :fill="`url('#gradient-${id}')`"
                  :x="middleX - labelWidth/2"
                  :y="middleY - labelHeight/2"
                  :width="labelWidth"
                  :height="labelHeight"
                  :rx="5"
                  :ry="5" />
        </g>
        <g ref="labels" class="labels">
            <text :font-size="fontSize" :x="middleX" :y="middleY - 1"
                  dominant-baseline="baseline"
                  text-anchor="middle">
                {{ percentFormatted }}%
            </text>
            <text :font-size="fontSize" :x="middleX" :y="middleY + 3"
                  :style="{ transformOrigin: `${middleX}px ${middleY}px`, transform: 'scale(.7)' }"
                  dominant-baseline="hanging"
                  text-anchor="middle">
                ({{ value }})
            </text>
        </g>
    </g>
</template>

<script>
    export default {
        name: 'Flow',
        inject: ['acquireInputSlot', 'acquireOutputSlot', 'setGradient'],
        props: {
            source: {
                type: Object,
                required: true
            },
            target: {
                type: Object,
                required: true
            },
            entities: {
                type: Array,
                required: true
            },
            bucketWidth: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                output: { x: 0, y: 0, height: 0 },
                input: { x: 0, y: 0, height: 0 },
                labelHeight: 0,
                labelWidth: 0
            };
        },
        computed: {
            value() {
                return this.entities.length;
            },
            percent() {
                return this.value / this.output.bucketValue;
            },
            percentFormatted() {
                return this.percent < 0.01 ? '<1' : Math.round(100 * this.percent);
            },
            id() {
                return `${this.source.step}-${this.source.bucket}-${this.target.step}-${this.target.bucket}`;
            },
            width() {
                return Math.abs(this.inputX - this.outputX);
            },
            outputTopBezier() {
                const thickness = Math.abs(this.outputY1 - this.outputY2);
                const heightDiff = Math.abs(this.outputY1 - this.inputY1);
                return this.bezierWidth / 2 + thickness / 2 - (heightDiff / (this.bezierWidth + 1) * 3);
            },
            outputBottomBezier() {
                const thickness = Math.abs(this.outputY1 - this.outputY2);
                const heightDiff = Math.abs(this.outputY2 - this.inputY2);
                return this.bezierWidth / 2 - thickness / 2 - (heightDiff / (this.bezierWidth + 1) * 3);
            },
            inputTopBezier() {
                const thickness = Math.abs(this.inputY1 - this.inputY2);
                const heightDiff = Math.abs(this.outputY1 - this.inputY1);
                return this.bezierWidth / 2 + thickness / 2 - (heightDiff / (this.bezierWidth + 1) * 3);
            },
            inputBottomBezier() {
                const thickness = Math.abs(this.inputY1 - this.inputY2);
                const heightDiff = Math.abs(this.outputY2 - this.inputY2);
                return this.bezierWidth / 2 - thickness / 2 - (heightDiff / (this.bezierWidth + 1) * 3);
            },
            skipsOverNextStep() {
                return this.width > 2 * this.bucketWidth;
            },
            extensionWidth() {
                return this.skipsOverNextStep ? this.width - this.bucketWidth : 0;
            },
            bezierWidth() {
                return this.skipsOverNextStep ? this.width - this.extensionWidth : this.width;
            },
            bezierHeight1() {
                return Math.round(100 * (this.inputY1 - this.outputY1)) / 100;
            },
            bezierHeight2() {
                return Math.round(100 * (this.outputY2 - this.inputY2)) / 100;
            },
            fontSize() {
                const ratio = 0.7 + (this.value / this.input.bucketValue) * 0.3;
                return `${ratio}em`;
            },
            labelRadius() {
                return 5;
            },
            inputHeight() {
                return Math.round(100 * Math.abs(this.inputY1 - this.inputY2)) / 100;
            },
            outputHeight() {
                return Math.round(100 * Math.abs(this.outputY1 - this.outputY2)) / 100;
            },
            hasSameScales() {
                return this.inputHeight === this.outputHeight && this.outputY1 !== this.inputY1;
            },
            path() {
                if (this.hasSameScales) {
                    return [
                        `M ${this.outputX} ${this.outputY1 + this.inputHeight / 2}`,
                        this.skipsOverNextStep ? `h ${this.extensionWidth}` : '',
                        `c ${(this.outputTopBezier + this.outputBottomBezier) / 2} ${0}, ${(this.inputTopBezier + this.inputBottomBezier) / 2} ${this.bezierHeight1}, ${this.bezierWidth} ${this.bezierHeight1}`
                    ].join(' ');
                }
                return [
                    `M ${this.outputX} ${this.outputY1}`,
                    this.skipsOverNextStep ? `h ${this.extensionWidth}` : '',
                    `c ${this.outputTopBezier} ${0}, ${this.inputTopBezier} ${this.bezierHeight1}, ${this.bezierWidth} ${this.bezierHeight1}`,
                    `L ${this.inputX} ${this.inputY2}`,
                    `c ${-this.inputBottomBezier} ${0}, ${-this.outputBottomBezier} ${this.bezierHeight2}, ${-this.bezierWidth} ${this.bezierHeight2}`,
                    this.skipsOverNextStep ? `h ${-this.extensionWidth}` : '',
                    'Z'
                ].join(' ');
            },
            outputX() {
                return this.output.x;
            },
            outputY1() {
                return this.output.y;
            },
            outputY2() {
                return this.output.y + this.output.height;
            },
            inputX() {
                return this.input.x;
            },
            inputY1() {
                return this.input.y;
            },
            inputY2() {
                return this.input.y + this.input.height;
            },
            middleX() {
                return this.outputX + this.width / 2;
            },
            middleY() {
                return this.skipsOverNextStep ? ((this.outputY1 + this.outputY2) / 2) : (((this.outputY1 + this.outputY2) / 2) + ((this.inputY1 + this.inputY2) / 2)) / 2;
            }
        },
        watch: {
            fontSize() {
                this.$nextTick(() => {
                    const { width, height } = this.$refs.labels.getBoundingClientRect();
                    this.labelHeight = height + 4;
                    this.labelWidth = width + 8;
                });
            },
            inputX() {
                this.setGradient({
                    id: this.id,
                    fromColor: this.output.color,
                    toColor: this.input.color,
                    outputX: this.output.x,
                    inputX: this.input.x
                });
            },
            outputX() {
                this.setGradient({
                    id: this.id,
                    fromColor: this.output.color,
                    toColor: this.input.color,
                    outputX: this.output.x,
                    inputX: this.input.x
                });
            },
            value() {
                this.input.free();
                this.output.free();
                this.acquireSlots();
            }
        },
        mounted() {
            this.acquireSlots();
            this.setFlowGradient();
        },
        beforeDestroy() {
            this.input.free();
            this.output.free();
        },
        methods: {
            acquireSlots() {
                const outputWeight = Math.abs(this.source.stepIndex - this.target.stepIndex) * 1000 + this.target.bucketIndex;
                this.output = this.acquireOutputSlot(this.source.step, this.source.bucket, this.entities.length, outputWeight);
                const inputWeight = Math.abs(this.source.stepIndex - this.target.stepIndex) * 1000 + this.source.bucketIndex;
                this.input = this.acquireInputSlot(this.target.step, this.target.bucket, this.entities.length, inputWeight);
            },
            setFlowGradient() {
                this.setGradient({
                    id: this.id,
                    fromColor: this.output.color,
                    toColor: this.input.color,
                    outputX: this.output.x,
                    inputX: this.input.x
                });
            }
        }
    };
</script>

<style scoped>
    .labels text {
        fill: white;
    }
</style>
