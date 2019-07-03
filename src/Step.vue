<template>
    <g class="step" :transform="`translate(${x} 0)`">
        <text text-anchor="middle"
              :x="bucketWidth / 2"
              :y="-borderRadius - 20">
            {{ title }}
        </text>
        <Bucket v-for="(bucket, index) in buckets"
                ref="buckets"
                :key="bucket.title"
                :x="x"
                :y="bucketsY[index]"
                :y-scale="yScale"
                :step-scale="stepScale"
                :bucket="bucket"
                :bucket-width="bucketWidth"
                @height-change="onBucketHeightChange(index, $event)"/>
    </g>
</template>

<script>
    import Vue from 'vue';
    import Bucket from './Bucket';

    export default {
        name: 'Step',
        components: { Bucket },
        props: {
            stepData: {
                type: Object,
                required: true
            },
            bucketWidth: {
                type: Number,
                required: true
            },
            bucketMargin: {
                type: Number,
                required: true
            },
            borderRadius: {
                type: Number,
                default: 3
            },
            x: {
                type: Number,
                required: true
            },
            yScale: {
                type: Number,
                required: true
            },
            containerHeight: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                bucketsHeights: this.stepData.buckets.map(() => 0),
                autoScale: 1
            };
        },
        computed: {
            id() {
                return this.stepData.id;
            },
            title() {
                return this.stepData.title;
            },
            buckets() {
                return this.stepData.buckets;
            },
            bucketsY() {
                let sum = 0;
                return this.bucketsHeights.map((height) => {
                    const y = sum;
                    sum += height + this.bucketMargin;
                    return y;
                });
            },
            bucketsHeightSum() {
                return this.bucketsHeights.reduce((acc, height) => acc + height, 0);
            },
            marginsSum() {
                return (this.buckets.length - 1) * this.bucketMargin;
            },
            stepScale() {
                return this.stepData.scale === 'auto' ? this.autoScale / this.yScale : (this.stepData.scale || 1);
            },
            xOut() {
                return this.x + this.bucketWidth;
            }
        },
        watch: {
            bucketsHeightSum: {
                handler(value) {
                    if (this.stepData.scale !== 'auto') {
                        this.$emit('height-change', value, this.marginsSum);
                    }
                },
                immediate: false
            }
        },
        mounted() {
            if (this.stepData.scale === 'auto') {
                this.calculateAutoHeight();
            }
        },
        methods: {
            onBucketHeightChange(index, height) {
                Vue.set(this.bucketsHeights, index, height);
            },
            calculateAutoHeight() {
                const totalValue = this.$refs.buckets.reduce((acc, bucket) => acc + bucket.value, 0);
                const totalMargins = (this.buckets.length - 1) * this.bucketMargin;
                const scale = (this.containerHeight - totalMargins) / totalValue;
                this.autoScale = scale;
            },
            acquireInputSlot(bucket, value, weight) {
                const bucketComponent = this.$refs.buckets.find(b => b.id === bucket);
                // console.log('input slot', this.stepData.id, bucket);
                return bucketComponent.acquireInputSlot(value, weight);
            },
            acquireOutputSlot(bucket, value, weight) {
                const bucketComponent = this.$refs.buckets.find(b => b.id === bucket);
                return bucketComponent.acquireOutputSlot(value, weight);
            }
        }
    };
</script>

<style scoped>
    .step text {
        text-transform: uppercase;
        font-size: 1em;
        font-weight: bold;
        fill: #172b4d;
    }
</style>
