<template>
    <div ref="container" class="container">
        <svg v-if="containerWidth && containerHeight" class="svg">
            <defs>
                <linearGradient v-for="(flowGradient, id) in flowGradients"
                                :id="`gradient-${id}`"
                                :key="id"
                                gradientUnits="userSpaceOnUse"
                                :x1="flowGradient.outputX" y1="0"
                                :x2="flowGradient.inputX" y2="0">
                    <stop :stop-color="flowGradient.fromColor" offset="0%" />
                    <stop :stop-color="flowGradient.toColor" offset="100%" />
                </linearGradient>
                <linearGradient id="gradient-drop"
                                x1="0" y1="0"
                                x2="0" y2="1">
                    <stop stop-color="#ff5630" offset="0%" />
                    <stop stop-color="#ff5630" stop-opacity="0" offset="100%" />
                </linearGradient>
            </defs>
            <g :transform="`translate(0 ${headerHeight})`">
                <Step v-for="(step, index) in steps"
                      ref="steps"
                      :key="step.id"
                      :step-data="step"
                      :bucket-width="bucketWidth"
                      :bucket-margin="bucketMargin"
                      :x="stepX(index)"
                      :y-scale="yScale"
                      :container-height="containerHeight"
                      @height-change="onHeightChange"/>
                <Flows :key="stepsFlags"
                       :steps="steps" :bucketWidth="bucketWidth"/>
            </g>
        </svg>
    </div>
</template>

<script>
    import pDebounce from 'p-debounce';
    import Step from './Step';
    import Flows from './Flows';
    import { assignToBuckets } from './utils';

    export default {
        name: 'BucketFlowGraph',
        components: { Step, Flows },
        props: {
            data: {
                type: Object,
                required: true
            },
            headerHeight: {
                type: Number,
                default: 40
            },
            bucketMargin: {
                type: Number,
                default: 30
            },
            disabledSteps: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                containerWidth: 0,
                containerHeight: 0,
                yScale: 1,
                flowGradients: {},
                maxHeight: 0,
                maxHeightMargins: 0
            };
        },
        computed: {
            stepsFlags() {
                return this.disabledSteps.map(step => (step ? 't' : 'f')).join();
            },
            steps() {
                const steps = this.data.steps.filter(step => !this.disabledSteps.includes(step.id));
                if (this.data.entities) {
                    return assignToBuckets(this.data.entities, steps);
                }
                return steps;
            },
            stepCount() {
                return this.steps.length;
            },
            bucketWidth() {
                return this.containerWidth / (2 * this.stepCount - 1);
            }
        },
        created() {
            this.calculateSizeDebounced = pDebounce(this.calculateSize, 500);
        },
        mounted() {
            this.calculateSize();
            window.addEventListener('resize', () => this.calculateSizeDebounced());
        },
        beforeDestroy() {
            window.removeEventListener('resize', () => this.calculateSizeDebounced());
        },
        methods: {
            onHeightChange(height, margins) {
                if ((height + margins) > (this.maxHeight + this.maxHeightMargins)) {
                    this.maxHeight = height;
                    this.maxHeightMargins = margins;
                    this.$nextTick(this.calculateYScale);
                }
            },
            calculateYScale() {
                const stepYScale = Math.floor(100 * (this.containerHeight - this.maxHeightMargins) / this.maxHeight * this.yScale) / 100;
                this.yScale = stepYScale;
            },
            stepX(index) {
                return 2 * index * this.bucketWidth;
            },
            acquireInputSlot(step, bucket, value, weight) {
                const stepComponent = this.$refs.steps.find(s => s.id === step);
                return stepComponent.acquireInputSlot(bucket, value, weight);
            },
            acquireOutputSlot(step, bucket, value, weight) {
                const stepComponent = this.$refs.steps.find(s => s.id === step);
                return stepComponent.acquireOutputSlot(bucket, value, weight);
            },
            setGradient(gradient) {
                this.flowGradients = {
                    ...this.flowGradients,
                    [gradient.id]: gradient
                };
            },
            calculateSize() {
                const { width, height } = this.$refs.container.getBoundingClientRect();
                this.containerWidth = width;
                this.containerHeight = height - this.headerHeight - 20;
            }
        },
        provide() {
            return {
                acquireInputSlot: this.acquireInputSlot,
                acquireOutputSlot: this.acquireOutputSlot,
                setGradient: this.setGradient
            };
        }
    };
</script>

<style scoped>
    .container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        width: 100%;
        height: 100%;
        line-height: 0;
    }

    .svg {
        width: 100%;
        height: 100%;
        font-size: 16px;
    }
</style>
