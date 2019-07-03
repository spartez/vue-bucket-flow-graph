<template>
    <g>
        <Flow v-for="flow in flows"
              :ref="flows"
              :key="`${flow.source.step}-${flow.source.bucket}-${flow.target.step}-${flow.target.bucket}`"
              :source="flow.source"
              :target="flow.target"
              :bucket-width="bucketWidth"
              :entities="flow.entities"/>
    </g>
</template>

<script>
    import Flow from './Flow';
    import { buildFlows } from './utils';

    export default {
        name: 'Flows',
        components: { Flow },
        props: {
            bucketWidth: {
                type: Number,
                required: true
            },
            steps: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                flows: []
            };
        },
        watch: {
            steps: {
                handler() {
                    this.buildFlows();
                },
                immediate: true
            }
        },
        methods: {
            buildFlows() {
                this.$nextTick(() => {
                    const flows = buildFlows(this.steps);
                    flows.sort((a, b) => {
                        if (a.source.stepIndex === b.source.stepIndex) {
                            return a.source.bucketIndex - b.source.bucketIndex;
                        }
                        return b.source.stepIndex - a.source.stepIndex;
                    });
                    this.flows = flows;
                });
            }
        }
    };
</script>
